import React, { useState } from "react";
import { Link } from "react-router-dom";

// A simple SVG icon for the registration page header
const RegisterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#007BFF"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

function RegisterForm({ onNext }) {
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValid = () => {
    const { name, shopName, address, city, state, gender, phone } = formData;
    if (
      !name ||
      !shopName ||
      !address ||
      !city ||
      !state ||
      !gender ||
      !phone
    ) {
      alert("Please fill all required fields!");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!isValid()) return;
    onNext(formData);
  };

  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <div className="register-header">
            <RegisterIcon />
            <h2>Create Your Account</h2>
            <p>Step 1: Tell us about yourself and your shop</p>
          </div>
          <form onSubmit={handleNext}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ramu Kaka"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="shopName">Shop Name</label>
              <input
                id="shopName"
                type="text"
                name="shopName"
                placeholder="e.g., B.Tech Sabun wala"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="10-digit number for verification"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="e.g., Sandhu Colony"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="Anytown"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="register-btn">
              Next: Verify Phone
            </button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <style>{`
        .register-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f4f8;
          font-family: sans-serif;
          padding: 20px 0; /* Add vertical padding */
        }
        .register-box {
          width: 100%;
          max-width: 450px;
          background: white;
          padding: 3.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        .register-header {
        display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2rem;
        }
        .register-header h2 {
          color: #003366;
          margin: 1rem 0 0.5rem;
        }
        .register-header p {
          color: #666;
          font-size: 0.9rem;
        }
        .input-group {
          margin-bottom: 1.2rem;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: #333;
        }
        .input-group input, .input-group select {
          width: 100%;
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-group input:focus, .input-group select:focus {
          outline: none;
          border-color: #007BFF;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }
        .register-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 8px;
          background-color: #FFA500;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .register-btn:hover {
          background-color: #e69500;
        }
        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #555;
        }
        .login-link a {
          color: #007BFF;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default RegisterForm;
