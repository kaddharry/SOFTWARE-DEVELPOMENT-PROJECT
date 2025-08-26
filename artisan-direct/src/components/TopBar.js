import React from "react";

// The component now accepts an 'onLogout' function as a prop
function TopBar({ name, onLogout }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "#1976d2",
      color: "white",
      padding: "10px 20px", // Added more horizontal padding
      zIndex: 1000,
      display: "flex", // Use flexbox for alignment
      justifyContent: "space-between", // Pushes items to opposite ends
      alignItems: "center" // Vertically aligns items
    }}>
      {/* Welcome message on the left */}
      <span style={{ fontWeight: "bold" }}>
        WELCOME {name ? name.toUpperCase() : ''}
      </span>

      {/* Logout button on the right */}
      <button 
        onClick={onLogout} 
        style={{
          background: "#f44336", // A red color for logout
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default TopBar;
