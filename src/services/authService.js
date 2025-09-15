// Authentication Service using Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
  }

  // Initialize auth state listener
  init() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        // Ensure user profile exists in Firestore
        await this.ensureUserProfile(user);
      }

      // Notify all listeners
      this.authStateListeners.forEach(listener => listener(user));
    });
  }

  // Add auth state listener
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Ensure user profile exists in Firestore
  async ensureUserProfile(user) {
    if (!db) {
      console.warn('Firestore not available - skipping user profile operations');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          emailVerified: user.emailVerified,
          createdAt: new Date(),
          lastLogin: new Date(),
          addresses: [],
          paymentMethods: [],
          orderHistory: [],
          wishlist: [],
          preferences: {
            currency: 'USD',
            language: 'en',
            notifications: true
          }
        };

        await setDoc(userRef, userProfile);
        console.log('User profile created:', user.uid);
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: new Date()
        });
      }
    } catch (error) {
      console.warn('Firestore unavailable - skipping user profile operations:', error.message);
      // Don't throw error to prevent app crashes
    }
  }

  // Sign up with email and password
  async signUp(email, password, displayName = null) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(user);

      return {
        success: true,
        user,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign in with Facebook
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Failed to sign out'
      };
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent! Check your inbox.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateProfile(user, updates);

      // Update Firestore profile if available
      if (db) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, updates);
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  // Get current user profile from Firestore
  async getUserProfile() {
    if (!db) {
      console.warn('Firestore not available - cannot get user profile');
      return null;
    }

    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data();
      }

      return null;
    } catch (error) {
      console.warn('Firestore unavailable - cannot get user profile:', error.message);
      return null;
    }
  }

  // Update user profile in Firestore
  async updateUserProfile(updates) {
    if (!db) {
      console.warn('Firestore not available - cannot update user profile');
      return {
        success: false,
        error: 'Database not available'
      };
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updates);

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Failed to update user profile'
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Error message helper
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Pop-up was blocked by browser.',
      'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred.';
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;