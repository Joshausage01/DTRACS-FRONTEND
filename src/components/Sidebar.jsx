import React from "react";
import "./Sidebar.css";
import { FaClipboardList, FaBuilding, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#" className="sidebar-link" title="Dashboard">
              <FaClipboardList className="sidebar-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-link" title="Departments">
              <FaBuilding className="sidebar-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-link" title="Settings">
              <FaCog className="sidebar-icon" />
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;