import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-content">
        <div className="not-found-number">
          <span className="number-4">4</span>
          <span className="number-0">
            <i className="fas fa-cog gear-animation"></i>
          </span>
          <span className="number-4">4</span>
        </div>

        <div className="not-found-text">
          <h1 className="not-found-title text-gradient-gold">
            Oops! Page Not Found
          </h1>
          <p className="not-found-description">
            The page you're looking for seems to have taken a wrong turn or is 
            currently being serviced. Don't worry, our team is on it!
          </p>
        </div>
    </div>
  );
};

export default NotFound;