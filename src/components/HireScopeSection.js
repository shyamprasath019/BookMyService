import React from 'react';
import './HireScopeSection.css';

const HireScopeSection = () => {
  return (
    <div className="section">
      <h2 className="sectionTitle">Hire for any scope of work</h2>
      <div className="scopeContainer">
        <div className="scopeCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Remote"
            className="scopeIcon"
          />
          <h3 className="scopeCardTitle">Remote</h3>
          <p className="scopeCardDescription">
            Find professionals anywhere in the world
          </p>
        </div>
        <div className="scopeCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="On-Site"
            className="scopeIcon"
          />
          <h3 className="scopeCardTitle">On-Site</h3>
          <p className="scopeCardDescription">
            Get local help for your on-site needs
          </p>
        </div>
        <div className="scopeCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Individual"
            className="scopeIcon"
          />
          <h3 className="scopeCardTitle">Individual</h3>
          <p className="scopeCardDescription">
            Discover skilled freelancers for your project
          </p>
        </div>
        <div className="scopeCard">
          <img
            src="https://i.imgur.com/1tMFzp8.png"
            alt="Team"
            className="scopeIcon"
          />
          <h3 className="scopeCardTitle">Team</h3>
          <p className="scopeCardDescription">Grow your team with top talent</p>
        </div>
      </div>
    </div>
  );
};

export default HireScopeSection;