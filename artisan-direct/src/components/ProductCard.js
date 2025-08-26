import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

function ProductCard({ product, onClick, onAddToCart, onBuyNow, isSellerView }) {
    const isOutOfStock = (!product.sellerId?.isShopOpen || product.quantity <= 0) && !isSellerView;

    const handleActionClick = (e, action) => {
        e.stopPropagation(); // Prevents the modal from opening when a button is clicked
        if (action) {
            action(product);
        }
    };

    return (
        <div 
            className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`} 
            onClick={() => !isOutOfStock && onClick && onClick(product)}
        >
            {isOutOfStock && <div className="stock-overlay">Out of Stock</div>}

            <div className="card-image-container">
                <img 
                    src={product.imageUrl || "https://placehold.co/400x250/E7F3FF/003366?text=Product"} 
                    alt={product.name} 
                    className="product-image"
                />
            </div>
            <div className="card-details">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-seller">by {product.sellerId?.shopName || 'Artisan Shop'}</p>
                <p className="product-price">₹{product.price}</p>
            </div>

            {/* Customer View: Show action buttons */}
            {!isSellerView && (
                <div className="card-actions">
                    <button className="action-btn add-cart-btn" disabled={isOutOfStock} onClick={(e) => handleActionClick(e, onAddToCart)}>
                        <ShoppingCart size={18} />
                    </button>
                    <button className="action-btn buy-now-btn" disabled={isOutOfStock} onClick={(e) => handleActionClick(e, onBuyNow)}>
                        <Zap size={18} /> Buy Now
                    </button>
                </div>
            )}

            {/* Seller View: Show stock quantity */}
            {isSellerView && (
                <div className="card-footer-seller">
                    <span>Stock: {product.quantity}</span>
                </div>
            )}
            <style>{`
                .product-card {
                    background-color: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    position: relative;
                }
                .product-card:not(.out-of-stock):hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
                    cursor: pointer;
                }
                .card-image-container {
                    width: 100%;
                    padding-top: 75%; /* 4:3 aspect ratio */
                    position: relative;
                    background-color: #f0f4f8;
                }
                .product-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .card-details {
                    padding: 15px;
                }
                .product-title {
                    margin: 0 0 5px;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #333;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .product-seller {
                    font-size: 0.8rem;
                    color: #777;
                    margin: 0 0 10px;
                }
                .product-price {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #003366;
                }
                .card-actions {
                    display: flex;
                    gap: 10px;
                    padding: 0 15px 15px;
                }
                .action-btn {
                    flex-grow: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: none;
                    font-size: 0.9rem;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background-color 0.2s ease;
                }
                .action-btn:disabled {
                    background-color: #e9ecef !important;
                    color: #adb5bd !important;
                    cursor: not-allowed;
                }
                .add-cart-btn {
                    background-color: #e7f3ff;
                    color: #007BFF;
                }
                .buy-now-btn {
                    background-color: #007BFF;
                    color: white;
                }
                .card-footer-seller {
                    padding: 15px;
                    background-color: #f8f9fa;
                    text-align: center;
                    font-weight: 500;
                    color: #555;
                }
                .product-card.out-of-stock {
                    filter: grayscale(80%);
                }
                .stock-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #333;
                    z-index: 10;
                }
            `}</style>
        </div>
    );
}

export default ProductCard;
