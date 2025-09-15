import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../Hooks/useCart';
import classes from './CartSidebar.module.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(variantId);
    } else {
      updateQuantity(variantId, newQuantity);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={classes.overlay} onClick={handleOverlayClick}>
      <div className={classes.sidebar}>
        {/* Header */}
        <div className={classes.header}>
          <h3 className={classes.title}>
            🛒 Shopping Cart ({totalItems})
          </h3>
          <button className={classes.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className={classes.cartItems}>
          {cart.length === 0 ? (
            <div className={classes.emptyCart}>
              <div className={classes.emptyIcon}>🛒</div>
              <h4>Your cart is empty</h4>
              <p>Add some amazing products to get started!</p>
              <Link to="/products" className={classes.shopBtn} onClick={onClose}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.variantId || item.id} className={classes.cartItem}>
                <div className={classes.itemImage}>
                  <img src={item.image} alt={item.title} />
                </div>

                <div className={classes.itemDetails}>
                  <h4 className={classes.itemTitle}>
                    <Link to={`/product/${item.id}`} onClick={onClose}>
                      {item.title.length > 50 ? `${item.title.substring(0, 50)}...` : item.title}
                    </Link>
                  </h4>

                  {/* Variant Information */}
                  {(item.selectedSize || item.selectedColor) && (
                    <div className={classes.itemVariants}>
                      {item.selectedSize && <span className={classes.variant}>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className={classes.variant}>Color: {item.selectedColor}</span>}
                    </div>
                  )}

                  <div className={classes.itemPrice}>
                    <span className={classes.price}>${item.price.toFixed(2)}</span>
                    {item.quantity > 1 && (
                      <span className={classes.totalPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className={classes.quantityControls}>
                    <button
                      className={classes.quantityBtn}
                      onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className={classes.quantity}>{item.quantity}</span>
                    <button
                      className={classes.quantityBtn}
                      onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className={classes.removeBtn}
                  onClick={() => removeFromCart(item.variantId)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className={classes.cartFooter}>
            <div className={classes.cartSummary}>
              <div className={classes.summaryRow}>
                <span>Subtotal ({totalItems} items):</span>
                <span className={classes.subtotal}>${totalAmount.toFixed(2)}</span>
              </div>
              <div className={classes.summaryRow}>
                <span>Shipping:</span>
                <span className={classes.shipping}>
                  {totalAmount > 50 ? 'FREE' : '$9.99'}
                </span>
              </div>
              <div className={classes.summaryRow}>
                <span>Tax:</span>
                <span className={classes.tax}>${(totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <hr className={classes.divider} />
              <div className={`${classes.summaryRow} ${classes.total}`}>
                <span>Total:</span>
                <span className={classes.totalAmount}>
                  ${(totalAmount + (totalAmount > 50 ? 0 : 9.99) + (totalAmount * 0.08)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className={classes.actionButtons}>
              <Link to="/checkout" className={classes.checkoutBtn} onClick={onClose}>
                Proceed to Checkout
              </Link>
              <button className={classes.clearCartBtn} onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            <div className={classes.cartExtras}>
              <div className={classes.primeOffer}>
                <span className={classes.primeIcon}>⚡</span>
                <span>Get FREE Two-Hour Delivery with Prime</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;