// App.jsx - Pastikan seperti ini
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Belajar from './pages/Belajar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Belajar" element={<Belajar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;