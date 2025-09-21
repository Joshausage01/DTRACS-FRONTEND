// src/components/AttachedFiles/AttachedFiles.jsx
import React from 'react';
import { IoMdLink } from "react-icons/io";
import './AttachedFiles.css';

const AttachedFiles = ({ links = [], onRemoveLink, isCompleted }) => {

  // Safe check for arrays
  const safeLinks = Array.isArray(links) ? links : [];

  // Check if there are any attachments to display
  const hasAttachments = safeLinks.length > 0;
  if (!hasAttachments) return null;

  return (
    <div className="attached-items-container">

      {/* Links Section */}
      {safeLinks.length > 0 && (
        <div className="attached-section">
          <h4 className="attached-section-title">Attached Links</h4>
          <div className="attached-links-list">
            {safeLinks.map((link, index) => (
              <div key={link.id || index} className="attached-link-item">
                <IoMdLink className="attached-link-icon" />
                <div className="link-info">
                  <a 
                    href={link.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="attached-link-url"
                    title={link.url}
                  >
                    {link.displayText || link.title || link.url || 'Untitled link'}
                  </a>
                </div>
                {!isCompleted && (
                  <button
                    type="button"
                    className="attached-item-remove-btn"
                    onClick={() => onRemoveLink(index)}
                    title="Remove link"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachedFiles;