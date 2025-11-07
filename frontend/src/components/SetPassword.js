import React, { useState } from "react";
// FIXED: Removed the unused 'useNavigate' import
// import { useNavigate } from "react-router-dom";

// A simple SVG icon for the password page header
const PasswordIcon = () => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

function SetPassword({ userData, onComplete }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // In src/components/SetPassword.js

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");

    // ... (your password validation checks remain the same) ...
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!userData) {
      setError(
        "User data is missing. Please start the registration process again."
      );
      return;
    }

    setIsLoading(true);

    const finalUserData = { ...userData, password };

    // The onComplete function now returns an error message if something goes wrong
    const errorMessage = await onComplete(finalUserData);

    // If there was an error, set it in the state to display it
    if (errorMessage) {
      setError(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="password-container">
        <div className="password-box">
          <div className="password-header">
            <PasswordIcon />
            <h2>Set Your Password</h2>
            <p>Step 3: Create a secure password to protect your account</p>
          </div>
          <form onSubmit={handleCompleteRegistration}>
            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="complete-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Registration"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>

      <style>{`
        .password-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f4f8;
          font-family: sans-serif;
          padding: 20px;
        }
        .password-box {
          width: 100%;
          max-width: 400px;
          background: white;
          /* FIXED: Increased padding to prevent elements from touching the edges */
          padding: 4rem; 
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        .password-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .password-header h2 {
          color: #003366;
          margin: 1rem 0 0.5rem;
        }
        .password-header p {
          color: #666;
          font-size: 0.9rem;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          color: #333;
        }
        .input-group input {
          width: 100%;
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box; /* Ensures padding doesn't add to width */
        }
        .input-group input:focus {
          outline: none;
          border-color: #007BFF;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }
        .complete-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 8px;
          background-color: #28a745; /* Green for completion */
          color: white;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .complete-btn:hover:not(:disabled) {
          background-color: #218838;
        }
        .complete-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #d93025;
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}

export default SetPassword;
