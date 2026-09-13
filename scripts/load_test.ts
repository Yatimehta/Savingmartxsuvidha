async function runStressTest() {
  console.log('⚡ Starting high-concurrency traffic stress test on VegiMart × Suvidha...');

  const endpoints = [
    'http://localhost:3000/api/health',
    'http://localhost:3000/api/products',
    'http://localhost:3000/api/payment/config',
    'http://localhost:3000/catalog',
    'http://localhost:3000/'
  ];

  const totalRequests = 100;
  const concurrency = 20;
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;

  const startAll = Date.now();

  async function makeRequest(index: number) {
    const url = endpoints[index % endpoints.length];
    const t0 = Date.now();
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json, text/html' } });
      const elapsed = Date.now() - t0;
      latencies.push(elapsed);
      if (res.status >= 200 && res.status < 400) {
        successful++;
      } else {
        failed++;
        console.error(`Request ${index} failed with status: ${res.status}`);
      }
    } catch (e: any) {
      failed++;
      console.error(`Request ${index} error:`, e.message);
    }
  }

  // Run in concurrent chunks
  const queue = Array.from({ length: totalRequests }, (_, i) => i);
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item !== undefined) {
        await makeRequest(item);
      }
    }
  });

  await Promise.all(workers);
  const totalTime = (Date.now() - startAll) / 1000;

  latencies.sort((a, b) => a - b);
  const minLatency = latencies[0] || 0;
  const maxLatency = latencies[latencies.length - 1] || 0;
  const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1));
  const p95Latency = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const rps = (totalRequests / totalTime).toFixed(1);

  console.log('\n================ STRESS TEST RESULTS ================');
  console.log(`Total Requests Sent : ${totalRequests}`);
  console.log(`Successful (2xx/3xx) : ${successful} (${((successful / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Failed (4xx/5xx/Net) : ${failed}`);
  console.log(`Total Duration      : ${totalTime.toFixed(2)}s`);
  console.log(`Throughput          : ${rps} requests/sec`);
  console.log(`Min Latency         : ${minLatency}ms`);
  console.log(`Average Latency     : ${avgLatency}ms`);
  console.log(`P95 Latency         : ${p95Latency}ms`);
  console.log(`Max Latency         : ${maxLatency}ms`);
  console.log('=====================================================\n');

  if (failed > 0) {
    console.error('❌ Stress test had failures!');
    process.exit(1);
  } else {
    console.log('✅ PASS: Server handled all concurrent traffic with 100% success rate & zero downtime.');
  }
}

runStressTest();
