import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
// This import will now work because you ran "npm install"
import Spline from '@splinetool/react-spline';

// A simple SVG icon for the login page header
const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg"  width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        {/* UPDATED: This is now a 2-column card */}
        <div className="login-card">
          
          {/* --- Column 1: 3D Spline Scene --- */}
          <div className="spline-column">
            <Suspense fallback={<div className="spline-loading">Loading 3D...</div>}>
              {/* This is your new scene */}
              <Spline scene="https://prod.spline.design/T3mjBDAGxBa3WlMI/scene.splinecode" />
            </Suspense>
          </div>

          {/* --- Column 2: Login Form --- */}
          <div className="form-column">
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
      </div>

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f4f8;
          font-family: sans-serif;
          padding: 20px;
        }

        /* UPDATED: This is now the main card */
        .login-card {
          width: 100%;
          max-width: 900px; /* Wider to fit both columns */
          display: grid;
          grid-template-columns: 1fr 1fr; /* 2 equal columns */
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden; /* Important to keep rounded corners */
        }
        
        /* --- Column 1: 3D Spline Scene --- */
        .spline-column {
            background-color: #e0e7ff; /* A light bg for the 3D scene */
            min-height: 500px; /* Give it some height */
            position: relative; /* For the loading text */
        }

        .spline-loading {
            color: #666;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* --- Column 2: Login Form --- */
        .form-column {
            padding: 3rem;
        }

        /* --- Responsive: Stack columns on mobile --- */
        @media (max-width: 768px) {
            .login-card {
                grid-template-columns: 1fr; /* Stack to 1 column */
            }
            .spline-column {
                /* Hide the 3D scene on mobile to save performance */
                display: none; 
            }
            .form-column {
                padding: 2rem;
            }
        }
        
        /* --- All your original form styles --- */
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
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