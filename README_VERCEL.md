# Glow Mart - Vercel Deployment

## 🚀 Quick Deploy

### Using Vercel CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Using GitHub:
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables (see below)
4. Deploy!

## ⚙️ Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

- **STRIPE_SECRET_KEY** (required): Your Stripe secret key
- **STRIPE_WEBHOOK_SECRET** (optional): For webhook verification

## 📝 After Deployment

1. Update `STRIPE_PUBLISHABLE_KEY` in `cart.html` (line ~174)
2. Configure webhook in Stripe Dashboard → Webhooks
3. Test checkout with card: `4242 4242 4242 4242`

## 📚 Full Documentation

See `VERCEL_DEPLOY.md` for detailed instructions.

