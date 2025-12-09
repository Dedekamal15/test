import { NavLink } from 'react-router-dom'; 
import logo from "../assets/react.svg";
import { IoMenu, IoClose } from 'react-icons/io5';
import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        
        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            className="flex items-center gap-3"
            >
          <img src={logo} alt="Logo" className="w-10 h-10 animate-spin [animation-duration:5s]" />
          <span className="text-xl font-bold">TST TASK 1</span>
          </NavLink>
        </div>
        
       
        <div className="hidden md:flex gap-6">
          <NavLink 
            to="/belajar"
            className={({ isActive }) => 
              isActive 
                ? "text-white font-bold" 
                : "hover:text-white transition"
            }
          >
            Belajar
          </NavLink>
          
          <NavLink 
            to="/bermain"
            className={({ isActive }) => 
              isActive 
                ? "text-white font-bold" 
                : "hover:text-white transition"
            }
          >
            Bermain
          </NavLink>
          
          <NavLink 
            to="/test"
            className={({ isActive }) => 
              isActive 
                ? "text-white font-bold" 
                : "hover:text-white transition"
            }
          >
            Test
          </NavLink>

           <NavLink 
            to="/login"
            className={({ isActive }) => 
              isActive 
                ? "text-white font-bold" 
                : "hover:text-white transition"
            }
          >
            Login
          </NavLink>

           <NavLink 
            to="/test"
            className={({ isActive }) => 
              isActive 
                ? "text-white font-bold" 
                : "hover:text-white transition"
            }
          >
            Daftar
          </NavLink>
        </div>

        <button 
          className="md:hidden text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden text-xs font-bold bg-white border-t">
          <div className="flex flex-col text-xs font-bold gap-4 px-6 py-4">
            <NavLink 
              to="/belajar"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                isActive ? "text-white font-bold transition" : "hover:text-white"
              }
            >
              Belajar
            </NavLink>
            
            <NavLink 
              to="/bermain"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                isActive ? "text-white font-bold transition"  : "hover:text-white"
              }
            >
              Bermain
            </NavLink>
            
            <NavLink 
              to="/test"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                isActive ? "text-white font-bold transition" : "hover:text-white"
              }
            >
              Test
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;