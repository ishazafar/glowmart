const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Use the STRIPE_SECRET_KEY environment variable in your Firebase Functions config
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key);

app.post('/create-checkout-session', async (req, res) => {
  const { cart } = req.body;
  if(!cart || !Array.isArray(cart) || cart.length === 0){
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try{
    // Expect each cart item to include a `priceId` that exists in your Stripe account
    const line_items = cart.map(item => {
      if(!item.priceId) throw new Error('Missing priceId on an item');
      return { price: item.priceId, quantity: item.qty || 1 };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || 'https://your-domain.example/success.html',
      cancel_url: process.env.CANCEL_URL || 'https://your-domain.example/cart.html'
    });

    res.json({ sessionId: session.id });
  }catch(err){
    console.error('create-checkout-session error', err);
    res.status(500).json({ error: err.message });
  }
});

exports.app = functions.https.onRequest(app);
