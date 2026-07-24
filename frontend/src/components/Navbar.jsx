// frontend/src/components/Navbar.jsx (updated)
import React from "react";
import { Link, useNavigate } from "react-router-dom";



const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login");
};


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ba89ec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg></span>
          <span className="logo-text">Nexora</span>
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/interview/track" className="nav-link">Start Interview</Link>
          <button
                  className="nav-link"
                  onClick={handleLogout}
                  style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "inherit",
                      font: "inherit",
                    }}
                  >
                 Logout
              </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar