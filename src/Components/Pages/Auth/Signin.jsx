import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import classes from './Auth.module.css';
import authService from '../../../services/authService';


function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await authService.signIn(formData.email, formData.password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.signInWithGoogle();
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.signInWithFacebook();
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Facebook sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.resetPassword(formData.email);
      if (result.success) {
        setError(''); // Clear any existing errors
        alert(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.auth_container}>
      <div className={classes.auth_card}>
        <div className={classes.auth_header}>
          <div className={classes.logo_container}>
            <Link to="/" className={classes.logo_link}>
              <img
                src="/amazon-official-logo.png"
                alt="Amazon"
                className={classes.amazon_official_logo}
              />
            </Link>
          </div>
          <h1>Sign In</h1>
          <p>Welcome back to Amazon Clone</p>
        </div>

        {error && (
          <div className={classes.error_message}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={classes.auth_form}>
          <div className={classes.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className={classes.form_group}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={classes.auth_button}
            disabled={loading}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#ffffff" />
                <span style={{ marginLeft: '8px' }}>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={classes.divider}>
          <span>or</span>
        </div>

        <div className={classes.social_auth}>
          <button
            type="button"
            className={classes.google_button}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={16} color="#4285f4" />
            ) : (
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            )}
            <span style={{ marginLeft: loading ? '8px' : '0' }}>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          <button
            type="button"
            className={classes.facebook_button}
            onClick={handleFacebookSignIn}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={16} color="#ffffff" />
            ) : (
              <span>📘</span>
            )}
            <span style={{ marginLeft: '8px' }}>
              {loading ? 'Signing in...' : 'Continue with Facebook'}
            </span>
          </button>
        </div>

        <div className={classes.auth_footer}>
          <p>
            New to Amazon Clone?{' '}
            <Link to="/signup" className={classes.auth_link}>
              Create an account
            </Link>
          </p>
          <button
            type="button"
            className={classes.forgot_password}
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Forgot your password?
          </button>
        </div>

        <div className={classes.terms}>
          <p>
            By signing in, you agree to Amazon Clone's{' '}
            <a href="/conditions-of-use" target="_blank" rel="noopener noreferrer">
              Conditions of Use
            </a>{' '}
            and{' '}
            <a href="/privacy-notice" target="_blank" rel="noopener noreferrer">
              Privacy Notice
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;