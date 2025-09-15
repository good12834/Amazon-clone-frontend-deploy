import { useStateValue, ACTION_TYPES } from '../Context/StateProvider';

export const useProducts = () => {
  const { state, dispatch } = useStateValue();

  const setProducts = (products) => {
    dispatch({
      type: ACTION_TYPES.SET_PRODUCTS,
      payload: products
    });
  };

  const setFilters = (filters) => {
    dispatch({
      type: ACTION_TYPES.SET_FILTERS,
      payload: filters
    });
  };

  const clearFilters = () => {
    dispatch({
      type: ACTION_TYPES.CLEAR_FILTERS
    });
  };

  const setSearchQuery = (query) => {
    dispatch({
      type: ACTION_TYPES.SET_SEARCH_QUERY,
      payload: query
    });
  };

  const setSortBy = (sortOption) => {
    dispatch({
      type: ACTION_TYPES.SET_SORT_BY,
      payload: sortOption
    });
  };

  const setCurrentPage = (page) => {
    dispatch({
      type: ACTION_TYPES.SET_CURRENT_PAGE,
      payload: page
    });
  };

  const toggleFilters = () => {
    dispatch({
      type: ACTION_TYPES.TOGGLE_FILTERS
    });
  };

  // Get paginated products
  const getPaginatedProducts = () => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.filteredProducts.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = () => {
    return Math.ceil(state.filteredProducts.length / state.itemsPerPage);
  };

  // Get unique categories
  const getCategories = () => {
    return [...new Set(state.products.map(product => product.category))];
  };

  // Get price range
  const getPriceRange = () => {
    if (state.products.length === 0) return [0, 1000];

    const prices = state.products.map(product => product.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    return [minPrice, maxPrice];
  };

  return {
    // State
    products: state.products,
    filteredProducts: state.filteredProducts,
    filters: state.filters,
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    showFilters: state.showFilters,

    // Computed values
    paginatedProducts: getPaginatedProducts(),
    totalPages: getTotalPages(),
    categories: getCategories(),
    priceRange: getPriceRange(),

    // Actions
    setProducts,
    setFilters,
    clearFilters,
    setSearchQuery,
    setSortBy,
    setCurrentPage,
    toggleFilters
  };
};