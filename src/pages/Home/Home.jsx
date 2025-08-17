import React, { useState } from 'react';
import './Home.css';
import Footer from '../../components/Footer';
import OfficeSidebar from '../../components/Sidebars/OfficeSidebar';
import OfficeHeader from '../../components/Headers/OfficeHeader';

const Home = () => {
  const  [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <OfficeHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <OfficeSidebar isOpen={isSidebarOpen} />
      <Footer />
    </div>
  );
}

export default Home;