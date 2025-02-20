import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-sm navbar-dark bg-transparent shadow-sm"
      style={{
        fontFamily:
          "San Francisco, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        backgroundColor: "transparent",
        padding: "4px 10px", // Thinner navbar
      }}
    >
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        style={{
          border: "none",
          background: "transparent",
        }}
      >
        <span className="navbar-toggler-icon" style={{ color: "#333" }}></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul
          className="navbar-nav mx-auto"
          style={{
            justifyContent: "space-around",
            flexDirection: "row",
            padding: "0",
          }}
        >
          <li className="nav-item text-center mx-3">
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "nav-link active-nav-link" : "nav-link"
              }
              style={{
                fontSize: "14px", // Smaller font size
                color: "#333",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "color 0.3s",
              }}
            >
              History
            </NavLink>
          </li>

          <li className="nav-item text-center mx-3">
            <NavLink
              to="/input"
              className={({ isActive }) =>
                isActive ? "nav-link active-nav-link" : "nav-link"
              }
              style={{
                fontSize: "14px", // Smaller font size
                color: "#333",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "color 0.3s",
              }}
            >
              Input
            </NavLink>
          </li>

          <li className="nav-item text-center mx-3">
            <NavLink
              to="/summary"
              className={({ isActive }) =>
                isActive ? "nav-link active-nav-link" : "nav-link"
              }
              style={{
                fontSize: "14px", // Smaller font size
                color: "#333",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "color 0.3s",
              }}
            >
              Summary
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
