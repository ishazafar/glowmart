// Vercel serverless function for Stripe webhooks
// Note: For webhook signature verification to work properly, you may need to
// configure the webhook endpoint in Vercel to pass raw body
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY_HERE');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set. Webhook signature verification disabled.');
    // Continue without verification (not recommended for production)
  }

  let event;

  try {
    // Vercel provides the body as a string or Buffer
    // For proper webhook verification, we need the raw body
    let rawBody;
    
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf8');
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    } else {
      // If body was parsed as JSON, we need to stringify it back
      // Note: This may not work perfectly for signature verification
      // Consider using Vercel's raw body option or a middleware
      rawBody = JSON.stringify(req.body);
    }

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Without webhook secret, parse as regular JSON (not secure)
      event = typeof req.body === 'object' ? req.body : JSON.parse(rawBody);
      console.warn('⚠️ Webhook processed without signature verification');
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful! Session ID:', session.id);
      // Here you can update your database, send confirmation emails, etc.
      // Access session data: session.amount_total, session.customer_email, etc.
      break;
    case 'payment_intent.succeeded':
      console.log('✅ Payment intent succeeded:', event.data.object.id);
      break;
    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

