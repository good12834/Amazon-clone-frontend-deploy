import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import LayOut from '../../LayOut/LayOut';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import ShippingAddress from './ShippingAddress';
import PaymentMethods from './PaymentMethods';
import orderService from '../../../services/orderService';
import authService from '../../../services/authService';
import { useStateValue } from '../../../Context/StateProvider';
import classes from './Checkout.module.css';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51EXAMPLE...');

function Checkout() {
  const navigate = useNavigate();
  const { state: { cart, totalAmount }, dispatch } = useStateValue();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use real cart data from context
  const cartItems = cart;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = totalAmount > 0 ? totalAmount : (subtotal + shipping + tax);

  const handleShippingSubmit = (addressData) => {
    setShippingAddress(addressData);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current user
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order object
      const orderData = {
        userId: user.uid,
        items: cartItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        status: 'processing',
        date: new Date().toISOString(),
        notes: orderNotes,
        tracking: {
          number: `TRK${Date.now()}`,
          carrier: 'Amazon Logistics',
          status: 'Processing',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      };

      // Save order to Firestore
      const orderId = await orderService.createOrder(orderData);
      orderData.id = orderId;

      console.log('Order created:', orderData);

      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });

      // Simulate success
      setIsProcessing(false);
      navigate('/order-confirmation', { state: { order: orderData } });

    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  const steps = [
    { id: 1, title: 'Shipping', completed: currentStep > 1 },
    { id: 2, title: 'Payment', completed: currentStep > 2 },
    { id: 3, title: 'Review', completed: false }
  ];

  return (
    <LayOut>
      <div className={classes.checkout_container}>
        <div className={classes.checkout_header}>
          <h1>Checkout</h1>
          <div className={classes.checkout_steps}>
            {steps.map((step) => (
              <div
                key={step.id}
                className={`${classes.step} ${currentStep === step.id ? classes.active : ''} ${step.completed ? classes.completed : ''}`}
              >
                <div className={classes.step_number}>
                  {step.completed ? '✓' : step.id}
                </div>
                <div className={classes.step_title}>{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.checkout_content}>
          <div className={classes.checkout_main}>
            {currentStep === 1 && (
              <ShippingAddress
                address={shippingAddress}
                onSubmit={handleShippingSubmit}
                onBack={() => navigate('/cart')}
              />
            )}

            {currentStep === 2 && (
              <div className={classes.payment_section}>
                <PaymentMethods
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />

                {paymentMethod === 'card' && (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      onSubmit={handlePaymentSubmit}
                      amount={total}
                    />
                  </Elements>
                )}

                {paymentMethod === 'paypal' && (
                  <div className={classes.paypal_section}>
                    <p>PayPal payment would be implemented here.</p>
                    <button className={classes.paypal_btn} disabled>
                      Pay with PayPal
                    </button>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className={classes.apple_pay_section}>
                    <p>Apple Pay payment would be implemented here.</p>
                    <button className={classes.apple_pay_btn} disabled>
                      Pay with Apple Pay
                    </button>
                  </div>
                )}

                {paymentMethod === 'google_pay' && (
                  <div className={classes.google_pay_section}>
                    <p>Google Pay payment would be implemented here.</p>
                    <button className={classes.google_pay_btn} disabled>
                      Pay with Google Pay
                    </button>
                  </div>
                )}

                <div className={classes.order_notes}>
                  <label htmlFor="notes">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add any special instructions..."
                    rows="3"
                  />
                </div>
              </div>
            )}
          </div>

          <div className={classes.checkout_sidebar}>
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />

            <div className={classes.checkout_actions}>
              {currentStep > 1 && (
                <button
                  className={classes.back_btn}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isProcessing}
                >
                  ← Back to Shipping
                </button>
              )}

              <button
                className={classes.continue_btn}
                onClick={() => currentStep === 1 ? setCurrentStep(2) : null}
                disabled={isProcessing}
              >
                {currentStep === 1 ? 'Continue to Payment' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Checkout;