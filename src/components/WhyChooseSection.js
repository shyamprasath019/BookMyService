import React from 'react';
import './WhyChooseSection.css';

const WhyChooseSection = () => {
  return (
    <div className="section">
      <h2 className="sectionTitle">Why BookMyService</h2>
      <div className="whyChooseContainer">
        <div className="whyChooseCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Secure Payments"
            className="whyChooseIcon"
          />
          <h3 className="whyChooseCardTitle">Secure Payments</h3>
          <p className="whyChooseCardDescription">
            Protected transactions with escrow system
          </p>
        </div>
        <div className="whyChooseCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Wide Range of Services"
            className="whyChooseIcon"
          />
          <h3 className="whyChooseCardTitle">Wide Range of Services</h3>
          <p className="whyChooseCardDescription">
            From home maintenance to business services
          </p>
        </div>
        <div className="whyChooseCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Customer Support"
            className="whyChooseIcon"
          />
          <h3 className="whyChooseCardTitle">Customer Support</h3>
          <p className="whyChooseCardDescription">
            Assistance to ensure quality service and satisfaction
          </p>
        </div>
        <div className="whyChooseCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Verified Professionals"
            className="whyChooseIcon"
          />
          <h3 className="whyChooseCardTitle">Verified Professionals</h3>
          <p className="whyChooseCardDescription">
            Thoroughly vetted service providers
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;
