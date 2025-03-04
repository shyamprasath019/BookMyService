import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <div className="section">
      <h2 className="sectionTitle">About BookMyService</h2>
      <div className="aboutContainer">
        <p className="aboutText">
          Welcome to BookMyService, your one-stop destination for hassle-free
          service bookings! At BookMyService, we bridge the gap between customers
          and service providers by offering a seamless platform where you can
          easily find, compare, and book professional services. Whether you need
          home repairs, beauty treatments, or business services, we ensure a
          smooth and convenient experience. Our mission is to simplify service
          bookings by providing a user-friendly platform that connects customers
          with trusted professionals. We strive to deliver reliability,
          transparency, and excellence in every service booked through our
          platform.
        </p>
        <div className="aboutImage"></div>
      </div>
    </div>
  );
};

export default AboutSection;