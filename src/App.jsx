import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Belajar from './pages/Belajar';
import BelajarWord from './components/belajar/word';
import BelajarExcel from './components/belajar/excel';
import BelajarPowerPoint from './components/belajar/powerpoint';
import BelajarJS from './components/belajar/js';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Belajar" element={<Belajar />} />
        <Route path="/belajar/word" element={<BelajarWord />} />
        <Route path="/belajar/Excel" element={<BelajarExcel />} />
        <Route path="/belajar/PowerPoint" element={<BelajarPowerPoint />} />
        <Route path="/belajar/JS" element={<BelajarJS />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;