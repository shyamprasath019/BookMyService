import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./SignUp.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client"); // Default to client
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email format
    if (!email.endsWith("@gmail.com")) {
      setError("Please use a valid Gmail address.");
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name in Firebase Auth
      await updateProfile(user, { displayName: name });

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: accountType, // Use accountType as role
        createdAt: new Date().toISOString(),
      });

      navigate("/components/AccountSetup"); // Redirect to account setup page
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Email already in use. Please sign in.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: "client", // Default role for Google sign-up
        createdAt: new Date().toISOString(),
      });

      navigate("/account-setup"); // Redirect to account setup page
    } catch (error) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <Link to="/" className="backButton">
        ← Back
      </Link>

      <h1 className="title">Create Account</h1>
      <p className="subtitle">Join BookMyService today</p>

      {error && <p className="error">{error}</p>}

      <div className="accountTypeContainer">
        <button
          className={`accountTypeButton ${accountType === "client" ? "active" : ""}`}
          onClick={() => setAccountType("client")}
        >
          I'm a Client
        </button>
        <button
          className={`accountTypeButton ${accountType === "freelancer" ? "active" : ""}`}
          onClick={() => setAccountType("freelancer")}
        >
          I'm a Freelancer
        </button>
      </div>

      <form className="form" onSubmit={handleSignUp}>
        <div className="inputContainer">
          <span className="inputIcon">👤</span>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit" className="signUpButton">
          Create Account
        </button>

        <p className="orText">OR</p>

        <button type="button" className="googleButton" onClick={handleGoogleSignUp}>
          Sign Up with Google
        </button>

        <p className="footer">
          Already have an account? <Link to="/SignIn">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;