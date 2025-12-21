// Vercel serverless function for creating Stripe checkout session
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY_HERE');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cart } = req.body;

  // Validate cart
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Get the origin/host from request headers
    const origin = req.headers.origin || req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${origin}`;

    // Convert cart items to Stripe line items
    const line_items = cart.map(item => {
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
            imageUrl = new URL(item.image, baseUrl).href;
          }
        } catch (e) {
          console.warn('Invalid image URL:', item.image);
        }
      }
      
      // Build product_data object
      const productData = {
        name: productName,
        images: imageUrl ? [imageUrl] : []
      };
      
      // Only add description if it's not empty
      if (item.description && item.description.trim() !== '') {
        productData.description = item.description.trim();
      }
      
      return {
        price_data: {
          currency: 'usd', // Using USD for test mode
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
      success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel.html`,
      metadata: {
        cart_items: JSON.stringify(cart.map(item => ({ name: item.name || item.id, qty: item.qty })))
      }
    });

    console.log('✅ Checkout session created:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    const errorMessage = error.type === 'StripeInvalidRequestError' 
      ? `Stripe error: ${error.message}` 
      : error.message || 'Unknown error';
    
    res.status(500).json({ 
      error: errorMessage,
      type: error.type || 'UnknownError'
    });
  }
};

