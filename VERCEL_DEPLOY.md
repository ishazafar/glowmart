# Vercel Deployment Guide for Glow Mart

## Quick Deploy

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the settings

## Environment Variables Setup

After deploying, you need to set environment variables in Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required:
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` for test mode or `sk_live_` for production)

### Optional:
- `STRIPE_WEBHOOK_SECRET` - For webhook signature verification (starts with `whsec_`)

### Setting via CLI:
```bash
vercel env add STRIPE_SECRET_KEY
# Paste your key when prompted

vercel env add STRIPE_WEBHOOK_SECRET
# Paste your webhook secret when prompted
```

## Update Stripe Publishable Key

After deployment, update the Stripe Publishable Key in `cart.html`:

1. Get your publishable key from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Open `cart.html`
3. Find this line (around line 174):
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_PUBLISHABLE_KEY_HERE";
   ```
4. Replace with your actual publishable key

## API Routes

The following API endpoints are available:

- `POST /api/create-checkout-session` - Creates a Stripe checkout session
- `POST /api/webhook` - Handles Stripe webhook events
- `GET /api/health` - Health check endpoint

## Webhook Configuration

To set up Stripe webhooks:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your Vercel URL: `https://your-project.vercel.app/api/webhook`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret
6. Add it as `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

## Testing

After deployment:

1. Visit your Vercel URL
2. Add items to cart
3. Test checkout with Stripe test card: `4242 4242 4242 4242`
4. Use any future expiry date, any CVC, and any ZIP code

## Troubleshooting

### "Failed to create checkout session"
- Verify `STRIPE_SECRET_KEY` is set in Vercel environment variables
- Check that the key starts with `sk_test_` (test mode) or `sk_live_` (production)
- Ensure you've redeployed after adding environment variables

### CORS Errors
- The API routes already have CORS enabled
- Make sure you're accessing the site from the correct domain

### Webhook Not Working
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check that the webhook URL in Stripe dashboard matches your Vercel URL
- Ensure the webhook endpoint is `/api/webhook`

## Production Checklist

- [ ] Set `STRIPE_SECRET_KEY` in Vercel environment variables
- [ ] Update `STRIPE_PUBLISHABLE_KEY` in `cart.html` with live key (if using production mode)
- [ ] Configure webhook endpoint in Stripe dashboard
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Vercel (optional but recommended)
- [ ] Test the checkout flow
- [ ] Switch Stripe to live mode when ready (update both keys)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

