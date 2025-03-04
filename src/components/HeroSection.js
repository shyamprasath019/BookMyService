import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="heroContainer">
      <div className="heroImage"></div>
      <div className="heroContent">
        <h1 className="heroTitle">Get work done faster with confidence</h1>
        <p className="heroSubtitle">
          Find the perfect freelancer for your project in minutes. It's free and
          easy to get started.
        </p>
        <Link to="/SignIn" className="getStartedButton">
        <span className="getStartedButtonText">Get Started</span>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;