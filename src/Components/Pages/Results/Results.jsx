import React, { useState, useEffect } from 'react'
import classes from './Results.module.css'
import LayOut from '../../LayOut/LayOut'
import { useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../../Product/ProductCard'



function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {CategoryName, categoryName} = useParams();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'all';

  // Use the correct category name (handle both capital and lowercase routes)
  const currentCategory = CategoryName || categoryName;

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products from Fake Store API
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allProducts = await response.json();
        let filteredProducts = allProducts;

        // Filter by category (from URL param or search param)
        if (currentCategory) {
          filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === currentCategory.toLowerCase()
          );
        } else if (categoryFilter !== 'all') {
          filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === categoryFilter.toLowerCase()
          );
        }

        // Filter by search query
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setResults(filteredProducts);

        const filterDescription = currentCategory
          ? `category: ${currentCategory}`
          : searchQuery
            ? `search: "${searchQuery}"${categoryFilter !== 'all' ? ` in ${categoryFilter}` : ''}`
            : 'all products';

        console.log(`Loaded ${filteredProducts.length} products for ${filterDescription}`);
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProducts();
  }, [currentCategory, searchQuery, categoryFilter, CategoryName, categoryName]);

 if (loading) {
   return (
     <LayOut>
       <div className={classes.loading__container}>
         <div className={classes.loading__text}>Loading results...</div>
       </div>
     </LayOut>
   )
 }

 if (error) {
   return (
     <LayOut>
       <div className={classes.error__container}>
         <div className={classes.error__text}>Oops! Something went wrong: {error}</div>
       </div>
     </LayOut>
   )
 }

 const getPageTitle = () => {
   if (searchQuery) {
     return `Search Results for "${searchQuery}"`;
   }
   if (CategoryName) {
     return CategoryName.charAt(0).toUpperCase() + CategoryName.slice(1);
   }
   return 'All Products';
 };

 const getPageDescription = () => {
   if (searchQuery) {
     return `${results.length} results for "${searchQuery}"${categoryFilter !== 'all' ? ` in ${categoryFilter}` : ''}`;
   }
   if (CategoryName) {
     return `category/${CategoryName}`;
   }
   return 'Browse all available products';
 };

 return (
  <LayOut>
    <section>
     <h1 style={{padding:'30px'}}>{getPageTitle()}</h1>
     <p style={{padding:'30px'}}>{getPageDescription()}</p>
  <div className={classes.products__container}>
       {results?.map((item)=>(
                 <ProductCard key={item.id}
                  product={item}/>
                 ))}
      </div>

    </section>
   </LayOut>
 )
}

export default Results
          


