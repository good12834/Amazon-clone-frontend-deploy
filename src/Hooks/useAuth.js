import { useStateValue, ACTION_TYPES } from '../Context/StateProvider';
import authService from '../services/authService';

export const useAuth = () => {
  const { state, dispatch } = useStateValue();

  const login = async (email, password) => {
    dispatch({ type: ACTION_TYPES.LOGIN_START });

    try {
      const result = await authService.signIn(email, password);

      if (result.success) {
        const userData = {
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || result.user.email.split('@')[0],
          avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.email}`,
          isPrime: false, // You can implement Prime membership logic here
          emailVerified: result.user.emailVerified
        };

        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: userData
        });

        return { success: true };
      } else {
        dispatch({
          type: ACTION_TYPES.LOGIN_FAILURE,
          payload: result.error
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILURE,
        payload: 'An unexpected error occurred'
      });
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: ACTION_TYPES.REGISTER_START });

    try {
      const result = await authService.signUp(email, password, name);

      if (result.success) {
        const userData = {
          id: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || name,
          avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.email}`,
          isPrime: false,
          emailVerified: result.user.emailVerified
        };

        dispatch({
          type: ACTION_TYPES.REGISTER_SUCCESS,
          payload: userData
        });

        return { success: true, message: result.message };
      } else {
        dispatch({
          type: ACTION_TYPES.REGISTER_FAILURE,
          payload: result.error
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.REGISTER_FAILURE,
        payload: 'An unexpected error occurred'
      });
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      dispatch({ type: ACTION_TYPES.LOGOUT });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if server logout fails
      dispatch({ type: ACTION_TYPES.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError
  };
};