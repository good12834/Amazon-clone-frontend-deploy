import React from 'react';
import classes from './PaymentMethods.module.css';

function PaymentMethods({ selectedMethod, onMethodChange }) {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with your PayPal account',
      popular: false
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: '📱',
      description: 'Touch ID or Face ID',
      popular: false
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: '🎯',
      description: 'Fast and secure payments',
      popular: false
    }
  ];

  return (
    <div className={classes.payment_methods}>
      <h3>Payment Method</h3>
      <p>Choose your preferred payment method</p>

      <div className={classes.methods_grid}>
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`${classes.method_card} ${selectedMethod === method.id ? classes.selected : ''}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className={classes.method_radio}
            />

            <div className={classes.method_content}>
              <div className={classes.method_header}>
                <span className={classes.method_icon}>{method.icon}</span>
                <div className={classes.method_info}>
                  <h4 className={classes.method_name}>{method.name}</h4>
                  {method.popular && (
                    <span className={classes.popular_badge}>Most Popular</span>
                  )}
                </div>
              </div>

              <p className={classes.method_description}>{method.description}</p>

              {method.id === 'card' && (
                <div className={classes.card_logos}>
                  <span className={classes.card_logo}>💳</span>
                  <span className={classes.card_logo}>💳</span>
                  <span className={classes.card_logo}>💳</span>
                </div>
              )}
            </div>

            <div className={classes.method_checkmark}>
              {selectedMethod === method.id && <span>✓</span>}
            </div>
          </label>
        ))}
      </div>

      <div className={classes.payment_security}>
        <div className={classes.security_features}>
          <div className={classes.security_item}>
            <span className={classes.security_icon}>🔒</span>
            <span>SSL Encrypted</span>
          </div>
          <div className={classes.security_item}>
            <span className={classes.security_icon}>🛡️</span>
            <span>PCI Compliant</span>
          </div>
          <div className={classes.security_item}>
            <span className={classes.security_icon}>⚡</span>
            <span>Instant Processing</span>
          </div>
        </div>
      </div>

      {selectedMethod === 'paypal' && (
        <div className={classes.paypal_notice}>
          <p>You will be redirected to PayPal to complete your payment securely.</p>
        </div>
      )}

      {selectedMethod === 'apple_pay' && (
        <div className={classes.apple_pay_notice}>
          <p>Apple Pay is available on iPhone, iPad, Mac, and Apple Watch.</p>
        </div>
      )}

      {selectedMethod === 'google_pay' && (
        <div className={classes.google_pay_notice}>
          <p>Google Pay works with Android devices and Chrome browser.</p>
        </div>
      )}
    </div>
  );
}

export default PaymentMethods;