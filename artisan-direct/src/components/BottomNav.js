import React from "react";
import { NavLink } from "react-router-dom";
import "./BottomNav.css";
import { Home, ShoppingBag, User } from "lucide-react"; // nice icons

function BottomNav() {
  return (
    <div className="bottom-nav">
      {/* FIXED: The link now correctly points to "/home" */}
      <NavLink to="/home" className="nav-item">
        <Home size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/orders" className="nav-item">
        <ShoppingBag size={22} />
        <span>Orders</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item">
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
}

export default BottomNav;
