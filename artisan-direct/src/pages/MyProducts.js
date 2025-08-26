import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // Import the shared component

function MyProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyProducts = async () => {
            const savedData = localStorage.getItem("userData");
            if (!savedData) {
                navigate('/login');
                return;
            }
            const sellerId = JSON.parse(savedData)._id;

            try {
                const res = await fetch(`http://localhost:5000/api/products/by-seller/${sellerId}`);
                if (!res.ok) throw new Error("Could not fetch your products.");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyProducts();
    }, [navigate]);

    return (
        <>
            <div className="my-products-container">
                <div className="my-products-header">
                    <h1>Your Products</h1>
                    <Link to="/add-product" className="add-product-btn">
                        <PlusCircle size={20} />
                        <span>Add New Product</span>
                    </Link>
                </div>

                {isLoading && <p className="loading-message">Loading your products...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && !error && (
                    products.length > 0 ? (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    isSellerView={true} // Tell the card it's for the seller
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products-message">
                            <h2>You haven't added any products yet.</h2>
                            <p>Click the "Add New Product" button to get started!</p>
                        </div>
                    )
                )}
            </div>

            <style>{`
                .my-products-container { padding: 20px; background-color: #f0f4f8; font-family: sans-serif; min-height: 100vh; }
                .my-products-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .my-products-header h1 { color: #003366; margin: 0; }
                .add-product-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background-color: #FFA500; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                .no-products-message { text-align: center; padding: 50px; background: white; border-radius: 12px; }
                .loading-message, .error-message { text-align: center; font-size: 1.2rem; color: #555; padding: 40px; }
                .error-message { color: #d93025; }
            `}</style>
        </>
    );
}

export default MyProducts;
