import React from "react";
import "./OfficeHeader.css";
import { GiHamburgerMenu } from "react-icons/gi";
import profileIcon from "../../assets/profileBTN.png"; // Adjust the path as necessary

const OfficeHeader = ({ onToggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={ onToggleSidebar}>
          <GiHamburgerMenu className="menu-icon"/>
        </button>
        <div className="header-text">
          <h1 className="header-title">SGOD-PR-0001</h1>
          <p className="header-subtitle">Planning and Research</p>
        </div>
      </div>
      <div className="header-right">
        <button className="profile-btn">
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
          />
        </button>
      </div>
    </header>
  );
};

export default OfficeHeader;