import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

// This is our single, reusable Product Card component.
// It can show a customer view (with buttons) or a seller view (with stock).
function ProductCard({ product, onClick, onAddToCart, onBuyNow, isSellerView }) {
    const isOutOfStock = (product.sellerId && product.sellerId.isShopOpen === false) || product.quantity <= 0;

    const handleActionClick = (e, action) => {
        e.stopPropagation(); // Prevents the card's main onClick from firing
        if (!isOutOfStock && action) {
            action(product);
        }
    };

    return (
        <div className={`product-card-wrapper ${isOutOfStock ? 'out-of-stock' : ''}`} onClick={isOutOfStock ? null : () => onClick(product)}>
            {isOutOfStock && (
                <div className="out-of-stock-overlay">
                    <span>Out of Stock</span>
                </div>
            )}
            <div className="product-card">
                <div className="product-card-image-container">
                    <img src={product.imageUrl} alt={product.name} className="product-card-image" />
                </div>
                <div className="product-card-details">
                    <h3 className="product-card-name">{product.name}</h3>
                    <p className="product-card-seller">by {product.sellerId ? product.sellerId.shopName : 'Artisan'}</p>
                    <p className="product-card-price">₹{product.price}</p>
                    
                    {isSellerView ? (
                        <p className="product-card-stock">Stock: {product.quantity}</p>
                    ) : (
                        <div className="product-card-actions">
                            <button
                                className="product-card-btn add"
                                aria-label={`Add ${product.name} to cart`}
                                onClick={(e) => handleActionClick(e, onAddToCart)}
                                disabled={isOutOfStock}
                            >
                                <ShoppingCart size={18} />
                            </button>
                            <button
                                className="product-card-btn buy"
                                aria-label={`Buy ${product.name} now`}
                                onClick={(e) => handleActionClick(e, onBuyNow)}
                                disabled={isOutOfStock}
                            >
                                <Zap size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .product-card-wrapper {
                    border-radius: 18px;
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                    background: #ffffff;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                }
                .product-card-wrapper:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
                }
                .product-card {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    cursor: pointer;
                }
                .out-of-stock-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(255, 255, 255, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #c82333;
                    font-size: 1.4rem;
                    font-weight: 700;
                    border-radius: 18px;
                    z-index: 3;
                    backdrop-filter: blur(2px);
                    cursor: not-allowed;
                }
                .product-card-image-container {
                    width: 100%;
                    padding-top: 100%; /* Creates a square aspect ratio */
                    position: relative;
                    background-color: #f8f9fa;
                }
                .product-card-image {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* This crops the image to fill the container */
                    transition: transform 0.4s ease;
                }
                .product-card-wrapper:not(.out-of-stock):hover .product-card-image {
                    transform: scale(1.05);
                }
                .product-card-details {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                .product-card-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #212529;
                    margin: 0 0 4px;
                    flex-grow: 1; /* Pushes price/buttons to the bottom */
                }
                .product-card-seller {
                    font-size: 0.9rem;
                    color: #666;
                    margin: 0 0 4px;
                }
                .product-card-price {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #0056b3;
                    margin: 0 0 8px;
                }
                .product-card-stock {
                    font-size: 1rem;
                    color: #555;
                    font-weight: 500;
                    margin: 0;
                }
                .product-card-actions {
                    display: flex;
                    gap: 10px;
                }
                .product-card-btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .product-card-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .product-card-btn:disabled {
                    background: #e9ecef;
                    cursor: not-allowed;
                    color: #6c757d;
                }
                .product-card-btn.add { background: linear-gradient(45deg, #0D6EFD, #3da9fc); }
                .product-card-btn.buy { background: linear-gradient(45deg, #FF9900, #FD7E14); }

                /* Mobile-specific styles */
                @media (max-width: 768px) {
                    .product-card-wrapper {
                        height: 220px;
                    }
                    .product-card-image-container {
                        height: 70%;
                        padding-top: 0;
                    }
                    .product-card-details {
                        height: 30%;
                        padding: 6px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    .product-card-name {
                        font-size: 0.9rem;
                        margin: 0;
                    }
                    .product-card-seller {
                        font-size: 0.8rem;
                        margin: 0;
                    }
                    .product-card-price {
                        font-size: 1rem;
                        margin: 0;
                    }
                    .product-card-actions {
                        display: flex;
                        gap: 4px;
                        margin-top: 4px;
                    }
                    .product-card-btn {
                        flex: 1;
                        padding: 6px;
                        font-size: 0.8rem;
                    }
                }

            `}</style>
        </div>
    );
}

export default ProductCard;
