# Stripe Payment Integration Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Stripe Secret Key:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
   ```

### 4. Update Cart.html

Open `cart.html` and update the Stripe Publishable Key:

```javascript
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY";
```

Also update the server URL if needed:
```javascript
const SERVER_URL = "http://localhost:3000"; // For local development
// Or: const SERVER_URL = "https://your-domain.com"; // For production
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 6. Test the Integration

1. Open your website in a browser
2. Add items to cart
3. Click "Proceed to Checkout"
4. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

## Test Cards

Stripe provides several test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

See all test cards: https://stripe.com/docs/testing

## Production Deployment

### 1. Switch to Live Mode

1. Get your **live** keys from Stripe Dashboard (toggle to "Live mode")
2. Update `.env` with live secret key
3. Update `cart.html` with live publishable key

### 2. Deploy Server

You can deploy the server to:
- **Heroku**: `git push heroku main`
- **Vercel**: Use Vercel CLI
- **AWS/Google Cloud**: Use their Node.js hosting
- **Firebase Functions**: Already configured in `firebase/functions/`

### 3. Update URLs

Update `SERVER_URL` in `cart.html` to your production server URL.

## Webhook Setup (Optional but Recommended)

Webhooks allow you to handle payment events server-side:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Add endpoint: `https://your-domain.com/webhook`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret to `.env`

## Troubleshooting

### "Stripe not configured" error
- Make sure you've set `STRIPE_PUBLISHABLE_KEY` in `cart.html`
- Check that the key starts with `pk_test_` or `pk_live_`

### "Failed to create checkout session"
- Verify `STRIPE_SECRET_KEY` is set in `.env`
- Make sure the server is running
- Check that `SERVER_URL` in `cart.html` matches your server

### CORS errors
- The server already has CORS enabled
- Make sure you're accessing the site from the same origin or update CORS settings

### Currency Issues
- Currently set to PKR (Pakistani Rupee)
- To change currency, update `currency: 'pkr'` in `server.js`
- Note: Stripe supports many currencies, check their docs

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)

