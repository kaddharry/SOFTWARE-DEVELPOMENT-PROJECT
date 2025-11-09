import React, { Suspense } from "react"; // Simplified imports
import { useNavigate } from "react-router-dom";
// This is the correct import for your project
import Spline from "@splinetool/react-spline";

export default function LandingPage() {
  const navigate = useNavigate();

  // Kept the ripple effect for your bubble buttons
  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.classList.add("ripple");

    const oldRipple = button.getElementsByClassName("ripple")[0];
    if (oldRipple) {
      oldRipple.remove();
    }
    button.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  };

  return (
    <>
      <style>{`
                /* --- REMOVED: All body, dark mode, and particle styles --- */

                /* --- NEW: Spline Background (Layer 1) --- */
                .spline-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    z-index: 1; /* Sits behind everything */
                    /* This is part of the cursor fix */
                    pointer-events: auto; 
                }

                /* --- NEW: Main Content Container (Layer 2) --- */
                .page-content {
                    position: relative;
                    z-index: 10; /* Sits on top of the Spline scene */
                    width: 100%;
                    /* This is the main part of the cursor fix: */
                    /* Mouse events pass THROUGH this layer... */
                    pointer-events: none; 
                }

                /* --- NEW: Header (Title) --- */
                /* This is a simple spacer to show the title over the 3D scene */
                /* --- Cinematic Fullscreen Header --- */
/* --- Centered Cinematic Header --- */
.landing-header {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  z-index: 5;
  pointer-events: none;
}

.header-content {
  max-width: 850px;
  padding: 2rem;
  text-align: center;
  pointer-events: none;
}

/* --- VLoom Title --- */
.header-title {
  font-family: "Poppins", "Inter", sans-serif;
  font-weight: 700;
  font-size: clamp(4rem, 9vw, 7rem);
  letter-spacing: -1px;
  line-height: 1;
  background: linear-gradient(115deg, #ffffff 5%, #e3e9ff 30%, #c7b8ff 60%, #a3d8ff 95%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 
    0 0 35px rgba(180, 210, 255, 0.4),
    0 0 70px rgba(180, 240, 255, 0.2);
  animation: softFloat 6s ease-in-out infinite alternate;
  opacity: 1;
}

.header-subtitle {
  font-family: "Inter", sans-serif;
  font-size: clamp(1rem, 2vw, 1.35rem);
  color: rgba(255, 255, 255, 0.93);
  font-weight: 400;
  line-height: 1.8;
  text-shadow: 0 4px 25px rgba(0, 0, 0, 0.25);
  margin-top: 1.5rem;
  backdrop-filter: blur(4px) saturate(180%);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  display: inline-block;
  animation: fadeSlideUp 1.2s ease-out 0.5s forwards;
  opacity: 0;
}

/* --- Subtle Floating Animation --- */
@keyframes softFloat {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-10px); }
}

@keyframes fadeSlideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}



                /* NOTE: The "VLoom" text is now part of your 3D scene, 
                  so we don't need to add an <h1> here. 
                  This header is just a spacer.
                */

                /* --- Auto-Scrolling Product Cards --- */
                .scroller {
                    max-width: 1200px;
                    margin: 0 auto;
                    overflow: hidden;
                    -webkit-mask: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
                    mask: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
                    contain: content;
                    /* ... but this element IS interactive (scrolling) */
                    pointer-events: auto; 
                }

                .scroller-inner {
                    --card-width: 288px;
                    --card-count: 14; 
                    --gap: 1.5rem;
                    display: flex;
                    gap: var(--gap);
                    width: max-content;
                    animation: scroll 40s linear infinite;
                    will-change: transform;
                }
                
                .scroller:hover .scroller-inner {
                    animation-play-state: paused;
                }

                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc( (var(--card-width) + var(--gap)) * (var(--card-count) / 2) * -1 ));
                    }
                }
                
                /* UPDATED: Product Card (Frosted Glass) */
                .product-card {
                    width: var(--card-width);
                    flex-shrink: 0;
                    border-radius: 0.75rem;
                    
                    /* NEW: Frosted glass effect */
                    background-color: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

                    transition: all 0.3s ease;
                    contain: content;
                    will-change: transform;
                    /* ... and this element IS interactive (hover) */
                    pointer-events: auto; 
                }

                /* Text inside the glass card must be dark to be readable */
                .product-card h3 {
                    color: #1a1a1a;
                }
                .product-card p, .product-card span {
                    color: #333;
                }

                @media (max-width: 640px) {
                    .scroller-inner {
                        --card-width: 240px;
                        --gap: 1rem;
                    }
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% {
                            transform: translateX(calc( (240px + 1rem) * 7 * -1 ));
                        }
                    }
                }
                
                .product-card:hover {
                    transform: translate3d(0, -5px, 0);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
                }

                .star {
                    width: 1rem;
                    height: 1rem;
                    fill: #f59e0b; /* amber-500 */
                }

                /* --- REMOVED: Dark Mode Toggle Button --- */
                
                /* --- Section Wrapper --- */
                /* UPDATED: Sections are now transparent */
                .product-section, .auth-section-new {
                    padding: 4rem 1rem;
                    background-color: transparent; /* IMPORTANT */
                    position: relative;
                    overflow: hidden; 
                    /* ... and this element IS interactive */
                    pointer-events: auto;
                }

                .product-section h2 {
                    color: #fff; /* White text for section title */
                    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    font-size: 3rem;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                /* --- Gradient Box for Auth --- */
                /* This already has the frosted glass style, so it's perfect */
                .gradient-auth-box {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2.5rem;
                    border-radius: 1.5rem;
                    text-align: center;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.12);
                    background-color: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(12px) saturate(150%);
                    -webkit-backdrop-filter: blur(12px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    /* ... and this element IS interactive */
                    pointer-events: auto; 
                }
                
                /* Gradient glow behind the auth box */
                .gradient-auth-box::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: -1;
                    border-radius: 1.5rem;
                    background: linear-gradient(-45deg, #ffc3a0, #ffafbd, #c3a0ff, #a0c4ff);
                    background-size: 400% 400%;
                    animation: gradientShift 15s ease infinite;
                    filter: blur(20px);
                    opacity: 0.7;
                }
                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .scroller-inner { animation: none; }
                    .gradient-auth-box::before { animation: none; }
                }

                /* Text inside auth box must be dark */
                .gradient-auth-box .text-gray-800 {
                    color: #1f2937;
                }
                .gradient-auth-box .text-gray-600 {
                    color: #4b5563;
                }

                /* --- Bubble Auth Button Styles --- */
                /* These are unchanged and will work perfectly */
                .bubble-btn {
                    position: relative;
                    overflow: hidden;
                    display: inline-block;
                    padding: 1rem 2.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    border-radius: 50px;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s ease-out;
                    text-align: center;
                    min-width: 240px;
                }
                .bubble-btn:active {
                    transform: scale(0.96);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                .btn-bubble-primary {
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.4);
                }
                .btn-bubble-primary:hover {
                    background-color: #2563eb;
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.4);
                }
                .btn-bubble-secondary {
                    background-color: #f8f7f3;
                    color: #3b82f6;
                    border: 2px solid #e0e0e0;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.8);
                }
                .btn-bubble-secondary:hover {
                    border-color: #3b82f6;
                    color: #2563eb;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.8);
                }
                
                /* Ripple Effect */
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.2);
                    animation: rippleEffect 0.6s linear;
                    pointer-events: none;
                    transform: scale(0);
                    opacity: 0.75;
                    z-index: 10;
                }
                @keyframes rippleEffect {
                    to { transform: scale(4); opacity: 0; }
                }

                /* --- UPDATED: Copyright Bar Footer (Frosted Glass) --- */
                footer.copyright-bar {
                    /* NEW: Frosted glass */
                    background-color: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);

                    /* NEW: Dark text */
                    color: #1a1a1a;
                    padding: 2rem 1rem;
                    
                    /* ... and this element IS interactive */
                    pointer-events: auto;
                }
                
                footer.copyright-bar a {
                    color: #1a1a1a; /* Dark links */
                }
                footer.copyright-bar a:hover {
                    text-decoration: underline;
                }
            `}</style>

      {/* --- REMOVED: Particle background canvas --- */}
      {/* --- REMOVED: Dark Mode Toggle Button --- */}

      {/* --- LAYER 1: 3D SPLINE BACKGROUND --- */}
      <div className="spline-background">
        <Suspense
          fallback={
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Loading 3D...
            </div>
          }
        >
          <Spline scene="https://prod.spline.design/y3BjH9DxDt6pKkr5/scene.splinecode" />
        </Suspense>
      </div>

      {/* --- LAYER 2: PAGE CONTENT --- */}
      <div className="page-content">
        {/* 1. Header (Spacer) */}
        <header className="landing-header">
          <div className="header-content">
            <h1 className="header-title">VLoom</h1>
            <p className="header-subtitle">
              We believe in celebrating authentic craft, fostering a sustainable
              ecosystem where artisans can thrive and connect with their
              audiences in innovative ways.
            </p>
          </div>
        </header>

        {/* 2. Product Carousel Section */}
        <section className="product-section">
          <h2>Featured Artisan Crafts</h2>
          <div className="scroller">
            <div className="scroller-inner" style={{ "--card-count": 14 }}>
              {/* Card Set 1 */}
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/EAB308/FFFFFF?text=Jute+Bag"
                  alt="Jute Bag"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    Handcrafted Jute Bag
                  </h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      12 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "So durable and stylish! I get compliments everywhere."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/34D399/FFFFFF?text=Bangles"
                  alt="Bangles"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Glass Bangles Set</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      31 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "The colors are so vibrant and beautiful. They feel
                    authentic."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/F87171/FFFFFF?text=Football"
                  alt="Football"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    Hand-Stitched Football
                  </h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      8 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "This is a proper, high-quality ball. My kids love it."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/60A5FA/FFFFFF?text=Pottery"
                  alt="Pottery"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Clay Pottery Vase</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      22 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Looks amazing on my mantle. You can feel the quality."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/A78BFA/FFFFFF?text=Shawl"
                  alt="Shawl"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Embroidered Shawl</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      19 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "A perfect gift for my mother. The detail is incredible."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/F472B6/FFFFFF?text=Woodwork"
                  alt="Woodwork"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Carved Wooden Box</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      4 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Smells like real wood, high quality hinge."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/22C55E/FFFFFF?text=Fabric"
                  alt="Fabric"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    Printed Cotton Fabric
                  </h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      41 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Used this to make curtains. The print is gorgeous."
                  </p>
                </div>
              </div>

              {/* Card Set 2 (Duplicates) */}
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/EAB308/FFFFFF?text=Jute+Bag"
                  alt="Jute Bag"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    Handcrafted Jute Bag
                  </h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      12 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "So durable and stylish! I get compliments everywhere."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/34D399/FFFFFF?text=Bangles"
                  alt="Bangles"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Glass Bangles Set</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      31 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "The colors are so vibrant and beautiful. They feel
                    authentic."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/F87171/FFFFFF?text=Football"
                  alt="Football"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    Hand-Stitched Football
                  </h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      8 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "This is a proper, high-quality ball. My kids love it."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/60A5FA/FFFFFF?text=Pottery"
                  alt="Pottery"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Clay Pottery Vase</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      22 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Looks amazing on my mantle. You can feel the quality."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/A78BFA/FFFFFF?text=Shawl"
                  alt="Shawl"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Embroidered Shawl</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      19 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "A perfect gift for my mother. The detail is incredible."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/F472B6/FFFFFF?text=Woodwork"
                  alt="Woodwork"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">Carved Wooden Box</h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      4 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Smells like real wood, high quality hinge."
                  </p>
                </div>
              </div>
              <div className="product-card">
                <img
                  src="https://placehold.co/400x300/22C55E/FFFFFF?text=Fabric"
                  alt="Fabric"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    Printed Cotton Fabric
                  </h3>
                  <div className="flex items-center my-2">
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">
                      41 Reviews
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "Used this to make curtains. The print is gorgeous."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Auth Section (NEW GRADIENT BOX) */}
        <section className="auth-section-new">
          <div className="gradient-auth-box">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Join the VLoom Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Discover unique crafts or share your own creations with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={(e) => {
                  createRipple(e);
                  setTimeout(() => navigate("/register"), 300); // Wait for ripple
                }}
                className="bubble-btn btn-bubble-primary"
              >
                Get Started (Sign Up)
              </button>
              <button
                onClick={(e) => {
                  createRipple(e);
                  setTimeout(() => navigate("/login"), 300); // Wait for ripple
                }}
                className="bubble-btn btn-bubble-secondary"
              >
                Login
              </button>
            </div>
          </div>
        </section>

        {/* 4. Footer (NEW COPYRIGHT BAR) */}
        <footer className="copyright-bar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-4">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">
                About Us
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">
                Contact
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">
                FAQ
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">
                Artisan Portal
              </a>
            </div>
            <p className="text-sm opacity-70">
              &copy; 2024 VLoom. All rights reserved. Connecting artisans, one
              craft at a time.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
