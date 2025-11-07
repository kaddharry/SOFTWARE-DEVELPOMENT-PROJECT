import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

// This is a new, reusable component for selecting item quantity.
function QuantityModal({ product, action, onClose, onConfirm }) {
    const [quantity, setQuantity] = useState(1);

    // Reset quantity to 1 whenever a new product is selected
    useEffect(() => {
        setQuantity(1);
    }, [product]);

    if (!product) return null;

    const handleIncrement = () => {
        // Use the product's available stock as a limit, or default to 10
        const maxQuantity = product.quantity > 0 ? product.quantity : 10;
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleConfirmClick = () => {
        onConfirm(product, quantity);
    };

    const actionText = action === 'buy' ? 'Buy Now' : 'Add to Cart';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="quantity-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                
                <div className="quantity-modal-header">
                    <img src={product.imageUrl} alt={product.name} className="quantity-modal-image" />
                    <div className="quantity-modal-product-info">
                        <h3 className="quantity-modal-title">{product.name}</h3>
                        <p className="quantity-modal-price">₹{product.price}</p>
                    </div>
                </div>

                <div className="quantity-selector-container">
                    <p className="quantity-label">Select Quantity:</p>
                    <div className="quantity-controls">
                        <button className="quantity-btn" onClick={handleDecrement} aria-label="Decrease quantity">
                            <Minus size={20} />
                        </button>
                        <span className="quantity-display">{quantity}</span>
                        <button className="quantity-btn" onClick={handleIncrement} aria-label="Increase quantity">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                <button className="quantity-confirm-btn" onClick={handleConfirmClick}>
                    {actionText} ({`₹${(product.price * quantity).toFixed(2)}`})
                </button>
            </div>
        </div>
    );
}

export default QuantityModal;
