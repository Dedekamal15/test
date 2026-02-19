import { NavLink } from 'react-router-dom';
import logo from "../assets/react.svg";
import { IoMenu, IoClose } from 'react-icons/io5';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isGuru, isAuthenticated, login, logout, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">

        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 animate-spin [animation-duration:5s]" />
            <span className="text-xl font-bold">TST TASK 1</span>
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/belajar" className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500 transition"}>
            Belajar
          </NavLink>
          <NavLink to="/bermain" className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500 transition"}>
            Bermain
          </NavLink>
          <NavLink to="/test" className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500 transition"}>
            Test
          </NavLink>

          {/* Menu khusus Guru */}
          {isAuthenticated && isGuru && (
            <>
              <NavLink to="/daftar-nilai" className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500 transition"}>
                Daftar Nilai
              </NavLink>
              <NavLink to="/buat-soal" className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500 transition"}>
                Buat Soal
              </NavLink>
            </>
          )}

          {/* Tombol Login / Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hi, {user?.preferred_username}</span>
              <button onClick={logout} className="text-red-500 font-bold hover:text-red-700 transition">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={login} className="font-bold hover:text-gray-500 transition">
              Login
            </button>
          )}
        </div>

        <button className="md:hidden text-3xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden text-xs font-bold bg-white border-t">
          <div className="flex flex-col gap-4 px-6 py-4">
            <NavLink to="/belajar" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500"}>
              Belajar
            </NavLink>
            <NavLink to="/bermain" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500"}>
              Bermain
            </NavLink>
            <NavLink to="/test" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500"}>
              Test
            </NavLink>

            {/* Menu khusus Guru - Mobile */}
            {isAuthenticated && isGuru && (
              <>
                <NavLink to="/daftar-nilai" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500"}>
                  Daftar Nilai
                </NavLink>
                <NavLink to="/buat-soal" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-black font-bold" : "hover:text-gray-500"}>
                  Buat Soal
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
              <button onClick={logout} className="text-left text-red-500 font-bold">
                Logout
              </button>
            ) : (
              <button onClick={login} className="text-left font-bold">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;