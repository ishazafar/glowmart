Firebase Functions: create-checkout-session

Setup:

1. Install dependencies inside `firebase/functions`:

```bash
cd firebase/functions
npm install
```

2. Set your Stripe secret key in Firebase Functions config or environment:

```bash
# Using firebase CLI
firebase functions:config:set stripe.secret_key="sk_test_YOUR_SECRET_KEY"
```

3. Deploy functions:

```bash
firebase deploy --only functions
```

Notes:
- The function expects each cart item to include a `priceId` matching a Stripe Price in your Stripe account.
- Client (`cart.html`) POSTs `{ cart }` to `/create-checkout-session` and receives `{ sessionId }`.
- Replace `success_url` and `cancel_url` with your real URLs or set `SUCCESS_URL`/`CANCEL_URL` env vars.
