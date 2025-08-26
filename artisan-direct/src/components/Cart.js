import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Heart } from 'lucide-react';

// --- Main Cart Component ---
function Cart({ cartItems: initialCartItems, onUpdateCart }) {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCart(initialCartItems);
    }, [initialCartItems]);

    const handleRemoveFromCart = (productToRemove) => {
        const updatedCart = cart.filter(item => item._id !== productToRemove._id);
        setCart(updatedCart);
        onUpdateCart(updatedCart);
    };

    const handleMoveToWishlist = (productToMove) => {
        const updatedCart = cart.filter(item => item._id !== productToMove._id);
        setCart(updatedCart);
        onUpdateCart(updatedCart);
        if (!wishlist.find(item => item._id === productToMove._id)) {
            setWishlist(prev => [...prev, productToMove]);
        }
    };

    const handleMoveToCart = (productToMove) => {
        const updatedWishlist = wishlist.filter(item => item._id !== productToMove._id);
        setWishlist(updatedWishlist);
        const updatedCart = [...cart, productToMove];
        setCart(updatedCart);
        onUpdateCart(updatedCart);
    };
    
    const handleBuyCart = () => {
        navigate('/checkout', { state: { items: cart } });
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <>
            <div className="cart-page-container">
                <div className="cart-summary card">
                    <div className="total-section">
                        <h2>Your Cart</h2>
                        <p className="total-price">Total: ₹{total}</p>
                    </div>
                    <button className="checkout-btn" disabled={cart.length === 0} onClick={handleBuyCart}>
                        Proceed to Checkout
                    </button>
                </div>

                {cart.length === 0 && wishlist.length === 0 && (
                    <p className="empty-cart-message">🛒 Your cart is empty.</p>
                )}

                {cart.length > 0 && (
                    <div className="cart-grid">
                        {cart.map((item) => (
                            <div key={item._id} className="cart-item-card">
                                <img src={item.imageUrl} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>₹{item.price}</p>
                                </div>
                                <div className="item-actions">
                                    <button className="action-btn remove-btn" onClick={() => handleRemoveFromCart(item)}><Trash2 size={18} /></button>
                                    <button className="action-btn wishlist-btn" onClick={() => handleMoveToWishlist(item)}><Heart size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {wishlist.length > 0 && (
                    <div className="wishlist-section">
                        <h2>Saved for Later</h2>
                        <div className="cart-grid">
                            {wishlist.map((item) => (
                                <div key={item._id} className="cart-item-card">
                                    <img src={item.imageUrl} alt={item.name} className="item-image" />
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p>₹{item.price}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="action-btn add-back-btn" onClick={() => handleMoveToCart(item)}>Move to Cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .cart-page-container { padding: 20px; background-color: #f0f4f8; font-family: sans-serif; min-height: 100vh; }
                .card { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); padding: 20px; margin-bottom: 20px; }
                .cart-summary { display: flex; justify-content: space-between; align-items: center; }
                .total-section h2 { margin: 0 0 5px 0; color: #003366; }
                .total-price { margin: 0; font-size: 1.5rem; font-weight: bold; color: #333; }
                .checkout-btn { padding: 12px 25px; border: none; border-radius: 8px; background-color: #28a745; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; }
                .checkout-btn:disabled { background-color: #ccc; cursor: not-allowed; }
                .empty-cart-message { text-align: center; font-size: 1.2rem; color: #555; padding: 50px; }
                .cart-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
                .cart-item-card { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; }
                .item-image { width: 100%; height: 180px; object-fit: cover; }
                .item-details { padding: 15px; flex-grow: 1; }
                .item-details h3 { margin: 0 0 8px 0; font-size: 1rem; }
                .item-details p { margin: 0; font-size: 1.1rem; font-weight: bold; color: #003366; }
                .item-actions { display: flex; border-top: 1px solid #f0f0f0; }
                .action-btn { flex-grow: 1; background: none; border: none; padding: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500; transition: background-color 0.2s ease; }
                .action-btn:first-child { border-right: 1px solid #f0f0f0; }
                .remove-btn { color: #dc3545; }
                .wishlist-btn { color: #007BFF; }
                .add-back-btn { color: #28a745; font-weight: bold; }
                .action-btn:hover { background-color: #f8f9fa; }
                .wishlist-section { margin-top: 40px; }
                .wishlist-section h2 { color: #003366; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
            `}</style>
        </>
    );
}

export default Cart;
