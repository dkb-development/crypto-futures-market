// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Volatility from './components/Volatility';
import Alerts from './components/Alerts';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="volatility" element={<Volatility />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
