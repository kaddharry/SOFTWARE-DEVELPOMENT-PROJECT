import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';  // ✅ Add this import
//adding comment to retry on git 
export default function LandingPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const particleCanvasRef = useRef(null); // RESTORED - Particles are back

    // Effect to handle the Unicorn Studio script (lazy + idle load)
    useEffect(() => {
        const headerEl = document.querySelector('header [data-us-project]');
        const alreadyLoaded = window.UnicornStudio && window.UnicornStudio.isInitialized;
        if (alreadyLoaded) return;

        const loadScript = () => {
            if (window.UnicornStudio && window.UnicornStudio.isInitialized) return;
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                    window.UnicornStudio.init();
                    window.UnicornStudio.isInitialized = true;
                }
            };
            document.body.appendChild(script);
        };

        // Load on idle to avoid blocking initial scroll
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => loadScript());
        } else {
            setTimeout(loadScript, 2000);
        }

        // Also ensure it loads when the header comes into view
        if (headerEl && 'IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadScript();
                        io.disconnect();
                    }
                });
            }, { rootMargin: '200px' });
            io.observe(headerEl);
            return () => io.disconnect();
        }
        return () => {};
    }, []);

    // Particle animation logic (DPR-aware, single resize handler, pause on hidden, respects reduced motion)
    useEffect(() => {
        const canvas = particleCanvasRef.current;
        if (!canvas) return;

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            canvas.width = 0; canvas.height = 0;
            return;
        }

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        let running = true;

        const devicePixelRatioSafe = Math.min(window.devicePixelRatio || 1, 1.5);

        function resizeCanvasAndReinit() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = Math.floor(w * devicePixelRatioSafe);
            canvas.height = Math.floor(h * devicePixelRatioSafe);
            ctx.setTransform(devicePixelRatioSafe, 0, 0, devicePixelRatioSafe, 0, 0);
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.2 + 0.8;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * 0.6 - 0.3;
                this.opacity = Math.random() * 0.5 + 0.25;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = darkMode ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Density reduced and scaled for DPR
            let numParticles = (canvas.width * canvas.height) / 30000; // sparser than before
            numParticles = Math.min(numParticles, 100);
            for (let i = 0; i < numParticles; i++) particles.push(new Particle());
        }

        function animate() {
            if (!running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let p of particles) { p.update(); p.draw(); }
            animationFrameId = requestAnimationFrame(animate);
        }

        // Initial setup
        resizeCanvasAndReinit();
        animate();

        // Single resize handler with debounce
        let resizeTimeout;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvasAndReinit, 150);
        };
        window.addEventListener('resize', onResize, { passive: true });

        // Pause when tab is hidden
        const onVisibility = () => {
            const hidden = document.hidden;
            if (hidden) {
                running = false;
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                if (!running) {
                    running = true;
                    animate();
                }
            }
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            running = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [darkMode]);

    // Effect to toggle dark class on the body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    // Add back the ripple effect for our new buttons
    const createRipple = (event) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add("ripple");

        // Ensure only one ripple exists at a time
        const oldRipple = button.getElementsByClassName("ripple")[0];
        if (oldRipple) {
            oldRipple.remove();
        }
        button.appendChild(circle);

        // Clean up the ripple after animation
        setTimeout(() => circle.remove(), 600);
    };


    return (
        <>
            <style>{`
                /* --- Base Theme --- */
                body {
                    background-color: #f8f7f3; /* Off-white theme */
                    font-family: 'Inter', sans-serif;
                    color: #1a1a1a;
                    overflow-x: hidden; /* Prevent horizontal scroll */
                    transition: background-color 0.5s ease, color 0.5s ease;
                }

                /* --- Dark Mode Theme --- */
                body.dark {
                    background-color: #1a1a1a;
                    color: #f8f7f3;
                }

                /* --- Unicorn Studio Override --- */
                [data-us-project] {
                    width: 100% !important; 
                    max-width: 1440px;
                    height: auto !important;
                    aspect-ratio: 1440 / 750;
                    margin: 0 auto;
                }
                
                [data-us-project] canvas {
                    width: 100% !important;
                    height: 100% !important;
                }

                /* --- Star Particle Background --- */
                #particle-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    pointer-events: none;
                }
                
                /* --- Responsive Auto-Scrolling Product Cards --- */
                .scroller {
                    max-width: 1200px;
                    margin: 0 auto;
                    overflow: hidden;
                    -webkit-mask: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
                    mask: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
                    contain: content;
                }

                .scroller-inner {
                    --card-width: 288px; /* Default card width */
                    --card-count: 14; /* Total number of cards (7 originals + 7 duplicates) */
                    --gap: 1.5rem;
                    
                    display: flex;
                    gap: var(--gap);
                    width: max-content;
                    
                    /* NEW: Dynamic animation duration */
                    animation: scroll var(--_animation-duration, 40s) linear infinite;
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
                        /* NEW: Precise calculation */
                        transform: translateX(calc( (var(--card-width) + var(--gap)) * (var(--card-count) / 2) * -1 ));
                    }
                }
                
                .product-card {
                    width: var(--card-width);
                    flex-shrink: 0;
                    border-radius: 0.75rem;
                    background-color: #ffffff;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    contain: content;
                    will-change: transform;
                }
                
                /* NEW: Responsive styles for carousel */
                @media (max-width: 640px) {
                    .scroller-inner {
                        --card-width: 240px; /* Smaller cards on mobile */
                        --gap: 1rem;
                        
                        /* NEW: Slower animation on mobile if desired */
                        /* animation-duration: 60s; */
                    }
                    
                    /* Recalculate animation end point */
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% {
                            transform: translateX(calc( (240px + 1rem) * 7 * -1 ));
                        }
                    }
                }

                body.dark .product-card {
                    background-color: #2c2c2c;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .product-card:hover {
                    transform: translate3d(0, -5px, 0);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
                }
                body.dark .product-card:hover {
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }

                .star {
                    width: 1rem;
                    height: 1rem;
                    fill: #f59e0b; /* amber-500 */
                }

                /* --- Dark Mode Toggle Button --- */
                .dark-mode-toggle {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 1000;
                    background-color: #fff;
                    color: #1a1a1a;
                    border: 1px solid #e0e0e0;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }
                .dark-mode-toggle:hover {
                    transform: scale(1.1);
                }
                body.dark .dark-mode-toggle {
                    background-color: #2c2c2c;
                    color: #f8f7f3;
                    border-color: #444;
                }
                
                /* --- Other Section Colors --- */
                body.dark header {
                    background-color: #222; /* Dark header bg */
                    box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.05);
                }
                body.dark .text-gray-800 { color: #f0f0f0; }
                body.dark .text-gray-600 { color: #aaa; }
                body.dark .text-gray-500 { color: #888; }

                /* --- NEW: Auth Section Wrapper --- */
                .auth-section-new {
                    padding: 4rem 1rem;
                    background-color: #ffffff;
                    position: relative;
                    overflow: hidden; /* For the gradient box blur */
                }
                body.dark .auth-section-new {
                    background-color: #111;
                }

                /* --- UPDATED: Gradient Box for Auth --- */
                .gradient-auth-box {
                    max-width: 600px;
                    margin: 0 auto; /* Center the box */
                    padding: 2.5rem; /* 40px */
                    border-radius: 1.5rem; /* 24px */
                    text-align: center;
                    position: relative;
                    z-index: 2;
                    
                    /* NEW: Soft, diffused shadow */
                    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.12);
                    
                    /* NEW: Frosted Glass Effect */
                    background-color: rgba(255, 255, 255, 0.6); /* Semi-transparent base */
                    backdrop-filter: blur(12px) saturate(150%);
                    -webkit-backdrop-filter: blur(12px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                /* NEW: Pseudo-element for the animated gradient BEHIND the box */
                .gradient-auth-box::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    border-radius: 1.5rem; /* Match parent */
                    
                    /* NEW: More vibrant pastel gradient */
                    background: linear-gradient(-45deg, #ffc3a0, #ffafbd, #c3a0ff, #a0c4ff);
                    background-size: 400% 400%;
                    animation: gradientShift 15s ease infinite;
                    filter: blur(20px); /* This makes the shadow softer */
                    opacity: 0.7;
                }

                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                /* Respect reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    .scroller-inner { animation: none; }
                    .gradient-auth-box::before { animation: none; }
                }

                /* Gradient box in dark mode */
                body.dark .gradient-auth-box {
                    background-color: rgba(44, 44, 44, 0.6); /* Darker base */
                    backdrop-filter: blur(12px) saturate(150%);
                    -webkit-backdrop-filter: blur(12px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.3);
                }

                body.dark .gradient-auth-box::before {
                    opacity: 0.5; /* Tone down the gradient in dark mode */
                }
                
                /* Text color is now inherited, but let's ensure it's right */
                body.dark .gradient-auth-box .text-gray-800 {
                    color: #f0f0f0; /* Use light text in dark mode */
                }
                body.dark .gradient-auth-box .text-gray-600 {
                    color: #aaa; /* Use light text in dark mode */
                }


                /* --- Bubble Auth Button Styles --- */
                .bubble-btn {
                    position: relative;
                    overflow: hidden; /* For the ripple */
                    display: inline-block;
                    padding: 1rem 2.5rem;
                    font-size: 1.25rem; /* 20px */
                    font-weight: 700;
                    border-radius: 50px; /* Bubble shape */
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s ease-out;
                    text-align: center;
                    min-width: 240px;
                }
                .bubble-btn:active {
                    transform: scale(0.96); /* Click push effect */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                /* Primary Bubble Button (Light Mode) */
                .btn-bubble-primary {
                    background-color: #3b82f6; /* blue-600 */
                    color: white;
                    border: none;
                    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.4);
                }
                .btn-bubble-primary:hover {
                    background-color: #2563eb; /* blue-700 */
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.4);
                }

                /* Secondary Bubble Button (Light Mode) */
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

                /* Primary Bubble Button (Dark Mode) */
                body.dark .btn-bubble-primary {
                    background-color: #3b82f6; /* blue-600 */
                    color: white;
                    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.2);
                }
                body.dark .btn-bubble-primary:hover {
                    background-color: #2563eb; /* blue-700 */
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.2);
                }

                /* Secondary Bubble Button (Dark Mode) */
                body.dark .btn-bubble-secondary {
                    background-color: #2c2c2c;
                    color: #3b82f6;
                    border: 2px solid #444;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 
                                inset 0 2px 2px rgba(255, 255, 255, 0.1);
                }
                body.dark .btn-bubble-secondary:hover {
                    border-color: #3b82f6;
                    background-color: #333;
                }
                
                /* Ripple Effect (from original code) */
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
                body.dark .ripple {
                    background: rgba(255, 255, 255, 0.3);
                }
                @keyframes rippleEffect {
                    to { transform: scale(4); opacity: 0; }
                }

                /* --- NEW: Copyright Bar Footer --- */
                footer.copyright-bar {
                    /* Inverted colors */
                    background-color: #1a1a1a; /* black */
                    color: #f8f7f3; /* off-white */
                    padding: 2rem 1rem;
                }
                body.dark footer.copyright-bar {
                    /* Inverted for dark mode */
                    background-color: #f8f7f3;
                    color: #1a1a1a;
                }
                
                footer.copyright-bar a {
                    color: #f8f7f3; /* Ensure links are light */
                }
                footer.copyright-bar a:hover {
                    text-decoration: underline;
                }
                
                body.dark footer.copyright-bar a {
                    color: #1a1a1a; /* Ensure links are dark */
                }
                body.dark footer.copyright-bar a:hover {
                    color: #000; /* Ensure links are readable on hover */
                }
            `}</style>
            
            {/* RESTORED: Particle background canvas */}
            <canvas ref={particleCanvasRef} id="particle-canvas"></canvas>

            {/* Dark Mode Toggle Button */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="dark-mode-toggle"
                aria-label="Toggle dark mode"
            >
                {darkMode ? '🌞' : '🌙'}
            </button>

            {/* Main content container */}
            <div className="relative min-h-screen">

                {/* 1. Header: Unicorn Studio Embed */}
                {/* Tailwind classes: w-full bg-white shadow-sm */}
                <header className="w-full bg-white shadow-sm h-[80vh] sm:h-[90vh]">
                    <Spline
                        scene="https://prod.spline.design/LN2XBlhmAdr4zjdC/scene.splinecode"
                    />
                </header>

                {/* 2. Product Carousel Section */}
                {/* Tailwind classes: py-16 sm:py-24 */}
                <section className="py-16 sm:py-24">
                    {/* Tailwind classes: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Tailwind classes: text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 */}
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">
                            Featured Artisan Crafts
                        </h2>
                        
                        <div className="scroller">
                            <div className="scroller-inner" style={{ "--card-count": 14 }}>
                                {/* Card Set 1 */}
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/EAB308/FFFFFF?text=Jute+Bag" alt="Jute Bag" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Handcrafted Jute Bag</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">12 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"So durable and stylish! I get compliments everywhere."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/34D399/FFFFFF?text=Bangles" alt="Bangles" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Glass Bangles Set</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">31 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"The colors are so vibrant and beautiful. They feel authentic."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/F87171/FFFFFF?text=Football" alt="Football" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Hand-Stitched Football</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">8 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"This is a proper, high-quality ball. My kids love it."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/60A5FA/FFFFFF?text=Pottery" alt="Pottery" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Clay Pottery Vase</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">22 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"Looks amazing on my mantle. You can feel the quality."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/A78BFA/FFFFFF?text=Shawl" alt="Shawl" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Embroidered Shawl</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">19 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"A perfect gift for my mother. The detail is incredible."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/F472B6/FFFFFF?text=Woodwork" alt="Woodwork" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Carved Wooden Box</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">4 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"Smells like real wood, high quality hinge."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/22C55E/FFFFFF?text=Fabric" alt="Fabric" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Printed Cotton Fabric</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">41 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"Used this to make curtains. The print is gorgeous."</p>
                                    </div>
                                </div>

                                {/* Card Set 2 (Duplicates) */}
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/EAB308/FFFFFF?text=Jute+Bag" alt="Jute Bag" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Handcrafted Jute Bag</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">12 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"So durable and stylish! I get compliments everywhere."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/34D399/FFFFFF?text=Bangles" alt="Bangles" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Glass Bangles Set</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">31 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"The colors are so vibrant and beautiful. They feel authentic."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/F87171/FFFFFF?text=Football" alt="Football" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Hand-Stitched Football</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">8 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"This is a proper, high-quality ball. My kids love it."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/60A5FA/FFFFFF?text=Pottery" alt="Pottery" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Clay Pottery Vase</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">22 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"Looks amazing on my mantle. You can feel the quality."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/A78BFA/FFFFFF?text=Shawl" alt="Shawl" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Embroidered Shawl</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">19 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"A perfect gift for my mother. The detail is incredible."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/F472B6/FFFFFF?text=Woodwork" alt="Woodwork" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Carved Wooden Box</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">4 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"Smells like real wood, high quality hinge."</p>
                                    </div>
                                </div>
                                <div className="product-card">
                                    <img src="https://placehold.co/400x300/22C55E/FFFFFF?text=Fabric" alt="Fabric" className="w-full h-48 object-cover rounded-t-lg" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-gray-800">Printed Cotton Fabric</h3>
                                        <div className="flex items-center my-2">
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.09 2.68 0.98-5.68-4.12-4.01 5.7-0.83 2.53-5.16 2.53 5.16 5.7 0.83-4.12 4.01 0.98 5.68z"></path></svg>
                                            <span className="ml-2 text-sm text-gray-500">41 Reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"Used this to make curtains. The print is gorgeous."</p>
                                    </div>
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
                                    setTimeout(() => navigate('/register'), 300); // Wait for ripple
                                }}
                                className="bubble-btn btn-bubble-primary"
                            >
                                Get Started (Sign Up)
                            </button>
                            <button
                                onClick={(e) => {
                                    createRipple(e);
                                    setTimeout(() => navigate('/login'), 300); // Wait for ripple
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
                            <a href="#" className="">About Us</a>
                            <a href="#" className="">Contact</a>
                            <a href="#" className="">FAQ</a>
                            <a href="#" className="">Artisan Portal</a>
                        </div>
                        <p className="text-sm opacity-70">&copy; 2024 VLoom. All rights reserved. Connecting artisans, one craft at a time.</p>
                    </div>
                </footer>

            </div>
        </>
    );
}