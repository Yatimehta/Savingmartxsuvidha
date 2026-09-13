interface RateLimitStore {
  tokens: number;
  lastRefill: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export interface RateLimiterOptions {
  interval: number; // in milliseconds
  maxTokens: number;
}

export function rateLimit(options: RateLimiterOptions = { interval: 60000, maxTokens: 60 }) {
  const { interval, maxTokens } = options;

  return {
    check(identifier: string): { success: boolean; remaining: number; reset: number } {
      const now = Date.now();
      let record = memoryStore.get(identifier);

      if (!record) {
        record = {
          tokens: maxTokens - 1,
          lastRefill: now,
        };
        memoryStore.set(identifier, record);
        return {
          success: true,
          remaining: record.tokens,
          reset: now + interval,
        };
      }

      // Calculate refills
      const elapsed = now - record.lastRefill;
      if (elapsed > interval) {
        record.tokens = maxTokens;
        record.lastRefill = now;
      }

      if (record.tokens > 0) {
        record.tokens -= 1;
        return {
          success: true,
          remaining: record.tokens,
          reset: record.lastRefill + interval,
        };
      }

      return {
        success: false,
        remaining: 0,
        reset: record.lastRefill + interval,
      };
    },
  };
}

export const standardLimiter = rateLimit({ interval: 60000, maxTokens: 100 });
export const paymentLimiter = rateLimit({ interval: 60000, maxTokens: 20 });
