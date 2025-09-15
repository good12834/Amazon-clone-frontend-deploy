import { useStateValue, ACTION_TYPES } from '../Context/StateProvider';

export const useCart = () => {
  const { state, dispatch } = useStateValue();

  const addToCart = (product, selectedSize = null, selectedColor = null) => {
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      variantId: `${product.id}-${selectedSize}-${selectedColor}` // Unique ID for variants
    };
    dispatch({
      type: ACTION_TYPES.ADD_TO_CART,
      payload: cartItem
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: ACTION_TYPES.REMOVE_FROM_CART,
      payload: productId
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_QUANTITY,
      payload: { id: productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({
      type: ACTION_TYPES.CLEAR_CART
    });
  };

  const toggleCart = () => {
    dispatch({
      type: ACTION_TYPES.TOGGLE_CART
    });
  };

  const getCartItemCount = (productId, selectedSize = null, selectedColor = null) => {
    const variantId = selectedSize && selectedColor ? `${productId}-${selectedSize}-${selectedColor}` : productId;
    const item = state.cart.find(item => item.variantId === variantId || item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId, selectedSize = null, selectedColor = null) => {
    const variantId = selectedSize && selectedColor ? `${productId}-${selectedSize}-${selectedColor}` : productId;
    return state.cart.some(item => item.variantId === variantId || item.id === productId);
  };

  return {
    cart: state.cart,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    showCart: state.showCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getCartItemCount,
    isInCart
  };
};