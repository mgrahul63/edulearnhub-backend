import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post('/create-checkout-session', isAuthenticated, async (req, res) => {
  try {
    const { courseId, courseName, coursePrice, discount } = req.body;
    const userId = req.userId;

    const finalPrice = coursePrice - (discount * coursePrice / 100);

    if (!courseId || !courseName || coursePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: courseName,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?courseId=${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
    });

    res.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify Payment
router.post('/verify-session', isAuthenticated, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // TODO: Database update korben pore
      res.json({
        success: true,
        message: 'Payment verified'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;