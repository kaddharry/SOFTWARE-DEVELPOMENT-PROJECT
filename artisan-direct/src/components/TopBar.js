import React, { useEffect, useState } from "react";

function TopBar({ name, onLogout }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setMounted(true);
  }, []);

  // Ripple effect handler for logout button
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
      <div
        className={`topbar-container ${mounted ? "fade-slide-down" : ""}`}
        role="banner"
        aria-label="Top navigation bar"
      >
        <span className="welcome-text" aria-live="polite">
          WELCOME {name ? name.toUpperCase() : ""}
        </span>
        <button
          className="logout-btn"
          onClick={(e) => {
            createRipple(e);
            onLogout();
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInText {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes rippleEffect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .topbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, #1565c0, #1976d2, #1e88e5);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
          color: white;
          padding: 12px 24px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          user-select: none;
          overflow: hidden;
        }

        .fade-slide-down {
          animation: fadeSlideDown 0.5s ease forwards;
        }

        .welcome-text {
          animation: fadeInText 1s ease forwards;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .logout-btn {
          position: relative;
          overflow: hidden;
          background: #f44336;
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          background-size: 200% 100%;
          background-image: linear-gradient(
            90deg,
            #f44336 0%,
            #e53935 50%,
            #f44336 100%
          );
          outline-offset: 3px;
        }

        .logout-btn:hover,
        .logout-btn:focus-visible {
          animation: shine 1.2s linear infinite;
          background-position: 100% 0;
          box-shadow: 0 0 12px rgba(244, 67, 54, 0.7);
          outline: none;
        }

        .logout-btn:focus-visible {
          outline: 3px solid #ff7961;
        }

        .logout-btn:active {
          background-color: #d32f2f;
          box-shadow: none;
          transform: scale(0.97);
          transition: transform 0.1s ease;
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          animation: rippleEffect 0.6s linear;
          pointer-events: none;
          transform: scale(0);
          opacity: 0.75;
          z-index: 10;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .topbar-container {
            padding: 10px 16px;
            font-size: 1rem;
          }
          .logout-btn {
            padding: 8px 16px;
            font-size: 0.9rem;
          }
          .welcome-text {
            font-size: 1rem;
            white-space: normal;
          }
        }
      `}</style>
    </>
  );
}

export default TopBar;