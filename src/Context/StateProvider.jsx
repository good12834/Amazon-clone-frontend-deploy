import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Initial State
const initialState = {
  // Cart State
  cart: [],
  totalItems: 0,
  totalAmount: 0,

  // User Authentication State
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Product State
  products: [],

  // UI State
  showCart: false,
  currentPage: 1,
  itemsPerPage: 12
};

// Action Types
export const ACTION_TYPES = {
  // Cart Actions
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',

  // User Actions
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',

  // Product Actions
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',

  // UI Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    // Cart Actions
    case ACTION_TYPES.ADD_TO_CART: {
      const variantId = action.payload.variantId || action.payload.id;
      const existingItem = state.cart.find(item => item.variantId === variantId);

      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }

      const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Save to localStorage
      localStorage.setItem('amazon-cart', JSON.stringify(newCart));

      return {
        ...state,
        cart: newCart,
        totalItems,
        totalAmount
      };
    }

    case ACTION_TYPES.REMOVE_FROM_CART: {
      const newCart = state.cart.filter(item => item.variantId !== action.payload);
      const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      localStorage.setItem('amazon-cart', JSON.stringify(newCart));

      return {
        ...state,
        cart: newCart,
        totalItems,
        totalAmount
      };
    }

    case ACTION_TYPES.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return reducer(state, { type: ACTION_TYPES.REMOVE_FROM_CART, payload: id });
      }

      const newCart = state.cart.map(item =>
        item.variantId === id ? { ...item, quantity } : item
      );

      const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      localStorage.setItem('amazon-cart', JSON.stringify(newCart));

      return {
        ...state,
        cart: newCart,
        totalItems,
        totalAmount
      };
    }

    case ACTION_TYPES.CLEAR_CART:
      localStorage.removeItem('amazon-cart');
      return {
        ...state,
        cart: [],
        totalItems: 0,
        totalAmount: 0
      };

    case ACTION_TYPES.TOGGLE_CART:
      return {
        ...state,
        showCart: !state.showCart
      };

    // User Authentication Actions
    case ACTION_TYPES.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ACTION_TYPES.LOGIN_SUCCESS: {
      const userData = action.payload;
      localStorage.setItem('amazon-user', JSON.stringify(userData));
      return {
        ...state,
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    }

    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case ACTION_TYPES.LOGOUT:
      localStorage.removeItem('amazon-user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case ACTION_TYPES.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ACTION_TYPES.REGISTER_SUCCESS: {
      const userData = action.payload;
      localStorage.setItem('amazon-user', JSON.stringify(userData));
      return {
        ...state,
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    }

    case ACTION_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    // Product Actions
    case ACTION_TYPES.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };

    case ACTION_TYPES.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case 'LOAD_SAVED_CART_DATA':
      return {
        ...state,
        cart: action.payload.cart,
        totalItems: action.payload.totalItems,
        totalAmount: action.payload.totalAmount
      };

    default:
      return state;
  }
};

// Create Context
const StateContext = createContext();

// Custom Hook for using the State
export const useStateValue = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateValue must be used within a StateProvider');
  }
  return context;
};

// State Provider Component
export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data from localStorage and initialize auth state on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('amazon-cart');

    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      dispatch({
        type: 'LOAD_SAVED_CART',
        payload: { cart, totalItems, totalAmount }
      });
    }

    // Initialize Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userData = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          isPrime: false, // You can implement Prime membership logic here
          emailVerified: user.emailVerified
        };

        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: userData
        });
      } else {
        // User is signed out
        dispatch({ type: ACTION_TYPES.LOGOUT });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle special case for loading saved cart
  const enhancedDispatch = (action) => {
    if (action.type === 'LOAD_SAVED_CART') {
      // Load saved cart data directly into state
      return dispatch({
        type: 'LOAD_SAVED_CART_DATA',
        payload: action.payload
      });
    }
    dispatch(action);
  };

  return (
    <StateContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;