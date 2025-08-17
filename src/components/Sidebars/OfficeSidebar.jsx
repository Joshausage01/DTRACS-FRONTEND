import React, { useState } from "react";
import "./OfficeSidebar.css";
import { FaClipboardList } from "react-icons/fa";
import { RiSchoolFill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";


const OfficeSidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState(null);

  const sidebarItems = [
    { id: "task", icon: <FaClipboardList className="sidebar-icon" />, title: "Tasks" },
    { id: "schools", icon: <RiSchoolFill className="sidebar-icon" />, title: "Schools" },
    { id: "manage-accounts", icon: <MdManageAccounts className="sidebar-icon" />, title: "Manage Accounts" }
  ];


  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className={`sidebar-link ${activeItem === item.id ? "active" : ""}`}
                title={item.title}
                onClick={() => setActiveItem(item.id)}
              >
                {item.icon}
                {isOpen && <span className="sidebar-label">{item.title}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default OfficeSidebar;