import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5175', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5175'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Payment endpoint
app.post('/payment/create', async (req, res) => {
  try {
    const total = req.query.total;
    console.log('Payment Request Received for amount:', total);
    console.log('Stripe Key available:', !!process.env.STRIPE_KEY);
    console.log('Stripe Key length:', process.env.STRIPE_KEY?.length);

    if (!process.env.STRIPE_KEY) {
      throw new Error('STRIPE_KEY environment variable is not set');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
    });

    console.log('Payment Intent created successfully:', paymentIntent.id);

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Payment server is running!');
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});