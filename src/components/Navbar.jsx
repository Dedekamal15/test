import logo from "../assets/react.svg";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 animate-spin" />
          <span className="text-xl font-bold">TST TASK 1</span>
        </div>
      
        <div className="flex gap-6">
          <button className="hover:text-blue-600 transition">Belajar</button>
          <button className="hover:text-blue-600 transition">Bermain</button>
          <button className="hover:text-blue-600 transition">Test</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;