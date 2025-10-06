// src/components/ComingSoonButton.jsx
import React, { useState } from 'react';
import { LiaLightbulbSolid } from 'react-icons/lia';
import './ComingSoonButton.css';

const ComingSoonButton = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div className="floating-coming-soon">
      <button
        className="coming-soon-button"
        onClick={handleClick}
        aria-label="Feature coming soon"
      >
        <LiaLightbulbSolid size={18} />
      </button>

      {showMessage && (
        <div className="coming-soon-message">
          COMING SOON
        </div>
      )}
    </div>
  );
};

export default ComingSoonButton;