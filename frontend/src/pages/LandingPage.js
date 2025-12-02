import React, { Suspense, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { spline_landing_page } from "../assets/spline_link.js";

export default function LandingPage() {
  const navigate = useNavigate();
  const splineRef = useRef();
  const mouseTargetRef = useRef({ x: 0.5, y: 0.5 });

  const onSplineLoad = (spline) => {
    splineRef.current = spline;
  };

  // Prevent zoom on mobile and desktop
  useEffect(() => {
    // Prevent pinch zoom on touch devices
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
//retry file
    // Prevent ctrl/cmd + scroll zoom
    const preventScrollZoom = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom on mobile
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('wheel', preventScrollZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('wheel', preventScrollZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  // Smooth mouse tracking animation - Disabled due to missing variables in Spline scene
  // useEffect(() => {
  //   const animate = () => {
  //     const target = mouseTargetRef.current;
  //     const current = mouseCurrentRef.current;
  //     current.x += (target.x - current.x) * 0.1;
  //     current.y += (target.y - current.y) * 0.1;
  //     if (splineRef.current) {
  //       splineRef.current.setVariable('mouseX', current.x);
  //       splineRef.current.setVariable('mouseY', current.y);
  //     }
  //     requestAnimationFrame(animate);
  //   };
  //   const id = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(id);
  // }, []);

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

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseTargetRef.current = { x, y };
  };

  return (
    <>
      <style>{`
                /* Prevent zoom globally */
                * {
                    touch-action: pan-x pan-y;
                    -ms-touch-action: pan-x pan-y;
                }

                html, body {
                    overflow-x: hidden;
                    overflow-y: auto;
                    width: 100%;
                    position: relative;
                }

                /* Spline Background (Layer 1) */
                .spline-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    z-index: 1;
                    pointer-events: auto;
                    overflow: hidden;
                }

                /* Allow scrolling on mobile while preventing zoom */
                .spline-background canvas {
                    touch-action: pan-y !important;
                }

                /* Main Content Container (Layer 2) */
                .page-content {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    pointer-events: none;
                }

                /* Centered Cinematic Header */
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

                /* Enhanced VLoom Title */
                .header-title {
                    font-family: "Poppins", "Inter", sans-serif;
                    font-weight: 800;
                    font-size: clamp(4.5rem, 10vw, 8rem);
                    letter-spacing: -2px;
                    line-height: 0.9;
                    background: linear-gradient(
                        135deg,
                        #000000 0%,
                        #ffffff 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    position: relative;
                    display: inline-block;
                    animation: softFloat 6s ease-in-out infinite alternate,
                               shimmer 3s ease-in-out infinite;
                    filter: drop-shadow(0 0 40px rgba(0, 0, 0, 0.5))
                            drop-shadow(0 0 80px rgba(255, 255, 255, 0.3));
                }

                /* Add glowing effect behind text */
                .header-title::before {
                    content: 'VLoom';
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -1;
                    background: linear-gradient(
                        135deg,
                        rgba(0,0,0,0.8) 0%,
                        rgba(255,255,255,0.8) 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: blur(20px);
                    opacity: 0.7;
                }

                .header-subtitle {
                    font-family: "Inter", sans-serif;
                    font-size: clamp(1rem, 2vw, 1.35rem);
                    color: rgba(255, 255, 255, 0.95);
                    font-weight: 400;
                    line-height: 1.8;
                    text-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
                    margin-top: 2rem;
                    backdrop-filter: blur(8px) saturate(180%);
                    background: rgba(255, 255, 255, 0.12);
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 1rem 2rem;
                    display: inline-block;
                    animation: fadeSlideUp 1.2s ease-out 0.5s forwards;
                    opacity: 0;
                }

                /* Shimmer animation for title */
                @keyframes shimmer {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                /* Subtle Floating Animation */
                @keyframes softFloat {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-15px); }
                }

                @keyframes fadeSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Auto-Scrolling Product Cards */
                .scroller {
                    max-width: 1200px;
                    margin: 0 auto;
                    overflow: hidden;
                    -webkit-mask: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
                    mask: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
                    contain: content;
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
                
                /* Product Card (Frosted Glass) */
                .product-card {
                    width: var(--card-width);
                    flex-shrink: 0;
                    border-radius: 0.75rem;
                    background-color: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    contain: content;
                    will-change: transform;
                    pointer-events: auto;
                }

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
                    fill: #f59e0b;
                }
                
                /* Section Wrapper */
                .product-section, .auth-section-new {
                    padding: 4rem 1rem;
                    background-color: transparent;
                    position: relative;
                    overflow: hidden;
                    pointer-events: auto;
                }

                .product-section h2 {
                    color: #fff;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    font-size: 3rem;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                /* Gradient Box for Auth */
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
                    pointer-events: auto;
                }
                
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
                    .header-title { animation: none; }
                }

                .gradient-auth-box .text-gray-800 {
                    color: #1f2937;
                }
                .gradient-auth-box .text-gray-600 {
                    color: #4b5563;
                }

                /* Bubble Auth Button Styles */
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

                /* Copyright Bar Footer */
                footer.copyright-bar {
                    background-color: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
                    color: #1a1a1a;
                    padding: 2rem 1rem;
                    pointer-events: auto;
                }
                
                footer.copyright-bar a {
                    color: #1a1a1a;
                }
                footer.copyright-bar a:hover {
                    text-decoration: underline;
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .header-title {
                        font-size: clamp(4rem, 15vw, 6rem);
                        letter-spacing: -2px;
                    }

                    .header-subtitle {
                        font-size: clamp(1rem, 4vw, 1.3rem);
                        padding: 1rem 1.5rem;
                    }

                    .product-section, .auth-section-new {
                        padding: 2rem 1rem;
                    }

                    .product-section h2 {
                        font-size: 2.5rem;
                        margin-bottom: 2rem;
                    }

                    .bubble-btn {
                        min-width: 220px;
                        padding: 1rem 2.5rem;
                        font-size: 1.2rem;
                    }

                    footer.copyright-bar {
                        padding: 1.5rem 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .header-title {
                        font-size: clamp(4.5rem, 18vw, 7rem);
                    }

                    .header-subtitle {
                        font-size: clamp(1.1rem, 5vw, 1.4rem);
                    }

                    .product-section h2 {
                        font-size: 2rem;
                    }

                    .bubble-btn {
                        min-width: 200px;
                        padding: 0.9rem 2rem;
                        font-size: 1.1rem;
                    }
                }
            `}</style>

      {/* LAYER 1: 3D SPLINE BACKGROUND */}
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
                color: "#fff",
              }}
            >
              Loading 3D...
            </div>
          }
        >
          <Spline scene={spline_landing_page} onLoad={onSplineLoad} onMouseMove={handleMouseMove} />
        </Suspense>
      </div>


      {/* LAYER 2: PAGE CONTENT */}
      <div className="page-content">
        {/* 1. Header */}
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
              {[
                { img: "https://www.iconickart.com/cdn/shop/files/Let-s-Go-Green-Jute-Bag-3.jpg?v=1709933386&width=416", title: "Handcrafted Jute Bag", reviews: 12, quote: "So durable and stylish! I get compliments everywhere." },
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVmbogOOa9iZk0c-ySxU5prxkNcralnnaiA&s", title: "Glass Bangles Set", reviews: 31, quote: "The colors are so vibrant and beautiful. They feel authentic." },
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jFkzRoep-rytaDmH1yZqIK-iBkcUSbgamA&s", title: "Hand-Stitched Football", reviews: 8, quote: "This is a proper, high-quality ball. My kids love it." },
                { img: "https://m.media-amazon.com/images/I/91AhxjgnToL._AC_UF894,1000_QL80_.jpg", title: "Clay Pottery Vase", reviews: 22, quote: "Looks amazing on my mantle. You can feel the quality." },
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwTs-xHv0I8jzlBjfENOat21SNNzHszz7mQ&s", title: "Embroidered Shawl", reviews: 19, quote: "A perfect gift for my mother. The detail is incredible." },
                { img: "https://m.media-amazon.com/images/I/71RjgSwW0hL._AC_UF1000,1000_QL80_.jpg", title: "Carved Wooden Box", reviews: 4, quote: "Smells like real wood, high quality hinge." },
                { img: "https://www.fabvoguestudio.com/cdn/shop/files/pr-pco-0-ta08633p18-108-white-floral-printed-pure-cotton-fabric-material-1.jpg?v=1756980089", title: "Printed Cotton Fabric", reviews: 41, quote: "Used this to make curtains. The print is gorgeous." },
              ].concat([
                { img: "https://www.iconickart.com/cdn/shop/files/Let-s-Go-Green-Jute-Bag-3.jpg?v=1709933386&width=416", title: "Handcrafted Jute Bag", reviews: 12, quote: "So durable and stylish! I get compliments everywhere." },
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVmbogOOa9iZk0c-ySxU5prxkNcralnnaiA&s", title: "Glass Bangles Set", reviews: 31, quote: "The colors are so vibrant and beautiful. They feel authentic." },
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jFkzRoep-rytaDmH1yZqIK-iBkcUSbgamA&s", title: "Hand-Stitched Football", reviews: 8, quote: "This is a proper, high-quality ball. My kids love it." },
                { img: "https://m.media-amazon.com/images/I/91AhxjgnToL._AC_UF894,1000_QL80_.jpg", title: "Clay Pottery Vase", reviews: 22, quote: "Looks amazing on my mantle. You can feel the quality." },
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfwTs-xHv0I8jzlBjfENOat21SNNzHszz7mQ&s", title: "Embroidered Shawl", reviews: 19, quote: "A perfect gift for my mother. The detail is incredible." },
                { img: "https://m.media-amazon.com/images/I/71RjgSwW0hL._AC_UF1000,1000_QL80_.jpg", title: "Carved Wooden Box", reviews: 4, quote: "Smells like real wood, high quality hinge." },
                { img: "https://www.fabvoguestudio.com/cdn/shop/files/pr-pco-0-ta08633p18-108-white-floral-printed-pure-cotton-fabric-material-1.jpg?v=1756980089", title: "Printed Cotton Fabric", reviews: 41, quote: "Used this to make curtains. The print is gorgeous." },
              ]).map((card, idx) => (
                <div key={idx} className="product-card">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <div className="flex items-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="star" viewBox="0 0 20 20">
                          <path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path>
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{card.reviews} Reviews</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{card.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Auth Section */}
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
                  setTimeout(() => navigate("/register"), 300);
                }}
                className="bubble-btn btn-bubble-primary"
              >
                Get Started (Sign Up)
              </button>
              <button
                onClick={(e) => {
                  createRipple(e);
                  setTimeout(() => navigate("/login"), 300);
                }}
                className="bubble-btn btn-bubble-secondary"
              >
                Login
              </button>
            </div>
          </div>
        </section>

        {/* 4. Footer */}
        <footer className="copyright-bar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-4">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">About Us</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">Contact</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">FAQ</a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="">Artisan Portal</a>
            </div>
            <p className="text-sm opacity-70">
              &copy; 2024 VLoom. All rights reserved. Connecting artisans, one craft at a time.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}