import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Belajar from './pages/Belajar';
import Login from './pages/Login';
import React from 'react';
import Footer from './components/Footer';
import Test from './pages/InputSoal';
import keycloak from './keyloak';

function App() {
  keycloak
  .init({
    onLoad: "login-required",
    pkceMethod: "S256",
  })
  .then((authenticated) => {
    if (!authenticated) {
      window.location.reload();
    } else {
      ReactDOM.createRoot(document.getElementById("root")).render(
        <App />
      );
    }
  });
  return (
    <BrowserRouter>
      <Navbar />
      <Footer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Belajar" element={<Belajar />} />
        <Route path="/Test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;