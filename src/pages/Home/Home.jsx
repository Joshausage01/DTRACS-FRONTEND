import React from 'react';
import './Home.css';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebars/OfficeSidebar';
import Header from '../../components/Headers/OfficeHeader';

const Home = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <Footer />
    </div>
  );
}

export default Home;