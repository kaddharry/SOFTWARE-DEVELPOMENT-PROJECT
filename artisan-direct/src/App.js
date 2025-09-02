import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import SellerOrders from './pages/SellerOrders';
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
import ShopPreview from "./pages/ShopPreview";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import HelpPage from "./pages/HelpPage";
import AddProduct from "./pages/AddProduct";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Checkout from "./pages/Checkout"; // Import the Checkout component

// --- Notification Component ---
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

  const [verified, setVerified] = useState(() => {
    return localStorage.getItem("verified") === "true";
  });

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });

  // --- Effects ---
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ visible: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --- Event Handlers & Functions ---
  const addToCart = (productToAdd) => {
    if (!cartItems.find((item) => item._id === productToAdd._id)) {
      setCartItems((prevItems) => [...prevItems, productToAdd]);
      setNotification({
        visible: true,
        message: `${productToAdd.name} added to cart!`,
      });
    } else {
      setNotification({
        visible: true,
        message: "Item is already in your cart.",
      });
    }
  };

  const handleUpdateCart = (newCart) => {
    setCartItems(newCart);
  };

  // **NEW**: This function clears items from the main cart after a successful order.
  const handleOrderSuccess = (orderedItems) => {
    const remainingItems = cartItems.filter(
      (cartItem) =>
        !orderedItems.find((orderedItem) => orderedItem._id === cartItem._id)
    );
    setCartItems(remainingItems);
  };

  const handleRegistrationNext = (data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
    navigate("/otp");
  };

  const handleOTPVerified = () => {
    navigate("/set-password");
  };

  const handlePasswordSet = async (finalData) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save user");

      setUserData(data.user);
      setVerified(true);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("verified", "true");
      navigate("/registration-success");
      return null;
    } catch (err) {
      console.error("❌ Registration error:", err);
      return err.message;
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setVerified(false);
    localStorage.removeItem("userData");
    localStorage.removeItem("verified");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  const noNavPaths = [
    "/",
    "/register",
    "/otp",
    "/login",
    "/set-password",
    "/registration-success",
  ];
  const hideNav = noNavPaths.includes(location.pathname);

  return (
    <>
      <Notification
        message={notification.message}
        visible={notification.visible}
      />

      <div className="App">
        {verified && !hideNav && (
          <TopBar name={userData?.name || "SELLER"} onLogout={handleLogout} />
        )}

        <div
          style={{
            paddingBottom: verified && !hideNav ? "60px" : "0",
            paddingTop: verified && !hideNav ? "50px" : "0",
          }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/register"
              element={<RegisterForm onNext={handleRegistrationNext} />}
            />
            <Route
              path="/otp"
              element={
                <OTPForm userData={userData} onVerify={handleOTPVerified} />
              }
            />
            <Route
              path="/set-password"
              element={
                <SetPassword
                  userData={userData}
                  onComplete={handlePasswordSet}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  onLoginSuccess={(user) => {
                    setUserData(user);
                    setVerified(true);
                    localStorage.setItem("userData", JSON.stringify(user));
                    localStorage.setItem("verified", "true");
                    navigate("/home");
                  }}
                />
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            {verified ? (
              <>
                <Route path="/home" element={<Home addToCart={addToCart} />} />
                <Route
                  path="/registration-success"
                  element={<RegistrationSuccess />}
                />
                <Route path="/seller-orders" element={<SellerOrders />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/shop-preview" element={<ShopPreview />} />
                <Route path="/my-products" element={<MyProducts />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route
                  path="/cart"
                  element={
                    <Cart
                      cartItems={cartItems}
                      onUpdateCart={handleUpdateCart}
                    />
                  }
                />
                {/* **FIXED**: Added the Checkout route and passed the necessary function */}
                <Route
                  path="/checkout"
                  element={<Checkout onOrderSuccess={handleOrderSuccess} />}
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>

        {verified && !hideNav && <BottomNav />}
      </div>

      <style>{`
        @keyframes slideInUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .notification {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translate(-50%, 100%);
          background-color: #333;
          color: white;
          padding: 12px 25px;
          border-radius: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 9999;
          opacity: 0;
          transition: transform 0.4s ease-out, opacity 0.4s ease-out;
        }
        .notification.show {
          animation: slideInUp 0.4s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </>
  );
}

export default App;
