import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogIn, FiLogOut, FiUser, FiHome, FiPlus, FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname.startsWith("/login");

  return (
    <nav className="w-screen bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider text-accent hover:text-gray-800">
          DevConnect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-base font-medium items-center">
          {!isLoggedIn && !isLoginPage && (
            <Link
              to="/login"
              className="flex items-center gap-1 hover:text-highlight transition text-accent" 
            >
              <FiLogIn /> Login
            </Link>
          )}

          {isLoggedIn && !isAdminPage && (
            <>
              <Link
                to="/home"
                className="text-gray-800 flex items-center gap-1 hover:text-accent transition"
              >
                <FiHome /> Home
              </Link>
              <Link
                to="/add-post"
                className="flex text-gray-800 items-center gap-1 hover:text-accent transition"
              >
                <FiPlus /> Add Post
              </Link>
              <Link
                to="/profile"
                className="flex text-gray-800 items-center gap-1 hover:text-accent transition"
              >
                <FiUser /> Profile
              </Link>
            </>
          )}

          {isLoggedIn && (
            <Link
              onClick={handleLogout}
              className="flex text-gray-800 items-center gap-1 hover:text-error transition"
            >
              <FiLogOut /> Logout
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-accent focus:outline-none"
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-primary text-white">
          {!isLoggedIn && !isLoginPage && (
            <Link to="/login" className="flex items-center gap-2 hover:text-highlight transition">
              <FiLogIn /> Login
            </Link>
          )}

          {isLoggedIn && !isAdminPage && (
            <>
              <Link to="/home" className="flex items-center gap-2 hover:text-accent">
                <FiHome /> Home
              </Link>
              <Link to="/add-post" className="flex items-center gap-2 hover:text-accent">
                <FiPlus /> Add Post
              </Link>
              <Link to="/profile" className="flex items-center gap-2 hover:text-accent">
                <FiUser /> Profile
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-left bg-error hover:bg-opacity-80 text-white px-4 py-2 rounded-md transition"
            >
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
