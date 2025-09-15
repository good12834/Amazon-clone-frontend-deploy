import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import LayOut from '../../LayOut/LayOut';
import classes from './OrderConfirmation.module.css';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  // Cart is already cleared in Checkout component
  useEffect(() => {
    if (order) {
      console.log('Order confirmed:', order.id);
    }
  }, [order]);

  if (!order) {
    return (
      <LayOut>
        <div className={classes.error_container}>
          <div className={classes.error_content}>
            <h1>Order Not Found</h1>
            <p>We couldn't find your order details.</p>
            <Link to="/" className={classes.home_btn}>
              Return to Home
            </Link>
          </div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={classes.confirmation_container}>
        {/* Success Header */}
        <div className={classes.success_header}>
          <div className={classes.success_icon}>
            <span>✅</span>
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <div className={classes.order_details}>
          <div className={classes.order_summary}>
            <h2>Order Summary</h2>
            <div className={classes.order_info}>
              <div className={classes.info_row}>
                <span className={classes.info_label}>Order Number:</span>
                <span className={classes.info_value}>{order.id}</span>
              </div>
              <div className={classes.info_row}>
                <span className={classes.info_label}>Order Date:</span>
                <span className={classes.info_value}>
                  {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className={classes.info_row}>
                <span className={classes.info_label}>Order Status:</span>
                <span className={`${classes.info_value} ${classes.status_processing}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className={classes.order_items}>
            <h3>Items Ordered</h3>
            <div className={classes.items_list}>
              {order.items.map((item) => (
                <div key={item.id} className={classes.order_item}>
                  <img src={item.image} alt={item.title} className={classes.item_image} />
                  <div className={classes.item_details}>
                    <h4 className={classes.item_title}>{item.title}</h4>
                    <p className={classes.item_quantity}>Quantity: {item.quantity}</p>
                    <p className={classes.item_price}>${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className={classes.order_totals}>
            <div className={classes.totals_breakdown}>
              <div className={classes.total_row}>
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className={classes.total_row}>
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className={classes.total_row}>
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className={`${classes.total_row} ${classes.final_total}`}>
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className={classes.shipping_info}>
          <h3>Shipping Information</h3>
          <div className={classes.address_card}>
            <div className={classes.address_details}>
              <h4>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</h4>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
              <p><strong>Email:</strong> {order.shippingAddress.email}</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className={classes.next_steps}>
          <h3>What's Next?</h3>
          <div className={classes.steps_grid}>
            <div className={classes.step_card}>
              <div className={classes.step_icon}>📧</div>
              <h4>Order Confirmation</h4>
              <p>You'll receive an email confirmation with your order details.</p>
            </div>
            <div className={classes.step_card}>
              <div className={classes.step_icon}>📦</div>
              <h4>Shipping Updates</h4>
              <p>We'll send you tracking information once your order ships.</p>
            </div>
            <div className={classes.step_card}>
              <div className={classes.step_icon}>🚚</div>
              <h4>Delivery</h4>
              <p>Your order will be delivered to the address provided.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={classes.action_buttons}>
          <Link to="/orders" className={classes.track_btn}>
            Track Your Order
          </Link>
          <Link to="/" className={classes.continue_btn}>
            Continue Shopping
          </Link>
        </div>

        {/* Customer Support */}
        <div className={classes.support_section}>
          <h3>Need Help?</h3>
          <p>Our customer service team is here to help with any questions about your order.</p>
          <div className={classes.support_options}>
            <button className={classes.support_btn}>
              📞 Call Support
            </button>
            <button className={classes.support_btn}>
              💬 Live Chat
            </button>
            <button className={classes.support_btn}>
              ❓ Help Center
            </button>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default OrderConfirmation;