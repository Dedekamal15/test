import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Belajar from './pages/Belajar';
import Login from './pages/Login';
import React from 'react';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Footer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Belajar" element={<Belajar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;