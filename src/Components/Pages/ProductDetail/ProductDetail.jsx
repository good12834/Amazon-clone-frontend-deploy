import React, { useState, useEffect } from 'react'
import classes from './ProductDetail.module.css'
import LayOut from '../../LayOut/LayOut'
import { useParams, useNavigate } from 'react-router-dom'
import Loder from '../../Loder/Loder'
import Rating from '@mui/material/Rating'
import { useCart } from '../../../Hooks/useCart'
import { useAuth } from '../../../Hooks/useAuth'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({})
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviewSort, setReviewSort] = useState('newest')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const { addToCart, isInCart } = useCart()
  const { user } = useAuth()

  // Mock additional product data
  const [stockCount] = useState(Math.floor(Math.random() * 10) + 1)
  const [deliveryDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString())

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const productData = await response.json()
        setProduct(productData)

        console.log(`Loaded product ${id} from Fake Store API`)
      } catch (error) {
        console.error('Error fetching product details:', error)
        setError('Failed to load product details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product.category) return

      try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${product.category}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const categoryProducts = await response.json()
        // Filter out the current product and take first 6
        const related = categoryProducts
          .filter(p => p.id !== product.id)
          .slice(0, 6)

        setRelatedProducts(related)
      } catch (error) {
        console.error('Error fetching related products:', error)
        // Fallback to empty array
        setRelatedProducts([])
      }
    }

    if (product.category) {
      fetchRelatedProducts()
    }
  }, [product.category, product.id])

  // Handle scroll for sticky cart button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const threshold = 600 // Show sticky cart after scrolling 600px
      setShowStickyCart(scrollPosition > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  // Mock product images (using the same image multiple times for demo)
  const productImages = product.image ? Array(4).fill(product.image) : []

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, Math.min(stockCount, prev + change)))
  }

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in to add items to cart')
      return
    }
    if (product) {
      if (product.variants && (!selectedSize || !selectedColor)) {
        alert('Please select size and color')
        return
      }
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize, selectedColor)
      }
      alert(`Added ${quantity} ${product.title} to cart!`)
    }
  }

  const handleBuyNow = () => {
    alert(`Proceeding to checkout for ${quantity} ${product.title}`)
  }

  const handleRelatedAddToCart = (relatedProduct) => {
    if (!user) {
      alert('Please sign in to add items to cart')
      return
    }
    addToCart(relatedProduct)
    alert(`Added ${relatedProduct.title} to cart!`)
  }

  const handleRelatedQuickView = (relatedProduct) => {
    navigate(`/product/${relatedProduct.id}`)
  }

  if (loading) {
    return (
      <LayOut>
        <Loder />
      </LayOut>
    )
  }

  if (error) {
    return (
      <LayOut>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          margin: '40px auto',
          maxWidth: '500px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Product Not Found</h3>
          <p style={{ margin: '0', color: '#666' }}>{error}</p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </LayOut>
    )
  }

  return (
    <LayOut>
      <div className={classes.product_detail_container}>

        {/* Product Images Gallery */}
        <div className={classes.product_gallery}>
          <div className={classes.main_image_container}>
            <img
              src={productImages[selectedImage] || product.image}
              alt={product.title}
              className={classes.main_image}
            />
            <div className={classes.image_overlay}>
              <button className={classes.zoom_btn} title="Zoom Image">🔍</button>
              <button className={classes.share_btn} title="Share Product">📤</button>
            </div>

            {/* Quick Actions on Hover */}
            <div className={classes.quick_actions_overlay}>
              <button className={`${classes.quick_action} ${classes.quick_wishlist}`}
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
                {isWishlisted ? '❤️' : '🤍'}
              </button>
              <button className={`${classes.quick_action} ${classes.quick_compare}`}
                      title="Compare Product">
                ⚖️
              </button>
              <button className={`${classes.quick_action} ${classes.quick_share}`}
                      title="Share Product">
                📤
              </button>
            </div>
          </div>

          <div className={classes.thumbnail_gallery}>
            {productImages.map((img, index) => (
              <div key={index} className={classes.thumbnail_wrapper}>
                <img
                  src={img}
                  alt={`${product.title} ${index + 1}`}
                  className={`${classes.thumbnail} ${selectedImage === index ? classes.active : ''}`}
                  onClick={() => setSelectedImage(index)}
                  onMouseEnter={() => setSelectedImage(index)}
                />
                <span className={classes.thumbnail_label}>
                  {index === 0 ? 'Main' : `View ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className={classes.product_info}>
          <h1 className={classes.product_title}>{product.title}</h1>

          {/* Rating Section */}
          <div className={classes.rating_section}>
            <Rating
              value={product.rating?.rate || 0}
              precision={0.1}
              readOnly
              size="large"
            />
            <span className={classes.rating_count}>
              ({product.rating?.count || 0} reviews)
            </span>
          </div>

          {/* Enhanced Price Section */}
          <div className={classes.price_section}>
            <div className={classes.price_breakdown}>
              <div className={classes.main_price}>
                <span className={classes.current_price}>${product.price}</span>
                <span className={classes.original_price}>${(product.price * 1.2).toFixed(2)}</span>
                <span className={classes.discount}>(17% off)</span>
              </div>
              <div className={classes.price_details}>
                <span className={classes.price_label}>M.R.P.:</span>
                <span className={classes.price_value}>${(product.price * 1.2).toFixed(2)}</span>
              </div>
              <div className={classes.price_details}>
                <span className={classes.price_label}>Deal Price:</span>
                <span className={classes.price_value}>${product.price}</span>
              </div>
              <div className={classes.price_details}>
                <span className={classes.price_label}>You Save:</span>
                <span className={classes.price_value}>${(product.price * 0.2).toFixed(2)} (17%)</span>
              </div>
            </div>

            {/* EMI Options */}
            <div className={classes.emi_section}>
              <div className={classes.emi_header}>
                <span className={classes.emi_icon}>💳</span>
                <span className={classes.emi_title}>EMI Options Available</span>
              </div>
              <div className={classes.emi_options}>
                <div className={classes.emi_option}>
                  <span className={classes.emi_months}>3 Months</span>
                  <span className={classes.emi_amount}>${(product.price / 3).toFixed(2)}/month</span>
                </div>
                <div className={classes.emi_option}>
                  <span className={classes.emi_months}>6 Months</span>
                  <span className={classes.emi_amount}>${(product.price / 6).toFixed(2)}/month</span>
                </div>
                <div className={classes.emi_option}>
                  <span className={classes.emi_months}>12 Months</span>
                  <span className={classes.emi_amount}>${(product.price / 12).toFixed(2)}/month</span>
                </div>
              </div>
              <div className={classes.emi_note}>
                <span>✨ No Cost EMI available on select cards</span>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className={classes.stock_status}>
            <span className={classes.stock_indicator}>
              {stockCount <= 3 ? '⚠️ Only' : '✅'} {stockCount} left in stock
            </span>
          </div>

          {/* Variant Selection */}
          {product.variants && (
            <div className={classes.variant_section}>
              {product.variants.sizes && (
                <div className={classes.variant_group}>
                  <label>Size:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className={classes.variant_select}
                  >
                    <option value="">Select Size</option>
                    {product.variants.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}
              {product.variants.colors && (
                <div className={classes.variant_group}>
                  <label>Color:</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className={classes.variant_select}
                  >
                    <option value="">Select Color</option>
                    {product.variants.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className={classes.quantity_section}>
            <label>Quantity:</label>
            <div className={classes.quantity_controls}>
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={classes.quantity_btn}
              >
                -
              </button>
              <span className={classes.quantity_value}>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stockCount}
                className={classes.quantity_btn}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={classes.action_buttons}>
            <button
              className={classes.add_to_cart_btn}
              onClick={handleAddToCart}
              disabled={isInCart(product.id, selectedSize, selectedColor)}
            >
              {isInCart(product.id, selectedSize, selectedColor) ? '✓ Added to Cart' : '🛒 Add to Cart'}
            </button>
            <button
              className={classes.buy_now_btn}
              onClick={handleBuyNow}
            >
              ⚡ Buy Now
            </button>
            <button
              className={`${classes.wishlist_btn} ${isWishlisted ? classes.wishlisted : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              {isWishlisted ? '❤️' : '🤍'} {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Delivery Information */}
          <div className={classes.delivery_info}>
            <h3>🚚 Delivery & Returns</h3>
            <div className={classes.delivery_options}>
              <div className={classes.delivery_option}>
                <span className={classes.delivery_type}>FREE Delivery</span>
                <span className={classes.delivery_date}>by {deliveryDate}</span>
              </div>
              <div className={classes.delivery_option}>
                <span className={classes.delivery_type}>Fast Delivery</span>
                <span className={classes.delivery_date}>Tomorrow by 8 PM</span>
              </div>
            </div>

            <div className={classes.seller_info}>
              <h4>Sold by</h4>
              <span className={classes.seller_name}>Amazon.com</span>
              <span className={classes.seller_rating}>⭐ 4.5 (2,341 ratings)</span>
            </div>

            <div className={classes.return_policy}>
              <h4>📦 Return Policy</h4>
              <p>30-day return policy. Free returns on most items.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className={classes.product_details}>
        <div className={classes.tabs}>
          <button
            className={`${classes.tab_btn} ${activeTab === 'description' ? classes.active : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`${classes.tab_btn} ${activeTab === 'specifications' ? classes.active : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={`${classes.tab_btn} ${activeTab === 'reviews' ? classes.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.rating?.count || 0})
          </button>
          <button
            className={`${classes.tab_btn} ${activeTab === 'faqs' ? classes.active : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            FAQs
          </button>
          <button
            className={`${classes.tab_btn} ${activeTab === 'compare' ? classes.active : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            Compare
          </button>
        </div>

        <div className={classes.tab_content}>
          {activeTab === 'description' && (
            <div className={classes.description}>
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>This high-quality product is designed to meet your everyday needs with exceptional performance and durability. Crafted with attention to detail, it offers superior functionality and style.</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className={classes.specifications}>
              <h3>Product Specifications</h3>
              <table className={classes.specs_table}>
                <tbody>
                  <tr>
                    <td>Category</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td>Brand</td>
                    <td>Premium Brand</td>
                  </tr>
                  <tr>
                    <td>Material</td>
                    <td>High-quality materials</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>1 Year Limited Warranty</td>
                  </tr>
                  <tr>
                    <td>Dimensions</td>
                    <td>10 x 8 x 3 inches</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>2.5 lbs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={classes.reviews}>
              <h3>Customer Reviews</h3>
              <div className={classes.overall_rating}>
                <Rating value={product.rating?.rate || 0} precision={0.1} readOnly size="large" />
                <span className={classes.overall_score}>{product.rating?.rate || 0} out of 5</span>
                <span className={classes.total_reviews}>{product.rating?.count || 0} reviews</span>
              </div>

              <div className={classes.review_controls}>
                <div className={classes.review_filters}>
                  <span className={classes.filter_label}>Filter by:</span>
                  {['all', '5', '4', '3', '2', '1'].map((rating) => (
                    <button
                      key={rating}
                      className={`${classes.filter_btn} ${reviewFilter === rating ? classes.active : ''}`}
                      onClick={() => setReviewFilter(rating)}
                    >
                      {rating === 'all' ? 'All' : `${rating} ⭐`}
                    </button>
                  ))}
                </div>

                <div className={classes.review_sort}>
                  <span className={classes.sort_label}>Sort by:</span>
                  <select
                    className={classes.sort_select}
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>

              <div className={classes.sample_reviews}>
                <div className={classes.review}>
                  <div className={classes.review_header}>
                    <Rating value={5} readOnly size="small" />
                    <span className={classes.reviewer_name}>John D.</span>
                    <span className={classes.review_date}>2 days ago</span>
                  </div>
                  <p className={classes.review_text}>Excellent product! Exactly as described and fast shipping. Highly recommend!</p>
                </div>

                <div className={classes.review}>
                  <div className={classes.review_header}>
                    <Rating value={4} readOnly size="small" />
                    <span className={classes.reviewer_name}>Sarah M.</span>
                    <span className={classes.review_date}>1 week ago</span>
                  </div>
                  <p className={classes.review_text}>Very satisfied with the purchase. Good quality and great value for money.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className={classes.faqs}>
              <h3>Frequently Asked Questions</h3>
              <div className={classes.faq_list}>
                <div className={classes.faq_item}>
                  <div className={classes.faq_question}>
                    <span className={classes.question_icon}>❓</span>
                    <h4>Is this product genuine and authentic?</h4>
                  </div>
                  <div className={classes.faq_answer}>
                    <p>Yes, all our products are 100% genuine and come with manufacturer warranty. We only source from authorized distributors and verified sellers.</p>
                  </div>
                </div>

                <div className={classes.faq_item}>
                  <div className={classes.faq_question}>
                    <span className={classes.question_icon}>📦</span>
                    <h4>What is the delivery time?</h4>
                  </div>
                  <div className={classes.faq_answer}>
                    <p>Standard delivery takes 3-5 business days. Express delivery (1-2 business days) is available for select locations. Free shipping on orders over $25.</p>
                  </div>
                </div>

                <div className={classes.faq_item}>
                  <div className={classes.faq_question}>
                    <span className={classes.question_icon}>🔄</span>
                    <h4>What is the return policy?</h4>
                  </div>
                  <div className={classes.faq_answer}>
                    <p>We offer a 30-day return policy. Items must be in original condition with tags attached. Return shipping is free for defective items.</p>
                  </div>
                </div>

                <div className={classes.faq_item}>
                  <div className={classes.faq_question}>
                    <span className={classes.question_icon}>🛠️</span>
                    <h4>Does this come with warranty?</h4>
                  </div>
                  <div className={classes.faq_answer}>
                    <p>Yes, this product comes with a 1-year manufacturer warranty. Extended warranty options are available for purchase.</p>
                  </div>
                </div>

                <div className={classes.faq_item}>
                  <div className={classes.faq_question}>
                    <span className={classes.question_icon}>💳</span>
                    <h4>What payment methods are accepted?</h4>
                  </div>
                  <div className={classes.faq_answer}>
                    <p>We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with SSL encryption.</p>
                  </div>
                </div>

                <div className={classes.faq_item}>
                  <div className={classes.faq_question}>
                    <span className={classes.question_icon}>📞</span>
                    <h4>How can I contact customer service?</h4>
                  </div>
                  <div className={classes.faq_answer}>
                    <p>You can reach our customer service team at 1-800-HELP or via email at support@example.com. We're available 24/7 for your convenience.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className={classes.compare_section}>
              <h3>Compare with Similar Products</h3>
              <div className={classes.comparison_table}>
                <div className={classes.table_header}>
                  <div className={classes.product_column}>
                    <div className={classes.product_card}>
                      <img src={product.image} alt={product.title} className={classes.compare_image} />
                      <h4>{product.title}</h4>
                      <div className={classes.compare_rating}>
                        <Rating value={product.rating?.rate || 0} precision={0.1} readOnly size="small" />
                        <span>({product.rating?.count || 0})</span>
                      </div>
                      <div className={classes.compare_price}>${product.price}</div>
                    </div>
                  </div>
                  <div className={classes.product_column}>
                    <div className={classes.product_card}>
                      <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="Similar Product 1" className={classes.compare_image} />
                      <h4>Premium Wireless Headphones</h4>
                      <div className={classes.compare_rating}>
                        <Rating value={4.5} precision={0.1} readOnly size="small" />
                        <span>(234)</span>
                      </div>
                      <div className={classes.compare_price}>$89.99</div>
                    </div>
                  </div>
                  <div className={classes.product_column}>
                    <div className={classes.product_card}>
                      <img src="https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" alt="Similar Product 2" className={classes.compare_image} />
                      <h4>Bluetooth Speaker Pro</h4>
                      <div className={classes.compare_rating}>
                        <Rating value={4.2} precision={0.1} readOnly size="small" />
                        <span>(156)</span>
                      </div>
                      <div className={classes.compare_price}>$67.50</div>
                    </div>
                  </div>
                </div>

                <div className={classes.table_body}>
                  <div className={classes.spec_row}>
                    <div className={classes.spec_label}>Price</div>
                    <div className={classes.spec_value}>${product.price}</div>
                    <div className={classes.spec_value}>$89.99</div>
                    <div className={classes.spec_value}>$67.50</div>
                  </div>
                  <div className={classes.spec_row}>
                    <div className={classes.spec_label}>Rating</div>
                    <div className={classes.spec_value}>
                      <Rating value={product.rating?.rate || 0} precision={0.1} readOnly size="small" />
                    </div>
                    <div className={classes.spec_value}>
                      <Rating value={4.5} precision={0.1} readOnly size="small" />
                    </div>
                    <div className={classes.spec_value}>
                      <Rating value={4.2} precision={0.1} readOnly size="small" />
                    </div>
                  </div>
                  <div className={classes.spec_row}>
                    <div className={classes.spec_label}>Category</div>
                    <div className={classes.spec_value}>{product.category}</div>
                    <div className={classes.spec_value}>Electronics</div>
                    <div className={classes.spec_value}>Electronics</div>
                  </div>
                  <div className={classes.spec_row}>
                    <div className={classes.spec_label}>Warranty</div>
                    <div className={classes.spec_value}>1 Year</div>
                    <div className={classes.spec_value}>2 Years</div>
                    <div className={classes.spec_value}>1 Year</div>
                  </div>
                  <div className={classes.spec_row}>
                    <div className={classes.spec_label}>Delivery</div>
                    <div className={classes.spec_value}>Free</div>
                    <div className={classes.spec_value}>Free</div>
                    <div className={classes.spec_value}>$5.99</div>
                  </div>
                  <div className={classes.spec_row}>
                    <div className={classes.spec_label}>Stock Status</div>
                    <div className={classes.spec_value}>
                      <span className={classes.in_stock}>In Stock</span>
                    </div>
                    <div className={classes.spec_value}>
                      <span className={classes.in_stock}>In Stock</span>
                    </div>
                    <div className={classes.spec_value}>
                      <span className={classes.low_stock}>Only 3 left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Related Products Section */}
      <div className={classes.related_products}>
        <div className={classes.related_header}>
          <h2>Customers Also Bought</h2>
          <div className={classes.carousel_controls}>
            <button className={classes.carousel_btn} onClick={() => {
              const container = document.querySelector(`.${classes.related_grid}`);
              container.scrollLeft -= 300;
            }}>
              ‹
            </button>
            <button className={classes.carousel_btn} onClick={() => {
              const container = document.querySelector(`.${classes.related_grid}`);
              container.scrollLeft += 300;
            }}>
              ›
            </button>
          </div>
        </div>
        <div className={classes.related_grid}>
          {/* Related products from the same category */}
          {relatedProducts.map((relatedProduct, index) => (
            <div key={relatedProduct.id} className={classes.related_card}>
              <div className={classes.related_badge}>
                <span className={classes.badge_text}>
                  {index === 0 ? 'Most Popular' : index === 1 ? 'Best Seller' : 'Recommended'}
                </span>
              </div>
              <img
                src={relatedProduct.image}
                alt={relatedProduct.title}
                className={classes.related_image}
              />
              <div className={classes.related_info}>
                <h4 className={classes.related_title}>{relatedProduct.title}</h4>
                <div className={classes.related_rating}>
                  <Rating value={relatedProduct.rating?.rate || 4.0} precision={0.1} readOnly size="small" />
                  <span>({relatedProduct.rating?.count || 50})</span>
                </div>
                <div className={classes.related_price}>
                  <span className={classes.related_current_price}>
                    ${relatedProduct.price}
                  </span>
                  <span className={classes.related_original_price}>
                    ${(relatedProduct.price * 1.2).toFixed(2)}
                  </span>
                </div>
                <div className={classes.related_actions}>
                  <button
                    className={classes.quick_add}
                    onClick={() => handleRelatedAddToCart(relatedProduct)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className={classes.quick_view}
                    onClick={() => handleRelatedQuickView(relatedProduct)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof Section */}
      <div className={classes.social_proof}>
        <div className={classes.social_proof_item}>
          <span className={classes.social_icon}>🚀</span>
          <span className={classes.social_text}>
            <strong>{Math.floor(Math.random() * 50) + 10} people</strong> bought this in the last 24 hours
          </span>
        </div>
        <div className={classes.social_proof_item}>
          <span className={classes.social_icon}>⭐</span>
          <span className={classes.social_text}>
            <strong>92%</strong> of reviewers recommend this product
          </span>
        </div>
        <div className={classes.social_proof_item}>
          <span className={classes.social_icon}>🏆</span>
          <span className={classes.social_text}>
            <strong>#1 Best Seller</strong> in {product.category}
          </span>
        </div>
      </div>

      {/* Sticky Add to Cart Button */}
      {showStickyCart && (
        <div className={classes.sticky_cart}>
          <div className={classes.sticky_cart_content}>
            <div className={classes.sticky_product_info}>
              <img src={product.image} alt={product.title} className={classes.sticky_product_image} />
              <div className={classes.sticky_product_details}>
                <h4>{product.title}</h4>
                <div className={classes.sticky_price}>
                  <span className={classes.sticky_current_price}>${product.price}</span>
                  <span className={classes.sticky_quantity}>Qty: {quantity}</span>
                </div>
              </div>
            </div>

            <div className={classes.sticky_actions}>
              <button
                className={classes.sticky_add_to_cart}
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>
              <button
                className={classes.sticky_buy_now}
                onClick={handleBuyNow}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

    </LayOut>
  )
}

export default ProductDetail