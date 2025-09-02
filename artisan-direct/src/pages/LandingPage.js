import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ArtisanGraphic = () => (
  <svg
    width="140"
    height="140"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="artisan-svg"
    aria-hidden="true"
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
      stroke="var(--primary-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 7L12 12L22 7"
      stroke="var(--primary-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12V22"
      stroke="var(--primary-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 4.5L7 9.5"
      stroke="var(--accent-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect on scroll for graphic
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ripple effect handler for buttons
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  return (
    <>
      <div className={`landing-container ${darkMode ? "dark" : "light"}`}>
        <button
          className="dark-toggle"
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((prev) => !prev)}
          title="Toggle dark mode"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>

        <div className="content-wrapper" role="main" aria-label="Landing page main content">
          <div
            className="graphic-container"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            <ArtisanGraphic />
          </div>
          <h1 className="main-title">Welcome to Artisan Direct</h1>
          <p className="subtitle">
            Connecting local artisans with customers, seamlessly.
          </p>
          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                createRipple(e);
                navigate("/register");
              }}
              aria-label="Get Started and Sign Up"
            >
              Get Started (Sign Up)
            </button>
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                createRipple(e);
                navigate("/login");
              }}
              aria-label="Login"
            >
              Login
            </button>
          </div>
        </div>

        {/* Background particles */}
        <div aria-hidden="true" className="particles">
          {[...Array(30)].map((_, i) => (
            <span key={i} className="particle" />
          ))}
        </div>
      </div>

      <style>{`
        /* Import Google Font */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        :root {
          --primary-color: #007BFF;
          --accent-color: #FFA500;
          --bg-light: #f0f4f8;
          --bg-dark: #121212;
          --text-light: #222;
          --text-dark: #eee;
          --btn-primary-start: #FFA500;
          --btn-primary-end: #FF8C00;
          --btn-secondary-light-bg: #fff;
          --btn-secondary-light-border: #007BFF;
          --btn-secondary-dark-bg: #222;
          --btn-secondary-dark-border: #FFA500;
          --btn-shadow-light: rgba(255, 165, 0, 0.6);
          --btn-shadow-dark: rgba(255, 165, 0, 0.9);
          --transition-ease: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Reset and base */
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Poppins', sans-serif;
          background: var(--bg-light);
          color: var(--text-light);
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .landing-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          background: linear-gradient(-45deg, #6a11cb, #2575fc, #6a11cb, #2575fc);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          transition: background 0.5s ease, color 0.5s ease;
          overflow: hidden;
        }

        .landing-container.dark {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: var(--text-dark);
        }

        /* Dark mode text overrides */
        .landing-container.dark .content-wrapper {
          background: #1e1e1e;
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }
        .landing-container.dark .btn-primary {
          box-shadow: 0 4px 12px var(--btn-shadow-dark);
        }
        .landing-container.dark .btn-primary:hover {
          box-shadow: 0 10px 25px var(--btn-shadow-dark);
        }
        .landing-container.dark .btn-secondary {
          background: var(--btn-secondary-dark-bg);
          border-color: var(--btn-secondary-dark-border);
          color: var(--accent-color);
          box-shadow: 0 4px 12px rgba(255, 165, 0, 0.4);
        }
        .landing-container.dark .btn-secondary:hover {
          background: var(--accent-color);
          color: #121212;
          border-color: transparent;
          box-shadow: 0 10px 25px rgba(255, 165, 0, 0.8);
        }
        .landing-container.dark .artisan-svg {
          filter: drop-shadow(0 0 8px var(--primary-color));
        }
        .landing-container.dark .artisan-svg:hover {
          filter: drop-shadow(0 0 20px var(--accent-color));
        }

        /* Dark mode toggle button */
        .dark-toggle {
          position: fixed;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: inherit;
          z-index: 1000;
          transition: transform 0.3s ease;
          user-select: none;
        }
        .dark-toggle:hover {
          transform: rotate(20deg);
        }
        .dark-toggle:focus-visible {
          outline: 3px solid var(--accent-color);
          outline-offset: 3px;
          border-radius: 50%;
        }

        .content-wrapper {
          background: #fff;
          padding: 3.5rem 3rem 3.5rem 3rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          max-width: 650px;
          width: 100%;
          text-align: center;
          animation: fadeSlideUp 1s var(--ease) forwards;
          opacity: 0;
          --ease: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .graphic-container {
          margin-bottom: 2.5rem;
          animation: float 5s ease-in-out infinite;
          will-change: transform;
          filter: drop-shadow(0 0 6px var(--primary-color));
          transition: filter 0.3s ease;
          cursor: default;
        }
        .graphic-container:hover {
          filter: drop-shadow(0 0 18px var(--accent-color));
        }

        .artisan-svg {
          width: 140px;
          height: 140px;
          stroke-width: 1.6;
          transition: filter 0.3s ease;
        }

        .main-title {
          font-size: 3.6rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 1rem;
          animation: fadeSlideUp 1s var(--ease) forwards;
          animation-delay: 0.15s;
          opacity: 0;
          letter-spacing: 0.03em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .subtitle {
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--text-light);
          margin-bottom: 3.5rem;
          animation: fadeSlideUp 1s var(--ease) forwards;
          animation-delay: 0.3s;
          opacity: 0;
          line-height: 1.5;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: fadeSlideUp 1s var(--ease) forwards;
          animation-delay: 0.45s;
          opacity: 0;
          justify-content: center;
        }

        /* Buttons */
        .btn {
          position: relative;
          overflow: hidden;
          padding: 16px 40px;
          border: none;
          border-radius: 14px;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          transition:
            transform 0.3s var(--transition-ease),
            box-shadow 0.3s var(--transition-ease),
            background-position 0.6s ease;
          outline-offset: 3px;
          outline-color: transparent;
          background-size: 200% 100%;
          background-position: left center;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }

        .btn:focus-visible {
          outline: 3px solid var(--accent-color);
          outline-offset: 4px;
        }

        .btn:hover {
          transform: scale(1.07);
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          background-position: right center;
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          animation: rippleEffect 0.6s linear;
          pointer-events: none;
          transform: scale(0);
          opacity: 0.75;
          z-index: 10;
        }

        @keyframes rippleEffect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .btn-primary {
          background-image: linear-gradient(45deg, var(--btn-primary-start), var(--btn-primary-end));
          color: white;
          box-shadow: 0 6px 15px var(--btn-shadow-light);
          background-position: left center;
        }

        .btn-primary:hover {
          background-image: linear-gradient(45deg, #FFB733, #FF9C1A);
          box-shadow: 0 14px 35px var(--btn-shadow-light);
        }

        .btn-secondary {
          background: var(--btn-secondary-light-bg);
          color: var(--primary-color);
          border: 2px solid var(--btn-secondary-light-border);
          box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
          background-position: left center;
        }

        .btn-secondary:hover {
          background: var(--primary-color);
          color: white;
          border-color: transparent;
          box-shadow: 0 14px 35px rgba(0, 123, 255, 0.7);
          background-position: right center;
        }

        /* Animations */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (min-width: 600px) {
          .button-group {
            flex-direction: row;
            gap: 2rem;
          }
          .button-group > button {
            min-width: 190px;
          }
          .main-title {
            font-size: 4.2rem;
          }
          .subtitle {
            font-size: 1.6rem;
          }
        }

        /* Background particles */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          animation: particleMove 15s linear infinite;
          opacity: 0.6;
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.3));
        }
        /* Randomize particle sizes and positions */
        .particle:nth-child(odd) {
          width: 6px;
          height: 6px;
          top: 10%;
          left: 20%;
          animation-delay: 0s;
          animation-duration: 18s;
        }
        .particle:nth-child(even) {
          width: 4px;
          height: 4px;
          top: 70%;
          left: 80%;
          animation-delay: 7s;
          animation-duration: 20s;
        }
        .particle:nth-child(3) {
          width: 8px;
          height: 8px;
          top: 40%;
          left: 50%;
          animation-delay: 3s;
          animation-duration: 22s;
        }
        .particle:nth-child(4) {
          width: 5px;
          height: 5px;
          top: 80%;
          left: 30%;
          animation-delay: 5s;
          animation-duration: 19s;
        }
        /* ... add more random positions for others */
        .particle:nth-child(n+5) {
          width: 3px;
          height: 3px;
          top: calc(10% + 80 * var(--i));
          left: calc(10% + 80 * var(--i));
          animation-delay: calc(2s * var(--i));
          animation-duration: calc(15s + 5 * var(--i));
        }

        @keyframes particleMove {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
}

export default LandingPage;