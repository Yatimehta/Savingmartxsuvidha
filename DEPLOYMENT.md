# Deployment Guide: VegiMart × Suvidha

This guide outlines deployment procedures for the **VegiMart × Suvidha** platform across Vercel, Railway, Docker, and DigitalOcean.

---

## 1. Deploying to Vercel (Recommended for Next.js)

### Step 1: Connect Repository
1. Push your repository to GitHub or GitLab.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `savingmartxsuvidha` repository.

### Step 2: Configure Environment Variables
In the Vercel project settings under **Environment Variables**, add:
- `NEXT_PUBLIC_APP_URL` = `https://your-domain.vercel.app`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (or test key)
- `STRIPE_SECRET_KEY` = `sk_live_...` (or test key)
- `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_live_...` (or test key)
- `RAZORPAY_KEY_SECRET` = `your_razorpay_secret`
- `RAZORPAY_WEBHOOK_SECRET` = `your_razorpay_webhook_secret`
- `DATABASE_URL` = (Optional PostgreSQL connection string from Vercel Postgres, Supabase, or Railway)

### Step 3: Deploy & Verify
Click **Deploy**. Vercel will build the Next.js App Router application and provision edge and serverless functions for all API routes.

---

## 2. Deploying with Docker Compose (Full Stack + PostgreSQL)

For self-hosted instances on Ubuntu/Debian/AWS EC2:

### Step 1: Clone and Configure
```bash
git clone <your-repo-url>
cd savingmartxsuvidha
cp .env.example .env
```

### Step 2: Start Containers
```bash
docker compose up -d --build
```
This boots:
1. `vegimart_postgres`: PostgreSQL 16 with persistent volume `postgres_data`.
2. `vegimart_web`: Next.js production standalone container mapped to port 3000.

### Step 3: Seed Database
```bash
docker compose exec web npm run db:seed
```

### Step 4: Verify Health
```bash
docker compose ps
curl http://localhost:3000/api/payment/config
```

---

## 3. Deploying on Railway

1. Create a new project on [Railway.app](https://railway.app).
2. Add a **PostgreSQL Database** plugin.
3. Add a **GitHub Repo** service pointing to this repository.
4. Reference the Railway PostgreSQL database URL in your service environment variables:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
5. Set `NEXT_PUBLIC_APP_URL` to your Railway domain.
6. Deploy! Railway will detect the Dockerfile or Node.js buildpack and launch the service.

---

## 4. Webhook Configuration

### Stripe Webhook Setup:
1. In the Stripe Dashboard, go to **Developers > Webhooks**.
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the Signing Secret and set it as `STRIPE_WEBHOOK_SECRET`.

### Razorpay Webhook Setup:
1. In the Razorpay Dashboard, go to **Settings > Webhooks**.
2. Add endpoint: `https://your-domain.com/api/webhooks/razorpay`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Copy the Secret and set it as `RAZORPAY_WEBHOOK_SECRET`.
