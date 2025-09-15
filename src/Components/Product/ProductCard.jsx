import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import classes from './Product.module.css';
import { Link as Linke } from 'react-router-dom';
import { useCart } from '../../Hooks/useCart';
import ProductComparison from './ProductComparison';
function ProductCard({ product }) {
  const { addToCart, isInCart, getCartItemCount } = useCart();
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!product) {
    return <div>Loading...</div>;
  }

  // Handle different rating structures (Fake Store API vs local data)
  const rating = product.rating || { rate: 4.0, count: 0 };
  const { image, title, id, price, variants } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (variants && (!selectedSize || !selectedColor)) {
      alert('Please select size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
  };

  const handleAddToComparison = (e) => {
    e.preventDefault();
    if (comparisonProducts.length < 4 && !comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts([...comparisonProducts, product]);
    }
  };

  const handleRemoveFromComparison = (productId) => {
    setComparisonProducts(comparisonProducts.filter(p => p.id !== productId));
  };

  const isInComparison = comparisonProducts.some(p => p.id === product.id);

  return (
    <div className={classes.category}>
      <Linke to={`/product/${id}`}>
        <img src={image} alt={title} />
        <h2>{title}</h2>

        {/* Amazon-style Rating Section */}
        <div className={`${classes.a_section} ${classes.a_flex}`}>
          <div className={classes.a_flex_vcenter}>
            <Rating
              value={rating.rate}
              precision={0.1}
              readOnly
              size="small"
              className={classes.a_icon_star}
            />
            <span className={`${classes.a_color_secondary} ${classes.a_size_small}`}>
              ({rating.count})
            </span>
          </div>
        </div>

        {/* Amazon-style Price Section */}
        <div className={classes.a_price}>
          <span className={classes.a_price_symbol}>$</span>
          <span className={classes.a_price_whole}>{Math.floor(price)}</span>
          <span className={classes.a_price_fraction}>
            {(price % 1 * 100).toFixed(0).padStart(2, '0')}
          </span>
        </div>
      </Linke>

      {/* Variant Selection */}
      {variants && (
        <div className={classes.variant_selection}>
          {variants.sizes && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className={classes.variant_select}
            >
              <option value="">Select Size</option>
              {variants.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          )}
          {variants.colors && (
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className={classes.variant_select}
            >
              <option value="">Select Color</option>
              {variants.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className={classes.card_actions}>
        <button
          className={classes.add_to_cart}
          onClick={handleAddToCart}
          disabled={isInCart(id, selectedSize, selectedColor)}
        >
          {isInCart(id, selectedSize, selectedColor) ? `In Cart (${getCartItemCount(id, selectedSize, selectedColor)})` : 'Add to Cart'}
        </button>

        <div className={classes.compare_actions}>
          <button
            className={`${classes.compare_btn} ${isInComparison ? classes.in_comparison : ''}`}
            onClick={handleAddToComparison}
            disabled={comparisonProducts.length >= 4 && !isInComparison}
          >
            {isInComparison ? '✓ Compare' : '⚖️ Compare'}
          </button>
          {comparisonProducts.length > 0 && (
            <button
              className={classes.view_comparison_btn}
              onClick={() => setShowComparison(true)}
            >
              View Comparison ({comparisonProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Product Comparison Modal */}
      {showComparison && (
        <ProductComparison
          products={comparisonProducts}
          onRemoveProduct={handleRemoveFromComparison}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}

export default ProductCard;




// import React from 'react'
// import Rating from '@mui/material/Rating'
// import CurrencyFormater from '../CurrencyFormat/CurrencyFormat'
// import classes from './Product.module.css'

// function ProductCard({product}) {
//   const {image, title, id, rating, price} = product;

//   return (
//     <div className={classes.category}>
//       <a href={`/product/${id}`}>
//         <img src={image} alt={title} />
//         <span>
//           <h2>{title}</h2>
//         </span>

//         {/* Amazon-style Rating Section */}
//         <div className={`${classes.a_section} ${classes.a_flex}`}>
//           <div className={classes.a_flex_vcenter}>
//             <Rating
//               value={rating.rate}
//               precision={0.1}
//               readOnly
//               size="small"
//               className={classes.a_icon_star}
//             />
//             <span className={`${classes.a_color_secondary} ${classes.a_size_small}`}>
//               ({rating.count})
//             </span>
//           </div>
//         </div>

//         {/* Amazon-style Price Section */}
//         <div className={classes.a_price}>
//           <span className={classes.a_price_symbol}>$</span>
//           <span className={classes.a_price_whole}>{Math.floor(price)}</span>
//           <span className={classes.a_price_fraction}>
//             {(price % 1 * 100).toFixed(0).padStart(2, '0')}
//           </span>
//         </div>

//         <p>Shop Now</p>
//       </a>
//       <CurrencyFormater amount={price} />
//     </div>
//   )
// }

// export default ProductCard