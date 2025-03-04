import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null); // Track the authenticated user
  const [role, setRole] = useState(null); // Store the user's role
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser); // User is signed in

        // Fetch the user's role from Firestore
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role); // Set the role
        }
      } else {
        setUser(null); // User is signed out
        setRole(null); // Reset role
      }
      setLoading(false); // Stop loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleProfileClick = () => {
      navigate(`/dashboard`); // Navigate to dashboard with role
  };

  return (
    <header className="header">
      <div className="navTitle"><Link to="/" className="navLink">
      Book My Service</Link></div>
      <nav className="navLinks">
        <Link to="/FindFreelancers" className="navLink">
          Hire Freelancer
        </Link>
        <Link to="/FindJobs" className="navLink">
          Find Jobs
        </Link>
        <Link to="/how-it-works" className="navLink">
          How it Works
        </Link>
        <Link to="/about-us" className="navLink">
          About Us
        </Link>
      </nav>
      {loading ? (
        <div className="loading">Loading...</div> // Show loading state
      ) : user ? (
        <div className="profileIcon" onClick={handleProfileClick}>
          👤
        </div>
      ) : (
        <Link to="/SignIn" className="loginButton">
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;