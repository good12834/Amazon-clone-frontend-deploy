import React from 'react';
import classes from './OrderSummary.module.css';

function OrderSummary({ items, subtotal, shipping, tax, total }) {
  return (
    <div className={classes.order_summary}>
      <h3>Order Summary</h3>

      <div className={classes.order_items}>
        {items.map((item) => (
          <div key={item.id} className={classes.order_item}>
            <img src={item.image} alt={item.title} className={classes.item_image} />
            <div className={classes.item_details}>
              <h4 className={classes.item_title}>{item.title}</h4>
              <p className={classes.item_quantity}>Qty: {item.quantity}</p>
              <p className={classes.item_price}>${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={classes.order_totals}>
        <div className={classes.total_row}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className={classes.total_row}>
          <span>Shipping:</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className={classes.total_row}>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className={`${classes.total_row} ${classes.final_total}`}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className={classes.shipping_info}>
        <div className={classes.shipping_badge}>
          <span className={classes.shipping_icon}>🚚</span>
          <span>Free Shipping</span>
        </div>
        <p className={classes.shipping_note}>
          Orders over $50 qualify for free shipping
        </p>
      </div>

      <div className={classes.guarantee}>
        <div className={classes.guarantee_item}>
          <span className={classes.guarantee_icon}>🔒</span>
          <span>Secure Checkout</span>
        </div>
        <div className={classes.guarantee_item}>
          <span className={classes.guarantee_icon}>↩️</span>
          <span>30-Day Returns</span>
        </div>
        <div className={classes.guarantee_item}>
          <span className={classes.guarantee_icon}>⭐</span>
          <span>Customer Support</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;