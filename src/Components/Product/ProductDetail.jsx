import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import classes from './ProductDetail.module.css';
import { useCart } from '../../Hooks/useCart';
import amazonProducts from '../../assets/products.json';
import { useAuth } from '../../Hooks/useAuth';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart, isInCart, getCartItemCount } = useCart();
  const { user } = useAuth();

  // Mock reviews data
  const [reviews] = useState([
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      date: '2024-01-15',
      title: 'Excellent product!',
      comment: 'This product exceeded my expectations. Great quality and fast shipping.',
      helpful: 12
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      date: '2024-01-10',
      title: 'Very satisfied',
      comment: 'Good value for money. Would recommend to friends.',
      helpful: 8
    },
    {
      id: 3,
      user: 'Mike R.',
      rating: 5,
      date: '2024-01-08',
      title: 'Perfect!',
      comment: 'Exactly what I was looking for. Five stars!',
      helpful: 15
    }
  ]);

  // Get related products from the same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return amazonProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6)
      .map(p => ({
        ...p,
        originalPrice: (p.price * 1.2).toFixed(2)
      }));
  }, [product]);

  useEffect(() => {
    const fetchProduct = () => {
      try {
        const productId = parseInt(id);
        const foundProduct = amazonProducts.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }
    if (product) {
      if (product.variants && (!selectedSize || !selectedColor)) {
        alert('Please select size and color');
        return;
      }
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize, selectedColor);
      }
      alert(`Added ${quantity} ${product.title} to cart!`);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <div className={classes.loadingCard}>
          <div className={classes.loadingImage}></div>
          <div className={classes.loadingContent}>
            <div className={classes.loadingTitle}></div>
            <div className={classes.loadingPrice}></div>
            <div className={classes.loadingButton}></div>
          </div>
        </div>
        <div className={classes.loadingMessage}>
          <div className={classes.spinner}></div>
          <p>Finding the perfect product for you...</p>
          <span className={classes.loadingTip}>💡 Tip: Check out our related products while you wait!</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={classes.error}>
        <div className={classes.errorContent}>
          <div className={classes.errorIcon}>🔍</div>
          <h2>Oops! Product Not Found</h2>
          <p>The product you're looking for might have been moved or doesn't exist.</p>
          <div className={classes.errorActions}>
            <Link to="/products" className={classes.primaryBtn}>Browse All Products</Link>
            <Link to="/" className={classes.secondaryBtn}>Back to Home</Link>
          </div>
          <div className={classes.errorSuggestions}>
            <h3>You might also like:</h3>
            <div className={classes.suggestionGrid}>
              {amazonProducts.slice(0, 3).map(suggestion => (
                <Link
                  key={suggestion.id}
                  to={`/product/${suggestion.id}`}
                  className={classes.suggestionCard}
                >
                  <img src={suggestion.image} alt={suggestion.title} />
                  <span>{suggestion.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generate additional images for gallery
  const productImages = [
    product.image,
    product.image, // Duplicate for demo
    product.image, // Duplicate for demo
    product.image  // Duplicate for demo
  ];

  return (
    <div className={classes.productDetail}>
      {/* Breadcrumb */}
      <nav className={classes.breadcrumb}>
        <Link to="/">Home</Link> /
        <Link to="/products">Products</Link> /
        <span>{product.title}</span>
      </nav>

      <div className={classes.productContainer}>
        {/* Product Images */}
        <div className={classes.imageSection}>
          <div className={classes.mainImage}>
            <img
              src={productImages[selectedImage]}
              alt={product.title}
              className={classes.productImage}
            />
            <div className={classes.imageOverlay}>
              <button className={classes.wishlistBtn}>❤️</button>
              <button className={classes.shareBtn}>📤</button>
            </div>
          </div>

          <div className={classes.imageGallery}>
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`${classes.galleryImage} ${selectedImage === index ? classes.active : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={classes.productInfo}>
          {/* Brand and Title */}
          <div className={classes.brandSection}>
            <span className={classes.brandName}>Premium Brand</span>
          </div>
          <h1 className={classes.productTitle}>{product.title}</h1>

          {/* Enhanced Rating Section */}
          <div className={classes.ratingSection}>
            <div className={classes.ratingStars}>
              <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
              <span className={classes.ratingScore}>{product.rating.rate}</span>
            </div>
            <div className={classes.ratingDetails}>
              <span className={classes.reviewCount}>{product.rating.count.toLocaleString()} ratings</span>
              <span className={classes.reviewLink}>• {Math.floor(product.rating.count * 0.7)} reviews</span>
              <span className={classes.questionLink}>• {Math.floor(Math.random() * 50) + 10} answered questions</span>
            </div>
          </div>

          {/* Price Section with Enhanced Design */}
          <div className={classes.priceSection}>
            <div className={classes.priceRow}>
              <span className={classes.priceLabel}>-17%</span>
              <span className={classes.currentPrice}>${product.price}</span>
            </div>
            <div className={classes.priceSubInfo}>
              <span className={classes.listPriceLabel}>List Price: </span>
              <span className={classes.originalPrice}>${(product.price * 1.2).toFixed(2)}</span>
            </div>
            <div className={classes.savings}>
              <span className={classes.savingsText}>You Save: ${(product.price * 0.2).toFixed(2)} (17%)</span>
            </div>
          </div>

          {/* Deal Badge */}
          <div className={classes.dealBadge}>
            <span className={classes.dealIcon}>🔥</span>
            <span className={classes.dealText}>Deal of the Day</span>
            <span className={classes.dealTime}>Ends in 8h 32m</span>
          </div>

          {/* Prime Badge with Enhanced Design */}
          <div className={classes.primeBadge}>
            <div className={classes.primeContent}>
              <span className={classes.primeIcon}>⚡</span>
              <div className={classes.primeText}>
                <strong>FREE delivery</strong> by Tomorrow
                <div className={classes.primeSubtext}>with Prime</div>
              </div>
            </div>
          </div>

          {/* Stock Status with Urgency */}
          <div className={classes.stockStatus}>
            <div className={classes.stockIndicator}>
              <span className={classes.stockIcon}>✓</span>
              <span className={classes.inStock}>In Stock</span>
            </div>
            <div className={classes.stockDetails}>
              <span className={classes.deliveryInfo}>Ships within 24 hours</span>
              <span className={classes.urgencyText}>Only {Math.floor(Math.random() * 5) + 1} left in stock - order soon.</span>
            </div>
          </div>

          {/* Trust Signals */}
          <div className={classes.trustSignals}>
            <div className={classes.trustItem}>
              <span className={classes.trustIcon}>🛡️</span>
              <span className={classes.trustText}>Secure transaction</span>
            </div>
            <div className={classes.trustItem}>
              <span className={classes.trustIcon}>🔒</span>
              <span className={classes.trustText}>Sold by Amazon</span>
            </div>
            <div className={classes.trustItem}>
              <span className={classes.trustIcon}>⭐</span>
              <span className={classes.trustText}>Eligible for returns</span>
            </div>
          </div>

          {/* Variant Selection */}
          {product.variants && (
            <div className={classes.variantSection}>
              {product.variants.sizes && (
                <div className={classes.variantGroup}>
                  <label>Size:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className={classes.variantSelect}
                  >
                    <option value="">Select Size</option>
                    {product.variants.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}
              {product.variants.colors && (
                <div className={classes.variantGroup}>
                  <label>Color:</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className={classes.variantSelect}
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
          <div className={classes.quantitySection}>
            <label>Quantity:</label>
            <div className={classes.quantityControls}>
              <button
                className={classes.quantityBtn}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className={classes.quantity}>{quantity}</span>
              <button
                className={classes.quantityBtn}
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className={classes.actionButtons}>
            <div className={classes.primaryActions}>
              <button
                className={`${classes.addToCartBtn} ${isInCart(product.id, selectedSize, selectedColor) ? classes.added : ''}`}
                onClick={handleAddToCart}
                disabled={isInCart(product.id, selectedSize, selectedColor)}
              >
                <span className={classes.btnIcon}>
                  {isInCart(product.id, selectedSize, selectedColor) ? '✓' : '🛒'}
                </span>
                {isInCart(product.id, selectedSize, selectedColor) ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button className={classes.buyNowBtn}>
                <span className={classes.btnIcon}>⚡</span>
                Buy Now
              </button>
            </div>

            {/* Urgency Message */}
            <div className={classes.urgencyMessage}>
              <span className={classes.urgencyIcon}>⏰</span>
              <span className={classes.urgencyText}>
                <strong>Hurry!</strong> This deal ends soon. Only {Math.floor(Math.random() * 10) + 5} left at this price.
              </span>
            </div>
          </div>

          {/* Additional Actions */}
          <div className={classes.additionalActions}>
            <button className={classes.actionBtn}>
              <span>💝</span> Add to Wishlist
            </button>
            <button className={classes.actionBtn}>
              <span>⚖️</span> Compare
            </button>
            <button className={classes.actionBtn}>
              <span>📤</span> Share
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className={classes.productDetails}>
        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${activeTab === 'description' ? classes.active : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'reviews' ? classes.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button
            className={`${classes.tab} ${activeTab === 'shipping' ? classes.active : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>

        <div className={classes.tabContent}>
          {activeTab === 'description' && (
            <div className={classes.description}>
              <div className={classes.descriptionHeader}>
                <h3>Product Description</h3>
                <div className={classes.productHighlights}>
                  <div className={classes.highlight}>
                    <span className={classes.highlightIcon}>⭐</span>
                    <span>4.5 out of 5 stars</span>
                  </div>
                  <div className={classes.highlight}>
                    <span className={classes.highlightIcon}>🚚</span>
                    <span>Free shipping</span>
                  </div>
                  <div className={classes.highlight}>
                    <span className={classes.highlightIcon}>🔄</span>
                    <span>Easy returns</span>
                  </div>
                </div>
              </div>

              <div className={classes.descriptionContent}>
                <p>{product.description}</p>

                <div className={classes.keyFeatures}>
                  <h4>✨ Key Features & Benefits</h4>
                  <div className={classes.featuresGrid}>
                    <div className={classes.featureItem}>
                      <span className={classes.featureIcon}>💎</span>
                      <div className={classes.featureText}>
                        <strong>Premium Quality</strong>
                        <p>Built with high-grade materials for exceptional durability</p>
                      </div>
                    </div>
                    <div className={classes.featureItem}>
                      <span className={classes.featureIcon}>🔧</span>
                      <div className={classes.featureText}>
                        <strong>Easy to Use</strong>
                        <p>Intuitive design for hassle-free operation</p>
                      </div>
                    </div>
                    <div className={classes.featureItem}>
                      <span className={classes.featureIcon}>🛡️</span>
                      <div className={classes.featureText}>
                        <strong>Warranty Protected</strong>
                        <p>Manufacturer warranty for peace of mind</p>
                      </div>
                    </div>
                    <div className={classes.featureItem}>
                      <span className={classes.featureIcon}>🌟</span>
                      <div className={classes.featureText}>
                        <strong>Customer Favorite</strong>
                        <p>Loved by thousands of satisfied customers</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={classes.technicalSpecs}>
                  <h4>📋 Technical Specifications</h4>
                  <div className={classes.specsGrid}>
                    <div className={classes.specRow}>
                      <span className={classes.specLabel}>Category:</span>
                      <span className={classes.specValue}>{product.category}</span>
                    </div>
                    <div className={classes.specRow}>
                      <span className={classes.specLabel}>Brand:</span>
                      <span className={classes.specValue}>Premium Brand</span>
                    </div>
                    <div className={classes.specRow}>
                      <span className={classes.specLabel}>Material:</span>
                      <span className={classes.specValue}>High-quality materials</span>
                    </div>
                    <div className={classes.specRow}>
                      <span className={classes.specLabel}>Dimensions:</span>
                      <span className={classes.specValue}>10 × 8 × 3 inches</span>
                    </div>
                    <div className={classes.specRow}>
                      <span className={classes.specLabel}>Weight:</span>
                      <span className={classes.specValue}>2.5 lbs</span>
                    </div>
                    <div className={classes.specRow}>
                      <span className={classes.specLabel}>Warranty:</span>
                      <span className={classes.specValue}>1 Year Limited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={classes.reviews}>
              <div className={classes.reviewsHeader}>
                <h3>Customer Reviews & Ratings</h3>
                <div className={classes.reviewStats}>
                  <div className={classes.overallRating}>
                    <span className={classes.bigRating}>{product.rating.rate}</span>
                    <div className={classes.ratingBreakdown}>
                      <Rating value={product.rating.rate} precision={0.1} readOnly size="large" />
                      <span className={classes.totalReviews}>{product.rating.count.toLocaleString()} global ratings</span>
                    </div>
                  </div>

                  <div className={classes.ratingDistribution}>
                    <h4>How customers rated this item</h4>
                    {[5, 4, 3, 2, 1].map(stars => {
                      const percentage = Math.floor(Math.random() * 40) + (stars === 5 ? 40 : stars === 4 ? 25 : 15);
                      return (
                        <div key={stars} className={classes.ratingBar}>
                          <span className={classes.starLabel}>{stars} star</span>
                          <div className={classes.progressBar}>
                            <div
                              className={classes.progressFill}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className={classes.percentage}>{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={classes.customerFeedback}>
                <div className={classes.feedbackItem}>
                  <span className={classes.feedbackIcon}>📦</span>
                  <div className={classes.feedbackContent}>
                    <strong>Packaging</strong>
                    <p>Customers appreciate the secure and eco-friendly packaging</p>
                  </div>
                </div>
                <div className={classes.feedbackItem}>
                  <span className={classes.feedbackIcon}>⚡</span>
                  <div className={classes.feedbackContent}>
                    <strong>Fast Delivery</strong>
                    <p>Most customers receive their orders within 2-3 days</p>
                  </div>
                </div>
                <div className={classes.feedbackItem}>
                  <span className={classes.feedbackIcon}>💯</span>
                  <div className={classes.feedbackContent}>
                    <strong>Quality Assurance</strong>
                    <p>98% of customers report being satisfied with product quality</p>
                  </div>
                </div>
              </div>

              <div className={classes.reviewList}>
                <h4>Recent Reviews</h4>
                {reviews.map(review => (
                  <div key={review.id} className={classes.review}>
                    <div className={classes.reviewHeader}>
                      <div className={classes.reviewerInfo}>
                        <div className={classes.reviewerAvatar}>
                          {review.user.charAt(0).toUpperCase()}
                        </div>
                        <div className={classes.reviewerDetails}>
                          <span className={classes.reviewerName}>{review.user}</span>
                          <div className={classes.verifiedPurchase}>
                            <span className={classes.verifiedIcon}>✓</span>
                            <span>Verified Purchase</span>
                          </div>
                        </div>
                      </div>
                      <div className={classes.reviewMeta}>
                        <Rating value={review.rating} readOnly size="small" />
                        <span className={classes.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                    <h4 className={classes.reviewTitle}>{review.title}</h4>
                    <p className={classes.reviewComment}>{review.comment}</p>
                    <div className={classes.reviewActions}>
                      <button className={classes.helpfulBtn}>
                        👍 Helpful ({review.helpful})
                      </button>
                      <button className={classes.reportBtn}>Report</button>
                    </div>
                  </div>
                ))}

                <div className={classes.reviewPagination}>
                  <button className={classes.loadMoreBtn}>Load More Reviews</button>
                  <span className={classes.reviewCount}>Showing 1-3 of {product.rating.count} reviews</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className={classes.shipping}>
              <h3>Shipping & Returns</h3>
              <div className={classes.shippingInfo}>
                <div className={classes.infoSection}>
                  <h4>🚚 Shipping</h4>
                  <ul>
                    <li>FREE shipping on orders over $25</li>
                    <li>Standard delivery: 3-5 business days</li>
                    <li>Express delivery: 1-2 business days</li>
                    <li>Prime members get FREE 2-hour delivery</li>
                  </ul>
                </div>
                <div className={classes.infoSection}>
                  <h4>↩️ Returns</h4>
                  <ul>
                    <li>30-day return window</li>
                    <li>FREE return shipping</li>
                    <li>Easy online return process</li>
                    <li>Refunds processed within 3-5 days</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Related Products */}
      <div className={classes.relatedProducts}>
        <div className={classes.relatedHeader}>
          <h3>Customers Also Viewed</h3>
          <div className={classes.relatedStats}>
            <span className={classes.statIcon}>👁️</span>
            <span>Based on your browsing history</span>
          </div>
        </div>

        <div className={classes.relatedGrid}>
          {relatedProducts.map((relatedProduct, index) => (
            <Link
              key={relatedProduct.id}
              to={`/product/${relatedProduct.id}`}
              className={classes.relatedCard}
            >
              <div className={classes.relatedBadge}>
                {index === 0 && <span className={classes.bestSeller}>Best Seller</span>}
                {index === 1 && <span className={classes.topRated}>Top Rated</span>}
                {index === 2 && <span className={classes.deal}>Deal</span>}
              </div>

              <div className={classes.relatedImageContainer}>
                <img src={relatedProduct.image} alt={relatedProduct.title} className={classes.relatedImage} />
                <div className={classes.quickView}>
                  <span>Quick View</span>
                </div>
              </div>

              <div className={classes.relatedInfo}>
                <h4 className={classes.relatedTitle}>{relatedProduct.title}</h4>

                <div className={classes.relatedRating}>
                  <Rating value={relatedProduct.rating.rate} precision={0.1} readOnly size="small" />
                  <span className={classes.ratingCount}>({relatedProduct.rating.count})</span>
                </div>

                <div className={classes.relatedPrice}>
                  <span className={classes.currentPrice}>${relatedProduct.price}</span>
                  <span className={classes.originalPrice}>${relatedProduct.originalPrice}</span>
                  <span className={classes.discountBadge}>
                    {Math.round((1 - relatedProduct.price / relatedProduct.originalPrice) * 100)}% off
                  </span>
                </div>

                <div className={classes.relatedShipping}>
                  <span className={classes.shippingIcon}>🚚</span>
                  <span>FREE delivery</span>
                </div>

                <div className={classes.relatedActions}>
                  <button className={classes.addToCartSmall} onClick={(e) => {
                    e.preventDefault();
                    // Handle add to cart for related product
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={classes.relatedFooter}>
          <button className={classes.viewAllBtn}>
            View All Related Products →
          </button>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className={classes.socialProof}>
        <div className={classes.proofItem}>
          <div className={classes.proofIcon}>⭐</div>
          <div className={classes.proofContent}>
            <strong>4.5 out of 5 stars</strong>
            <p>Based on {product.rating.count.toLocaleString()} reviews</p>
          </div>
        </div>
        <div className={classes.proofItem}>
          <div className={classes.proofIcon}>🚚</div>
          <div className={classes.proofContent}>
            <strong>Fast & Free Shipping</strong>
            <p>Orders over $25 ship free</p>
          </div>
        </div>
        <div className={classes.proofItem}>
          <div className={classes.proofIcon}>🛡️</div>
          <div className={classes.proofContent}>
            <strong>Secure Shopping</strong>
            <p>SSL encrypted checkout</p>
          </div>
        </div>
        <div className={classes.proofItem}>
          <div className={classes.proofIcon}>🔄</div>
          <div className={classes.proofContent}>
            <strong>Easy Returns</strong>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;