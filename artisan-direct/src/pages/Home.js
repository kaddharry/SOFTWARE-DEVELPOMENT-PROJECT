import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShoppingCart, Zap, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// --- Skeleton Loader Component ---
const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-image shimmer"></div>
        <div className="skeleton-text-container">
            <div className="skeleton-text shimmer"></div>
            <div className="skeleton-text short shimmer"></div>
        </div>
    </div>
);

// --- Product Detail Modal Component ---
const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow }) => {
    if (!product) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={28} /></button>
                <div className="modal-image-container"><img src={product.imageUrl} alt={product.name} className="modal-image" /></div>
                <div className="modal-details">
                    <h2 className="modal-title">{product.name}</h2>
                    <p className="modal-seller">Sold by: <strong>{product.sellerId ? product.sellerId.shopName : 'Artisan Shop'}</strong></p>
                    <p className="modal-price">₹{product.price}</p>
                    <p className="modal-description">{product.description}</p>
                    <div className="modal-actions">
                        <button className="modal-btn add-cart-btn" onClick={() => onAddToCart(product)}><ShoppingCart size={20} /> Add to Cart</button>
                        <button className="modal-btn buy-now-btn" onClick={() => onBuyNow(product)}><Zap size={20} /> Buy Now</button>
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

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ProductDetailModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
            />
            <div className="home-container">
                <div className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input type="text" className="search-input" placeholder="Search for handmade treasures..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="card-container">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : (
                        filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                // **FIX**: Moved the key to the outermost element in the map.
                                <div 
                                    key={product._id}
                                    className="card-wrapper" 
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ProductCard 
                                        product={product} 
                                        onClick={setSelectedProduct} 
                                        onAddToCart={addToCart}
                                        onBuyNow={handleBuyNow}
                                        isSellerView={false}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="no-results">No products found.</p>
                        )
                    )}
                </div>
                <button className="cart-bubble" onClick={() => navigate("/cart")}><ShoppingCart size={20} /><span>Your Cart</span></button>
            </div>
            <style>{`
                .home-container { padding: 20px; background-color: #f0f4f8; font-family: sans-serif; min-height: 100vh; }
                .search-bar-wrapper { position: relative; margin: 0 auto 30px auto; max-width: 600px; }
                .search-input { width: 100%; padding: 15px 20px 15px 50px; border-radius: 30px; border: 1px solid #ddd; font-size: 1rem; outline: none; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: box-shadow 0.3s ease, border-color 0.3s ease; }
                .search-input:focus { box-shadow: 0 4px 20px rgba(0, 123, 255, 0.2); border-color: #007BFF; }
                .search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #aaa; z-index: 1; }
                .card-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                @media (min-width: 768px) { .card-container { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .card-wrapper { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
                @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
                .shimmer { background: linear-gradient(to right, #f0f4f8 8%, #e9ecef 18%, #f0f4f8 33%); background-size: 2000px 100%; animation: shimmer 1.5s infinite linear; }
                .skeleton-card { background: white; border-radius: 12px; overflow: hidden; }
                .skeleton-image { height: 180px; }
                .skeleton-text-container { padding: 15px; }
                .skeleton-text { height: 20px; border-radius: 4px; margin-bottom: 10px; }
                .skeleton-text.short { width: 60%; }
                .cart-bubble { position: fixed; bottom: 80px; right: 20px; background: #FFA500; color: white; border: none; border-radius: 50px; padding: 14px 22px; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); display: flex; align-items: center; gap: 8px; transition: transform 0.2s ease, background 0.3s ease; z-index: 1000; }
                .cart-bubble:hover { transform: scale(1.05); }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .modal-content { background: white; border-radius: 15px; width: 90%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; position: relative; animation: slideUp 0.3s ease-out; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-close-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.3); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; }
                .modal-image-container { width: 100%; height: 300px; background-color: #eee; }
                .modal-image { width: 100%; height: 100%; object-fit: cover; }
                .modal-details { padding: 25px; overflow-y: auto; }
                .modal-title { font-size: 2rem; color: #003366; margin: 0 0 10px; }
                .modal-seller { font-size: 1rem; color: #555; margin: 0 0 15px; }
                .modal-price { font-size: 1.8rem; font-weight: bold; color: #FFA500; margin: 0 0 20px; }
                .modal-description { font-size: 1rem; line-height: 1.6; color: #333; }
                .modal-actions { display: flex; gap: 15px; margin-top: 25px; }
                .modal-btn { flex-grow: 1; padding: 15px; border-radius: 10px; border: none; font-size: 1rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .add-cart-btn { background-color: #e7f3ff; color: #007BFF; }
                .buy-now-btn { background-color: #007BFF; color: white; }
                .loading-message, .error-message, .no-results { text-align: center; font-size: 1.2rem; color: #555; padding: 40px; }
                @media (min-width: 768px) { .modal-content { flex-direction: row; } .modal-image-container { width: 50%; height: auto; } .modal-details { width: 50%; } }
            `}</style>
        </>
    );
}

export default Home;
