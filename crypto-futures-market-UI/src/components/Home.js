// src/Home.js
import React from 'react';
import { Link, Outlet } from "react-router-dom";

import '../styles/home.css';

function Home() {
  return (
    <div className='homePageContainer'>
      <h2>Home Page</h2>
      <Outlet />
    </div>
  );
}

export default Home;
