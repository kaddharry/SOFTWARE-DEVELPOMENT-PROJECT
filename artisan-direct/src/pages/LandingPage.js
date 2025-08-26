import React from "react";
import { useNavigate } from "react-router-dom";

// We can use an inline SVG for a simple, lightweight graphic.
const ArtisanGraphic = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#007BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7L12 12L22 7" stroke="#007BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V22" stroke="#007BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4.5L7 9.5" stroke="#FFA500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-container">
        <div className="content-wrapper">
          <div className="graphic-container">
            <ArtisanGraphic />
          </div>
          <h1 className="main-title">
            Welcome to Artisan Direct
          </h1>
          <p className="subtitle">
            Connecting local artisans with customers, seamlessly.
          </p>
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/register")}
            >
              Get Started (Sign Up)
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      
      {/* It's good practice to keep styles with the component if they aren't in a separate CSS file */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .landing-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f4f8; /* A very light blue/white background */
          text-align: center;
          font-family: sans-serif;
          padding: 20px;
        }

        .content-wrapper {
          max-width: 600px;
          animation: fadeIn 1s ease-in-out;
        }

        .graphic-container {
            margin-bottom: 2rem;
            animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .main-title {
          font-size: 2.5rem;
          color: #003366; /* A deep navy blue */
          margin-bottom: 1rem;
          animation: slideUp 1s ease-out 0.5s backwards;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 2.5rem;
          animation: slideUp 1s ease-out 0.8s backwards;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideUp 1s ease-out 1.1s backwards;
        }

        .btn {
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-primary {
          background-color: #FFA500; /* Vibrant Orange */
          color: white;
        }

        .btn-secondary {
          background-color: #FFFFFF;
          color: #007BFF; /* Bright Blue */
          border: 2px solid #007BFF;
        }
        
        /* Responsive design for mobile */
        @media (min-width: 600px) {
          .button-group {
            flex-direction: row;
            justify-content: center;
          }
          .main-title {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default LandingPage;
