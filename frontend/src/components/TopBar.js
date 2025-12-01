import React, { useEffect, useState } from "react";

function TopBar({ name, onLogout }) {
  const [mounted, setMounted] = useState(false);
  const [displayMode, setDisplayMode] = useState(0); // 0: name, 1: shopper ID, 2: shop name
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  const cycleDisplay = () => {
    setDisplayMode((prev) => (prev + 1) % 3);
  };

  const getDisplayText = () => {
    if (!userData) return name ? name.toUpperCase() : "";
    
    switch (displayMode) {
      case 0:
        return `WELCOME ${name ? name.toUpperCase() : ""}`;
      case 1:
        return `ID: ${userData._id.slice(-8).toUpperCase()}`;
      case 2:
        return userData.shopName ? `🏪 ${userData.shopName.toUpperCase()}` : `WELCOME ${name ? name.toUpperCase() : ""}`;
      default:
        return name ? name.toUpperCase() : "";
    }
  };

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
        <span 
          className="welcome-text" 
          aria-live="polite"
          onClick={cycleDisplay}
          style={{ cursor: 'pointer' }}
          title="Click to cycle display"
        >
          {getDisplayText()}
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          color: white;
          padding: 16px 28px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          font-size: 1.05rem;
          user-select: none;
          overflow: hidden;
        }

        .fade-slide-down {
          animation: fadeSlideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .welcome-text {
          animation: fadeInText 1s ease forwards;
          letter-spacing: 0.03em;
          white-space: nowrap;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .welcome-text:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .welcome-text:active {
          transform: scale(0.95);
        }

        .logout-btn {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 10px 24px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          font-family: 'Outfit', sans-serif;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }

        .logout-btn:hover,
        .logout-btn:focus-visible {
          background: rgba(244, 67, 54, 0.9);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4);
          transform: translateY(-2px);
          outline: none;
        }

        .logout-btn:active {
          transform: translateY(0) scale(0.95);
          box-shadow: 0 4px 10px rgba(244, 67, 54, 0.3);
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

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .topbar-container {
            padding: 12px 16px;
            font-size: 0.9rem;
          }
          .logout-btn {
            padding: 8px 18px;
            font-size: 0.85rem;
          }
          .welcome-text {
            font-size: 0.85rem;
            padding: 6px 12px;
          }
        }
      `}</style>
    </>
  );
}

export default TopBar;