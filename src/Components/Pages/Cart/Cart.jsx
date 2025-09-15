import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classes from './Cart.module.css'
import LayOut from '../../LayOut/LayOut'
import { useCart } from '../../../Hooks/useCart'

function Cart() {
  const { cart, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()
  const [savedItems, setSavedItems] = useState([])
  const [compareItems, setCompareItems] = useState([])

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      // Find the item to get its variantId if it exists
      const item = cart.find(item => item.id === productId || item.variantId === productId)
      const identifier = item?.variantId || productId
      updateQuantity(identifier, newQuantity)
    }
  }

  const handleSaveForLater = (item) => {
    // Remove from cart
    removeFromCart(item.id)
    // Add to saved items
    setSavedItems(prev => [...prev, { ...item, savedAt: new Date() }])
    alert(`"${item.title}" saved for later!`)
  }

  const handleCompareItems = (item) => {
    // Add to compare list
    if (compareItems.length < 4) { // Limit to 4 items for comparison
      if (!compareItems.find(compareItem => compareItem.id === item.id)) {
        setCompareItems(prev => [...prev, item])
        alert(`"${item.title}" added to comparison!`)
      } else {
        alert(`"${item.title}" is already in comparison!`)
      }
    } else {
      alert('You can compare up to 4 items at once. Please remove some items first.')
    }
  }

  const handleMoveToCart = (item) => {
    // Remove from saved items
    setSavedItems(prev => prev.filter(savedItem => savedItem.id !== item.id))
    // Add back to cart (this would need to be implemented in the cart context)
    alert(`"${item.title}" moved back to cart!`)
  }

  const handleRemoveFromSaved = (itemId) => {
    setSavedItems(prev => prev.filter(savedItem => savedItem.id !== itemId))
  }

  const handleRemoveFromCompare = (itemId) => {
    setCompareItems(prev => prev.filter(compareItem => compareItem.id !== itemId))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 25 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <LayOut>
      <div className={classes.cartPage}>
        {/* Header */}
        <div className={classes.cartHeader}>
          <h1 className={classes.cartTitle}>
            Shopping Cart
            {totalItems > 0 && (
              <span className={classes.itemCount}>
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
          {totalItems > 0 && (
            <button className={classes.clearCartBtn} onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className={classes.emptyCart}>
            <div className={classes.emptyCartIcon}>🛒</div>
            <h2>Your Amazon Cart is empty</h2>
            <p>Shop today's deals</p>
            <div className={classes.emptyCartActions}>
              <Link to="/" className={classes.shopBtn}>
                Continue shopping
              </Link>
              <Link to="/deals" className={classes.dealsBtn}>
                Today's Deals
              </Link>
            </div>
          </div>
        ) : (
          <div className={classes.cartContent}>
            {/* Cart Items */}
            <div className={classes.cartItems}>
              {cart.map((item) => (
                <div key={item.id} className={classes.cartItem}>
                  <div className={classes.itemImage}>
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} />
                    </Link>
                  </div>

                  <div className={classes.itemDetails}>
                    <div className={classes.itemInfo}>
                      <h3 className={classes.itemTitle}>
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <div className={classes.itemMeta}>
                        <span className={classes.inStock}>In Stock</span>
                        <span className={classes.deliveryInfo}>
                          FREE delivery available
                        </span>
                      </div>
                      <div className={classes.itemActions}>
                        <button
                          className={classes.deleteBtn}
                          onClick={() => removeFromCart(item.id)}
                        >
                          Delete
                        </button>
                        <span className={classes.separator}>|</span>
                        <button
                          className={classes.saveBtn}
                          onClick={() => handleSaveForLater(item)}
                        >
                          Save for later
                        </button>
                        <span className={classes.separator}>|</span>
                        <button
                          className={classes.compareBtn}
                          onClick={() => handleCompareItems(item)}
                        >
                          Compare with similar items
                        </button>
                      </div>
                    </div>

                    <div className={classes.itemControls}>
                      <div className={classes.quantitySelector}>
                        <label>Qty:</label>
                        <div className={classes.quantityControls}>
                          <button
                            className={classes.quantityBtn}
                            onClick={() => handleQuantityChange(item.variantId || item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className={classes.quantityValue}>{item.quantity}</span>
                          <button
                            className={classes.quantityBtn}
                            onClick={() => handleQuantityChange(item.variantId || item.id, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className={classes.itemPrice}>
                        <span className={classes.price}>${item.price.toFixed(2)}</span>
                        {item.quantity > 1 && (
                          <span className={classes.totalPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Sidebar */}
            <div className={classes.cartSummary}>
              <div className={classes.summaryCard}>
                <div className={classes.subtotal}>
                  <span>Subtotal ({totalItems} items):</span>
                  <span className={classes.subtotalAmount}>${subtotal.toFixed(2)}</span>
                </div>

                <div className={classes.shipping}>
                  <span>Shipping & handling:</span>
                  <span className={classes.shippingAmount}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className={classes.tax}>
                  <span>Tax:</span>
                  <span className={classes.taxAmount}>${tax.toFixed(2)}</span>
                </div>

                <hr className={classes.divider} />

                <div className={classes.total}>
                  <span>Total:</span>
                  <span className={classes.totalAmount}>${total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className={classes.checkoutBtn}>
                  Proceed to checkout
                </Link>

                <div className={classes.paymentMethods}>
                  <span className={classes.paymentLabel}>Payment methods:</span>
                  <div className={classes.paymentIcons}>
                    <span className={classes.paymentIcon}>💳</span>
                    <span className={classes.paymentIcon}>🏦</span>
                    <span className={classes.paymentIcon}>📱</span>
                  </div>
                </div>
              </div>

              {/* Gift Cards & Promotional Codes */}
              <div className={classes.promoSection}>
                <h4>Gift cards & promotional codes</h4>
                <div className={classes.promoInput}>
                  <input
                    type="text"
                    placeholder="Enter code"
                    className={classes.promoField}
                  />
                  <button className={classes.applyBtn}>Apply</button>
                </div>
              </div>

              {/* Recently Viewed */}
              <div className={classes.recentlyViewed}>
                <h4>Your recently viewed items</h4>
                <div className={classes.recentItems}>
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.id} className={classes.recentItem}>
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image} alt={item.title} />
                      </Link>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <>
                      <div className={classes.recentItem}>
                        <img src="/10001.jpg" alt="Sample item" />
                      </div>
                      <div className={classes.recentItem}>
                        <img src="/10002.jpg" alt="Sample item" />
                      </div>
                      <div className={classes.recentItem}>
                        <img src="/10003.jpg" alt="Sample item" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved for Later Section */}
        {savedItems.length > 0 && (
          <div className={classes.savedSection}>
            <h3>Saved for Later ({savedItems.length} items)</h3>
            <div className={classes.savedItems}>
              {savedItems.map((item) => (
                <div key={item.id} className={classes.savedItem}>
                  <div className={classes.savedImage}>
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} />
                    </Link>
                  </div>
                  <div className={classes.savedInfo}>
                    <h4>
                      <Link to={`/product/${item.id}`}>{item.title}</Link>
                    </h4>
                    <div className={classes.savedPrice}>${item.price.toFixed(2)}</div>
                    <div className={classes.savedActions}>
                      <button
                        className={classes.moveToCartBtn}
                        onClick={() => handleMoveToCart(item)}
                      >
                        Move to Cart
                      </button>
                      <button
                        className={classes.removeSavedBtn}
                        onClick={() => handleRemoveFromSaved(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare Items Section */}
        {compareItems.length > 0 && (
          <div className={classes.compareSection}>
            <h3>Compare Items ({compareItems.length}/4)</h3>
            <div className={classes.compareItems}>
              {compareItems.map((item) => (
                <div key={item.id} className={classes.compareItem}>
                  <div className={classes.compareImage}>
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} />
                    </Link>
                  </div>
                  <div className={classes.compareInfo}>
                    <h4>
                      <Link to={`/product/${item.id}`}>{item.title}</Link>
                    </h4>
                    <div className={classes.comparePrice}>${item.price.toFixed(2)}</div>
                    <button
                      className={classes.removeCompareBtn}
                      onClick={() => handleRemoveFromCompare(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {compareItems.length >= 2 && (
                <div className={classes.compareActions}>
                  <button className={classes.compareNowBtn}>
                    Compare Now ({compareItems.length} items)
                  </button>
                  <button
                    className={classes.clearCompareBtn}
                    onClick={() => setCompareItems([])}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Items Section */}
        {cart.length > 0 && (
          <div className={classes.relatedSection}>
            <h3>Frequently bought together</h3>
            <div className={classes.relatedItems}>
              {cart.slice(0, 2).map((item, index) => {
                // Generate related product suggestions based on cart items
                const relatedProducts = [
                  {
                    id: 1001 + index,
                    title: `Accessory for ${item.title.split(' ').slice(0, 2).join(' ')}`,
                    price: (item.price * 0.3).toFixed(2),
                    image: item.image // Use same image for demo, in real app would be different
                  },
                  {
                    id: 1002 + index,
                    title: `Case for ${item.title.split(' ').slice(0, 2).join(' ')}`,
                    price: (item.price * 0.2).toFixed(2),
                    image: item.image
                  }
                ];

                return relatedProducts.map((related, relIndex) => (
                  <div key={related.id} className={classes.relatedItem}>
                    <Link to={`/product/${related.id}`}>
                      <img src={related.image} alt={related.title} />
                    </Link>
                    <div className={classes.relatedInfo}>
                      <h4>
                        <Link to={`/product/${related.id}`}>{related.title}</Link>
                      </h4>
                      <span className={classes.relatedPrice}>${related.price}</span>
                      <button
                        className={classes.addRelatedBtn}
                        onClick={() => {
                          if (!user) {
                            alert('Please sign in to add items to cart');
                            return;
                          }
                          addToCart(related);
                          alert(`Added ${related.title} to cart!`);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ));
              }).flat().slice(0, 2)}
            </div>
          </div>
        )}
      </div>
    </LayOut>
  )
}

export default Cart