import React from 'react';
import './Home.css';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

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