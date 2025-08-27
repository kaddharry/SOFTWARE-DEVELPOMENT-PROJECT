import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Cart from "./components/Cart";
import RegisterForm from "./components/RegisterForm";
import OTPForm from "./components/OTPForm";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import SetPassword from "./components/SetPassword";
import MyProducts from "./pages/MyProducts";
import ShopPreview from './pages/ShopPreview';
import EditProfile from './pages/EditProfile';
import ResetPassword from './pages/ResetPassword';
import HelpPage from './pages/HelpPage';
import AddProduct from './pages/AddProduct';
import RegistrationSuccess from './pages/RegistrationSuccess';
import Checkout from './pages/Checkout';

const Notification = ({ message, visible }) => {
  if (!visible) return null;
  return <div className="notification show">{message}</div>;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- State Management ---
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  // The 'verified' status is now a derived constant, not a separate state.
  // If userData exists, the user is verified. This is cleaner and prevents bugs.
  const isVerified = !!userData; 

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [notification, setNotification] = useState({ visible: false, message: '' });

  // --- Effects ---
  useEffect(() => {
    // This single effect now handles saving or removing user data from storage.
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => setNotification({ visible: false, message: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  // --- Event Handlers & Functions ---
  const addToCart = (productToAdd) => {
    if (!cartItems.find(item => item._id === productToAdd._id)) {
        setCartItems(prevItems => [...prevItems, productToAdd]);
        setNotification({ visible: true, message: `${productToAdd.name} added to cart!` });
    } else {
        setNotification({ visible: true, message: 'Item is already in your cart.' });
    }
  };

  const handleUpdateCart = (newCart) => setCartItems(newCart);
  
  const handleOrderSuccess = (orderedItems) => {
    const remainingItems = cartItems.filter(cartItem => 
        !orderedItems.find(orderedItem => orderedItem._id === cartItem._id)
    );
    setCartItems(remainingItems);
  };

  const handleRegistrationNext = (data) => setUserData(data);
  const handleOTPVerified = () => navigate("/set-password");

  const handlePasswordSet = async (finalData) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Simplified: Only need to set userData. The useEffect will handle storage.
      setUserData(data.user);
      navigate("/registration-success"); 
      return null;
    } catch (err) {
      return err.message;
    }
  };

  const handleLogout = () => {
    // Simplified: Logging out is now as simple as clearing the user data.
    setUserData(null);
    setCartItems([]); // Also clear the cart
    localStorage.clear(); // Clear all storage for a clean logout
    navigate("/");
  };

  const noNavPaths = ["/", "/register", "/otp", "/login", "/set-password", "/registration-success", "/checkout"];
  const hideNav = noNavPaths.includes(location.pathname);

  return (
    <>
      <Notification message={notification.message} visible={notification.visible} />
      <div className="App">
        {isVerified && !hideNav && <TopBar name={userData?.name} onLogout={handleLogout} />}
        <div style={{ paddingTop: isVerified && !hideNav ? "60px" : "0", paddingBottom: isVerified && !hideNav ? "70px" : "0" }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterForm onNext={handleRegistrationNext} />} />
            <Route path="/otp" element={<OTPForm userData={userData} onVerify={handleOTPVerified} />} />
            <Route path="/set-password" element={<SetPassword userData={userData} onComplete={handlePasswordSet} />} />
            <Route path="/login" element={<Login onLoginSuccess={(user) => { setUserData(user); navigate('/home'); }} />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Routing logic now uses the derived 'isVerified' variable. */}
            {isVerified ? (
              <>
                <Route path="/home" element={<Home addToCart={addToCart} />} />
                <Route path="/registration-success" element={<RegistrationSuccess />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/edit-profile" element={<EditProfile />} /> 
                <Route path="/shop-preview" element={<ShopPreview />} />
                <Route path="/my-products" element={<MyProducts />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateCart={handleUpdateCart} />} />
                <Route path="/checkout" element={<Checkout onOrderSuccess={handleOrderSuccess} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>
        {isVerified && !hideNav && <BottomNav />}
      </div>
      <style>{`
        @keyframes slideInUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .notification { position: fixed; bottom: 80px; left: 50%; transform: translate(-50%, 100%); background-color: #333; color: white; padding: 12px 25px; border-radius: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 9999; opacity: 0; transition: all 0.4s ease-out; }
        .notification.show { animation: slideInUp 0.4s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94); }
      `}</style>
    </>
  );
}

export default App;
