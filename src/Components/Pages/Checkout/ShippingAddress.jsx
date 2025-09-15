import React, { useState } from 'react';
import classes from './ShippingAddress.module.css';

function ShippingAddress({ address, onSubmit, onBack }) {
  const [formData, setFormData] = useState(address);
  const [errors, setErrors] = useState({});
  const [useBillingAsShipping, setUseBillingAsShipping] = useState(true);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={classes.shipping_address}>
      <div className={classes.section_header}>
        <h2>Shipping Address</h2>
        <p>Please enter your shipping information</p>
      </div>

      <form onSubmit={handleSubmit} className={classes.address_form}>
        <div className={classes.form_row}>
          <div className={classes.form_group}>
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={errors.firstName ? classes.error : ''}
            />
            {errors.firstName && <span className={classes.error_text}>{errors.firstName}</span>}
          </div>

          <div className={classes.form_group}>
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={errors.lastName ? classes.error : ''}
            />
            {errors.lastName && <span className={classes.error_text}>{errors.lastName}</span>}
          </div>
        </div>

        <div className={classes.form_row}>
          <div className={classes.form_group}>
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? classes.error : ''}
            />
            {errors.email && <span className={classes.error_text}>{errors.email}</span>}
          </div>

          <div className={classes.form_group}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={errors.phone ? classes.error : ''}
            />
            {errors.phone && <span className={classes.error_text}>{errors.phone}</span>}
          </div>
        </div>

        <div className={classes.form_group}>
          <label htmlFor="address">Street Address *</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main Street, Apt 4B"
            className={errors.address ? classes.error : ''}
          />
          {errors.address && <span className={classes.error_text}>{errors.address}</span>}
        </div>

        <div className={classes.form_row}>
          <div className={classes.form_group}>
            <label htmlFor="city">City *</label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={errors.city ? classes.error : ''}
            />
            {errors.city && <span className={classes.error_text}>{errors.city}</span>}
          </div>

          <div className={classes.form_group}>
            <label htmlFor="state">State/Province *</label>
            <input
              id="state"
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={errors.state ? classes.error : ''}
            />
            {errors.state && <span className={classes.error_text}>{errors.state}</span>}
          </div>

          <div className={classes.form_group}>
            <label htmlFor="zipCode">ZIP/Postal Code *</label>
            <input
              id="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              className={errors.zipCode ? classes.error : ''}
            />
            {errors.zipCode && <span className={classes.error_text}>{errors.zipCode}</span>}
          </div>
        </div>

        <div className={classes.form_group}>
          <label htmlFor="country">Country *</label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
          </select>
        </div>

        <div className={classes.checkbox_group}>
          <label className={classes.checkbox_label}>
            <input
              type="checkbox"
              checked={useBillingAsShipping}
              onChange={(e) => setUseBillingAsShipping(e.target.checked)}
            />
            <span className={classes.checkbox_text}>
              Use this address as my billing address
            </span>
          </label>
        </div>

        <div className={classes.shipping_options}>
          <h3>Shipping Method</h3>
          <div className={classes.shipping_methods}>
            <label className={classes.shipping_method}>
              <input type="radio" name="shipping" value="standard" defaultChecked />
              <div className={classes.method_details}>
                <div className={classes.method_name}>Standard Shipping</div>
                <div className={classes.method_time}>3-5 business days</div>
                <div className={classes.method_price}>$9.99</div>
              </div>
            </label>

            <label className={classes.shipping_method}>
              <input type="radio" name="shipping" value="express" />
              <div className={classes.method_details}>
                <div className={classes.method_name}>Express Shipping</div>
                <div className={classes.method_time}>1-2 business days</div>
                <div className={classes.method_price}>$19.99</div>
              </div>
            </label>

            <label className={classes.shipping_method}>
              <input type="radio" name="shipping" value="overnight" />
              <div className={classes.method_details}>
                <div className={classes.method_name}>Overnight</div>
                <div className={classes.method_time}>Next business day</div>
                <div className={classes.method_price}>$29.99</div>
              </div>
            </label>
          </div>
        </div>

        <div className={classes.form_actions}>
          <button type="button" onClick={onBack} className={classes.back_button}>
            ← Back to Cart
          </button>
          <button type="submit" className={classes.continue_button}>
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShippingAddress;