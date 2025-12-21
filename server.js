// Simple Express server for Stripe Checkout
// Run: node server.js

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ 
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Stripe with secret key from environment variable
// Get your secret key from: https://dashboard.stripe.com/test/apikeys
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY_HERE');

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  const { cart } = req.body;

  // Validate cart
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Convert cart items to Stripe line items
    // Using price_data allows dynamic pricing without pre-creating products in Stripe
    const line_items = cart.map(item => {
      // Handle different cart item structures (name/title/id)
      const productName = item.name || item.title || item.id || 'Product';
      const productPrice = parseFloat(item.price) || 0;
      const quantity = parseInt(item.qty) || 1;
      
      // Handle image URL - support both relative and absolute URLs
      let imageUrl = null;
      if (item.image) {
        try {
          // If it's already a full URL, use it
          if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
            imageUrl = item.image;
          } else {
            // Otherwise, construct full URL
            imageUrl = new URL(item.image, `${req.protocol}://${req.get('host')}`).href;
          }
        } catch (e) {
          console.warn('Invalid image URL:', item.image);
        }
      }
      
      // Build product_data object - only include description if it has a value
      const productData = {
        name: productName,
        images: imageUrl ? [imageUrl] : []
      };
      
      // Only add description if it's not empty (Stripe doesn't allow empty strings)
      if (item.description && item.description.trim() !== '') {
        productData.description = item.description.trim();
      }
      
      return {
        price_data: {
          currency: 'usd', // Using USD for test mode (PKR not available in test mode)
          product_data: productData,
          unit_amount: Math.round(productPrice * 100), // Convert to cents
        },
        quantity: quantity,
      };
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
      metadata: {
        cart_items: JSON.stringify(cart.map(item => ({ name: item.name || item.id, qty: item.qty })))
      }
    });

    console.log('✅ Checkout session created:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // More detailed error response
    const errorMessage = error.type === 'StripeInvalidRequestError' 
      ? `Stripe error: ${error.message}` 
      : error.message || 'Unknown error';
    
    res.status(500).json({ 
      error: errorMessage,
      type: error.type || 'UnknownError'
    });
  }
});

// Webhook endpoint for handling Stripe events (optional but recommended)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful!', session.id);
      // Here you can update your database, send confirmation emails, etc.
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set STRIPE_SECRET_KEY in your .env file`);
  console.log(`💳 Test cards: https://stripe.com/docs/testing`);
});

