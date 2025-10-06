// src/components/Footer.jsx
import React, { useState } from 'react';
import { LiaLightbulbSolid } from 'react-icons/lia';
import './Footer.css';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="footer">
      <footer className="app-footer">
        <button
          className="coming-soon-button"
          onClick={openModal}
          aria-label="View upcoming features"
        >
          <LiaLightbulbSolid size={22} />
        </button>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h1 className="modal-title">🚀 COMING SOON</h1>
            </div>
            <div className="modal-body">
              <h2 className="modal-subtitle">Upcoming Features</h2>
              <ul className="modal-features-list">
                <li>
                  <strong>Clerk Document Management</strong>: School clerks will gain direct access to the platform to efficiently manage 
                  <strong> incoming and outgoing documents through the website</strong>, reducing manual coordination.
                </li>
                <li>
                  <strong>Forgot Password Recovery</strong>: Users will be able to securely reset their passwords independently, 
                  minimizing delays and support requests.
                </li>
              </ul>
              <p className="modal-description">
                These enhancements are designed to <strong>reduce the workload of focal persons</strong> and 
                streamline day-to-day operations through a centralized, user-friendly web interface.
              </p>
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={closeModal}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;