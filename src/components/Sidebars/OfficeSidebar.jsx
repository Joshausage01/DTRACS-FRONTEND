import React, { useState } from "react";
import "./OfficeSidebar.css";
import { FaClipboardList } from "react-icons/fa";
import { RiSchoolFill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";


const OfficeSidebar = () => {
  const [activeitem, setActiveItem] = useState(null);


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
              <RiSchoolFill className="sidebar-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-link" title="Settings">
              <MdManageAccounts className="sidebar-icon" />
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default OfficeSidebar;