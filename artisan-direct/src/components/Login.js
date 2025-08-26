import React, { useState } from "react";
import { Link } from "react-router-dom";

// A simple SVG icon for the login page header
const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
);


function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!phone || !password) {
      setError("Please enter both your phone number and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }
      
      onLoginSuccess(data.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <LoginIcon />
            <h2>Welcome Back</h2>
            <p>Login to continue with Artisan Direct</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength="10"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f4f8; /* Same light blue/white as landing page */
          font-family: sans-serif;
          padding: 20px;
        }
        .login-box {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 4rem;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-header h2 {
          color: #003366;
          margin: 1rem 0 0.5rem;
        }
        .login-header p {
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
        }
        .input-group input:focus {
          outline: none;
          border-color: #007BFF; /* Blue focus color */
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }
        .login-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 8px;
          background-color: #FFA500; /* Orange button */
          color: white;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-btn:hover:not(:disabled) {
          background-color: #e69500; /* Darker orange on hover */
        }
        .login-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #d93025;
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #555;
        }
        .signup-link a {
          color: #007BFF;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default Login;
