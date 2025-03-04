import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email format
    if (!email.endsWith('@gmail.com')) {
      setError('Please use a valid Gmail address.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Account not found. Please sign up.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <Link to="/" className="backButton">
        ← Back
      </Link>

      <h1 className="title">Welcome Back</h1>
      <p className="subtitle">Sign in to continue</p>

      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSignIn}>
        <div className="inputContainer">
          <span className="inputIcon">✉️</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="inputContainer">
          <span className="inputIcon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signInButton">
          Sign In
        </button>

        <p className="orText">OR</p>

        <button type="button" className="googleButton" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>

        <p className="footer">
          Don't have an account? <Link to="/SignUp">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;