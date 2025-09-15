import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement
} from '@stripe/react-stripe-js';
import classes from './CheckoutForm.module.css';
import axiosinstance from '../../../Api/axios';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

function CheckoutForm({ onSubmit, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });

  const validatePostalCode = (postalCode) => {
    // US ZIP code format: 5 digits or 5 digits + 4 digits (e.g., 10001 or 10001-1234)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(postalCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements.getElement('card').focus();
      return;
    }

    // Validate postal code before submission
    if (!billingDetails.address.postal_code || !validatePostalCode(billingDetails.address.postal_code)) {
      setError('Please enter a valid ZIP code (e.g., 10001 or 10001-1234)');
      return;
    }

    if (cardComplete) {
      setIsProcessing(true);
    }

    try {
      // Create PaymentIntent on the server
      const response = await axiosinstance.post('/payment/create?total=' + Math.round(amount * 100), {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json'
      });

      const { clientSecret } = response.data;

      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      // Confirm the PaymentIntent
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        }
      });

      if (payload.error) {
        setError(payload.error.message);
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
        onSubmit({
          paymentIntentId: payload.paymentIntent.id,
          billingDetails,
          amount
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error.response) {
        // Server responded with error status
        setError(`Server error: ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setError(error.message || 'Payment failed. Please try again.');
      }
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : '');
    setCardComplete(event.complete);
  };

  const handleBillingChange = (field, value) => {
    if (field === 'address.postal_code') {
      // Validate postal code format
      if (value && !validatePostalCode(value)) {
        setError('Please enter a valid ZIP code (e.g., 10001 or 10001-1234)');
        return;
      } else if (error === 'Please enter a valid ZIP code (e.g., 10001 or 10001-1234)') {
        setError(null);
      }
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.checkout_form}>
      <div className={classes.form_section}>
        <h3>Billing Information</h3>

        <div className={classes.form_row}>
          <div className={classes.form_group}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              required
              value={billingDetails.name}
              onChange={(e) => handleBillingChange('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className={classes.form_row}>
          <div className={classes.form_group}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={billingDetails.email}
              onChange={(e) => handleBillingChange('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className={classes.form_group}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={billingDetails.phone}
              onChange={(e) => handleBillingChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className={classes.form_group}>
          <label htmlFor="address">Billing Address</label>
          <input
            id="address"
            type="text"
            required
            value={billingDetails.address.line1}
            onChange={(e) => handleBillingChange('address.line1', e.target.value)}
            placeholder="123 Main Street"
          />
        </div>

        <div className={classes.form_row}>
          <div className={classes.form_group}>
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              required
              value={billingDetails.address.city}
              onChange={(e) => handleBillingChange('address.city', e.target.value)}
              placeholder="New York"
            />
          </div>
          <div className={classes.form_group}>
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              required
              value={billingDetails.address.state}
              onChange={(e) => handleBillingChange('address.state', e.target.value)}
              placeholder="NY"
            />
          </div>
          <div className={classes.form_group}>
            <label htmlFor="zip">ZIP Code</label>
            <input
              id="zip"
              type="text"
              required
              value={billingDetails.address.postal_code}
              onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
              placeholder="10001 or 10001-1234"
            />
          </div>
        </div>
      </div>

      <div className={classes.form_section}>
        <h3>Payment Information</h3>

        <div className={classes.card_element_container}>
          <label>Card Information</label>
          <div className={classes.card_element}>
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
        </div>

        {error && (
          <div className={classes.error_message}>
            {error}
          </div>
        )}

        <div className={classes.security_note}>
          <div className={classes.security_icon}>🔒</div>
          <div className={classes.security_text}>
            <strong>Secure Payment</strong>
            <p>Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !cardComplete}
        className={classes.pay_button}
      >
        {isProcessing ? (
          <span className={classes.processing}>
            <span className={classes.spinner}></span>
            Processing...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

export default CheckoutForm;