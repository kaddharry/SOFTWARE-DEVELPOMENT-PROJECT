import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Gift, X, Zap } from 'lucide-react';

// Import our reusable ProductCard component from its own file
import ProductCard from '../components/ProductCard'; 
import GiftAdvisorModal from '../components/GiftAdvisorModal';

// Import the new, dedicated stylesheet for this page
import './Home.css';

// --- Components defined within Home.js as requested ---

// Skeleton Loader Component
const SkeletonCard = () => (
    <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-text-container">
            <div className="skeleton-text shimmer"></div>
            <div className="skeleton-text short shimmer"></div>
        </div>
    </div>
);

// Product Detail Modal Component (with improved image handling)
const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow }) => {
    if (!product) return null;
    const isOutOfStock = (product.sellerId && product.sellerId.isShopOpen === false) || product.quantity <= 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={28} /></button>
                
                <div className="modal-image-container">
                    {/* This div creates the blurred background effect */}
                    <div className="modal-image-bg" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                    {/* The actual image, which will not be cropped */}
                    <img src={product.imageUrl} alt={product.name} className="modal-image" />
                </div>

                <div className="modal-details">
                    <h2 className="modal-title">{product.name}</h2>
                    <p className="modal-seller">Sold by: <strong>{product.sellerId ? product.sellerId.shopName : 'Artisan Shop'}</strong></p>
                    <p className="modal-price">₹{product.price}</p>
                    {isOutOfStock && <p className="modal-out-of-stock">This item is currently unavailable.</p>}
                    <p className="modal-description">{product.description}</p>
                    <div className="modal-actions">
                        <button className="modal-btn add-cart-btn" onClick={() => onAddToCart(product)} disabled={isOutOfStock}>
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button className="modal-btn buy-now-btn" onClick={() => onBuyNow(product)} disabled={isOutOfStock}>
                            <Zap size={20} /> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Home Component ---
function Home({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isGiftAdvisorOpen, setIsGiftAdvisorOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/all`);
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBuyNow = (product) => {
        navigate('/checkout', { state: { items: [product] } });
    };

    const handleAdvisorProductSelect = (product) => {
        setIsGiftAdvisorOpen(false);
        setSelectedProduct(product);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {isGiftAdvisorOpen && (
                <GiftAdvisorModal 
                    products={products}
                    onClose={() => setIsGiftAdvisorOpen(false)}
                    onProductSelect={handleAdvisorProductSelect}
                />
            )}
            <ProductDetailModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
            />

            <div className="home-container">
                <div className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search for handmade treasures..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="card-container">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : (
                        filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard 
                                    key={product._id}
                                    product={product} 
                                    onClick={() => setSelectedProduct(product)} 
                                    onAddToCart={addToCart}
                                    onBuyNow={handleBuyNow}
                                    isSellerView={false}
                                />
                            ))
                        ) : (
                            <p className="no-results">No products found.</p>
                        )
                    )}
                </div>

                <button className="ai-gift-bubble" onClick={() => setIsGiftAdvisorOpen(true)}>
                    <Gift size={24} />
                    <span>Gift Advisor</span>
                </button>
                <button className="cart-bubble" onClick={() => navigate("/cart")}>
                    <ShoppingCart size={20} />
                    <span>Your Cart</span>
                </button>
            </div>
        </>
    );
}

export default Home;

