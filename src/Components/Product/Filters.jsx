import React, { useState, useEffect } from 'react';
import classes from './Filters.module.css';
import apiService from '../../services/apiService';

function Filters({ onFilterChange, categories: initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories from API if not provided
  useEffect(() => {
    if (initialCategories.length === 0) {
      const loadCategories = async () => {
        try {
          setLoadingCategories(true);
          const apiCategories = await apiService.getCategories();
          setCategories(apiCategories);
        } catch (error) {
          console.error('Failed to load categories:', error);
          // Fallback categories
          setCategories(['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']);
        } finally {
          setLoadingCategories(false);
        }
      };
      loadCategories();
    } else {
      setCategories(initialCategories);
    }
  }, [initialCategories]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category, priceRange, minRating });
  };

  const handlePriceChange = (min, max) => {
    const newPriceRange = [min, max];
    setPriceRange(newPriceRange);
    onFilterChange({ category: selectedCategory, priceRange: newPriceRange, minRating });
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating);
    onFilterChange({ category: selectedCategory, priceRange, minRating: rating });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setMinRating(0);
    onFilterChange({ category: '', priceRange: [0, 1000], minRating: 0 });
  };

  return (
    <div className={classes.filters_sidebar}>
      <div className={classes.filters_header}>
        <h3>Filters</h3>
        <button className={classes.clear_filters} onClick={clearFilters}>
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className={classes.filter_section}>
        <h4>Category</h4>
        <div className={classes.category_list}>
          <button
            className={`${classes.category_btn} ${selectedCategory === '' ? classes.active : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All Categories
          </button>
          {loadingCategories ? (
            <div className={classes.loading_text}>Loading categories...</div>
          ) : (
            categories.map((category) => (
              <button
                key={category}
                className={`${classes.category_btn} ${selectedCategory === category ? classes.active : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className={classes.filter_section}>
        <h4>Price Range</h4>
        <div className={classes.price_inputs}>
          <div className={classes.price_input_group}>
            <label>Min Price</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
              min="0"
              max="1000"
            />
          </div>
          <div className={classes.price_input_group}>
            <label>Max Price</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
              min="0"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className={classes.filter_section}>
        <h4>Minimum Rating</h4>
        <div className={classes.rating_options}>
          {[0, 1, 2, 3, 4].map((rating) => (
            <button
              key={rating}
              className={`${classes.rating_btn} ${minRating === rating ? classes.active : ''}`}
              onClick={() => handleRatingChange(rating)}
            >
              {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              {rating === 0 ? ' All' : ` ${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className={classes.filter_section}>
        <h4>Sort By</h4>
        <select className={classes.sort_select}>
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;