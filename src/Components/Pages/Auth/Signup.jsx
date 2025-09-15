import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import classes from './Auth.module.css';
import authService from '../../../services/authService';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.signUp(
        formData.email,
        formData.password,
        formData.name
      );

      if (result.success) {
        setSuccess(result.message);
        // Redirect to sign in page after successful signup
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      setError('Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
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
      setError('Facebook sign-up failed. Please try again.');
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
          <h1>Create Account</h1>
          <p>Join Amazon Clone for the best shopping experience</p>
        </div>

        {error && (
          <div className={classes.error_message}>
            {error}
          </div>
        )}

        {success && (
          <div className={classes.success_message}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={classes.auth_form}>
          <div className={classes.form_group}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="First and last name"
              required
              disabled={loading}
            />
          </div>

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
              placeholder="At least 6 characters"
              required
              disabled={loading}
            />
            <small className={classes.password_hint}>
              Passwords must be at least 6 characters.
            </small>
          </div>

          <div className={classes.form_group}>
            <label htmlFor="confirmPassword">Re-enter Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
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
                <span style={{ marginLeft: '8px' }}>Creating Account...</span>
              </>
            ) : (
              'Create your Amazon account'
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
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={16} color="#4285f4" />
            ) : (
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            )}
            <span style={{ marginLeft: loading ? '8px' : '0' }}>
              {loading ? 'Signing up...' : 'Continue with Google'}
            </span>
          </button>

          <button
            type="button"
            className={classes.facebook_button}
            onClick={handleFacebookSignUp}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={16} color="#ffffff" />
            ) : (
              <span>📘</span>
            )}
            <span style={{ marginLeft: '8px' }}>
              {loading ? 'Signing up...' : 'Continue with Facebook'}
            </span>
          </button>
        </div>

        <div className={classes.auth_footer}>
          <p>
            Already have an account?{' '}
            <Link to="/signin" className={classes.auth_link}>
              Sign in
            </Link>
          </p>
        </div>

        <div className={classes.terms}>
          <p>
            By creating an account, you agree to Amazon Clone's{' '}
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

export default Signup;