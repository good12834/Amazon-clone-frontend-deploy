import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../Hooks/useCart';
import classes from './ProductComparison.module.css';

const ProductComparison = ({ products, onRemoveProduct, onClose }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const features = [
    { key: 'title', label: 'Product Name', type: 'text' },
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'rating', label: 'Rating', type: 'rating' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' }
  ];

  const renderFeatureValue = (product, feature) => {
    switch (feature.type) {
      case 'price':
        return `$${product[feature.key]?.toFixed(2) || 'N/A'}`;
      case 'rating':
        const rating = product[feature.key];
        return rating ? (
          <div className={classes.rating}>
            <span className={classes.stars}>
              {'★'.repeat(Math.floor(rating.rate))}{'☆'.repeat(5 - Math.floor(rating.rate))}
            </span>
            <span className={classes.ratingText}>
              {rating.rate} ({rating.count})
            </span>
          </div>
        ) : 'N/A';
      default:
        return product[feature.key] || 'N/A';
    }
  };

  return (
    <div className={classes.comparisonOverlay}>
      <div className={classes.comparisonModal}>
        {/* Header */}
        <div className={classes.comparisonHeader}>
          <h2>Compare Products ({products.length})</h2>
          <button className={classes.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Comparison Table */}
        <div className={classes.comparisonTable}>
          {features.map((feature) => (
            <div key={feature.key} className={classes.comparisonRow}>
              <div className={classes.featureLabel}>
                {feature.label}
              </div>
              {products.map((product) => (
                <div key={`${feature.key}-${product.id}`} className={classes.productCell}>
                  <div className={classes.cellContent}>
                    {feature.key === 'title' ? (
                      <div className={classes.productHeader}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className={classes.productImage}
                        />
                        <h3 className={classes.productTitle}>
                          <Link to={`/product/${product.id}`} onClick={onClose}>
                            {product.title}
                          </Link>
                        </h3>
                        <button
                          className={classes.removeBtn}
                          onClick={() => onRemoveProduct(product.id)}
                          title="Remove from comparison"
                        >
                          🗑️
                        </button>
                      </div>
                    ) : (
                      <div className={classes.featureValue}>
                        {renderFeatureValue(product, feature)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Action Row */}
          <div className={classes.comparisonRow}>
            <div className={classes.featureLabel}>
              Actions
            </div>
            {products.map((product) => (
              <div key={`actions-${product.id}`} className={classes.productCell}>
                <div className={classes.actionButtons}>
                  <button
                    className={`${classes.actionBtn} ${classes.addToCartBtn}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id)}
                  >
                    {isInCart(product.id) ? '✓ In Cart' : 'Add to Cart'}
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className={`${classes.actionBtn} ${classes.viewDetailsBtn}`}
                    onClick={onClose}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={classes.comparisonFooter}>
          <div className={classes.footerStats}>
            <span>Comparing {products.length} products</span>
          </div>
          <div className={classes.footerActions}>
            <button className={classes.clearAllBtn} onClick={() => products.forEach(p => onRemoveProduct(p.id))}>
              Clear All
            </button>
            <button className={classes.closeModalBtn} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;