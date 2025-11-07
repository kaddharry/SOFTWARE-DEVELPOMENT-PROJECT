import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Heart, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import './Cart.css'; // We will use the dedicated CSS file

// --- Main Cart Component ---
function Cart({ cartItems, onUpdateCart }) {
    // Wishlist state is managed locally within the cart
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const navigate = useNavigate();

    // Effect to save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // --- Cart Management Functions ---

    const handleQuantityChange = (productId, newQuantity) => {
        let updatedCart;
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            updatedCart = cartItems.filter(item => item._id !== productId);
        } else {
            // Otherwise, update the quantity of the specific item
            updatedCart = cartItems.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            );
        }
        onUpdateCart(updatedCart);
    };

    const handleMoveToWishlist = (productToMove) => {
        // 1. Remove from cart
        const updatedCart = cartItems.filter(item => item._id !== productToMove._id);
        onUpdateCart(updatedCart);

        // 2. Add to wishlist (if it's not already there)
        if (!wishlist.find(item => item._id === productToMove._id)) {
            setWishlist(prev => [...prev, productToMove]);
        }
    };

    const handleClearCart = () => {
        onUpdateCart([]);
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout', { state: { items: cartItems } });
    };

    // --- Wishlist Management Functions ---

    const handleMoveToCart = (productToMove) => {
        // 1. Remove from wishlist
        const updatedWishlist = wishlist.filter(item => item._id !== productToMove._id);
        setWishlist(updatedWishlist);

        // 2. Add back to cart (using the main App function to handle quantity correctly)
        // This simulates adding from the home page, starting with quantity 1
        const existingCartItem = cartItems.find(item => item._id === productToMove._id);
        if (existingCartItem) {
            handleQuantityChange(productToMove._id, existingCartItem.quantity + 1);
        } else {
            onUpdateCart([...cartItems, { ...productToMove, quantity: 1 }]);
        }
    };

    const handleRemoveFromWishlist = (productToRemove) => {
        setWishlist(wishlist.filter(item => item._id !== productToRemove._id));
    };


    // --- Calculations ---
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="cart-page-container">
            {/* --- Cart Header --- */}
            <div className="cart-header">
                <div className="cart-total-info">
                    <h1>Your Cart ({totalItems} Items)</h1>
                    <p className="total-amount">₹{cartTotal.toFixed(2)}</p>
                </div>
                <div className="cart-header-actions">
                    {cartItems.length > 0 && (
                        <button className="clear-cart-btn" onClick={handleClearCart}>
                            <Trash2 size={16} /> Clear All
                        </button>
                    )}
                    <button className="proceed-checkout-btn" disabled={cartItems.length === 0} onClick={handleProceedToCheckout}>
                        Proceed to Checkout <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="cart-main">
                {cartItems.length > 0 ? (
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item-card">
                                <div className="item-image-container">
                                    <img src={item.imageUrl} alt={item.name} className="item-image"/>
                                </div>
                                <div className="item-details-container">
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-seller">Sold by: {item.sellerId ? item.sellerId.shopName : 'Artisan Direct'}</p>
                                </div>
                                <div className="item-quantity-controls">
                                    <button className="quantity-btn" onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>
                                        <Minus size={16} />
                                    </button>
                                    <span className="quantity-display">{item.quantity}</span>
                                    <button className="quantity-btn" onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="item-price-divider"></div>
                                <p className="item-total-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <div className="item-card-actions">
                                    <button className="item-action-btn" onClick={() => handleMoveToWishlist(item)} title="Move to Wishlist">
                                        <Heart size={18} />
                                    </button>
                                    <button className="item-action-btn" onClick={() => handleQuantityChange(item._id, 0)} title="Remove from Cart">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-cart-message">
                        <ShoppingCart size={60} />
                        <h2>Your cart is currently empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                    </div>
                )}
            </div>
            
            {/* --- Wishlist Section --- */}
            {wishlist.length > 0 && (
                <div className="wishlist-section">
                    <div className="section-divider"></div>
                    <h2 className="wishlist-header">Saved for Later</h2>
                    <div className="wishlist-grid">
                        {wishlist.map(item => (
                            <div key={item._id} className="wishlist-item-card">
                                <img src={item.imageUrl} alt={item.name} className="wishlist-item-image"/>
                                <div className="wishlist-item-details">
                                    <h4 className="wishlist-item-name">{item.name}</h4>
                                    <p className="wishlist-item-price">₹{item.price}</p>
                                </div>
                                <div className="wishlist-item-actions">
                                    <button className="wishlist-action-btn" onClick={() => handleMoveToCart(item)}>Move to Cart</button>
                                    <button className="wishlist-action-btn remove" onClick={() => handleRemoveFromWishlist(item)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
