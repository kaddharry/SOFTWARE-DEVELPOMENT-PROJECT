import React, { useState, useEffect } from 'react';
// FIXED: Removed 'Link' as it was not being used in this component.

// We'll reuse the same ProductCard component.
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img 
        src={product.image || "https://placehold.co/400x250/E7F3FF/003366?text=Product"} 
        alt={product.title} 
        className="product-image"
      />
      <div className="product-details">
        <h3 className="product-title">{product.title}</h3>
      </div>
      <hr className="product-divider" />
      <div className="product-footer">
        <span className="product-price">₹{product.price}</span>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
}

// Mock product data (we'll connect this to the backend later)
const mockProducts = [
    { id: 1, title: "Hand-Painted Ceramic Vase", price: 1200, image: "https://placehold.co/400x250/FFA500/FFFFFF?text=Vase" },
    { id: 2, title: "Woven Wall Hanging", price: 850, image: "https://placehold.co/400x250/007BFF/FFFFFF?text=Art" },
    { id: 3, title: "Carved Wooden Elephant", price: 1500, image: "https://placehold.co/400x250/28a745/FFFFFF?text=Decor" },
];

function ShopPreview() {
    const [seller, setSeller] = useState({
        shopName: "Loading...",
        sellerName: "Loading...",
        profilePic: "https://placehold.co/150x150/007BFF/FFFFFF?text=...",
        shopDescription: "Loading shop details..."
    });
    // FIXED: Removed 'setProducts' as it's not used yet. We only need to read the state for now.
    const [products] = useState(mockProducts);

    useEffect(() => {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSeller({
                shopName: parsedData.shopName || "Shop Name Not Set",
                sellerName: parsedData.name || "Seller Name Not Set",
                profilePic: parsedData.profilePicUrl || `https://placehold.co/150x150/007BFF/FFFFFF?text=${parsedData.name ? parsedData.name.charAt(0) : 'S'}`,
                shopDescription: `Welcome to ${parsedData.shopName || 'our shop'}! We specialize in unique, handcrafted goods.`
            });
        }
    }, []);

    return (
        <>
            <div className="shop-preview-container">
                {/* -- Shop Header Banner -- */}
                <div className="shop-header">
                    <img src={seller.profilePic} alt={`${seller.shopName} logo`} className="shop-logo" />
                    <div className="shop-info">
                        <h1>{seller.shopName}</h1>
                        <p className="seller-name">by {seller.sellerName}</p>
                        <p className="shop-description">{seller.shopDescription}</p>
                    </div>
                </div>

                {/* -- Products Grid -- */}
                <h2 className="products-section-title">All Products</h2>
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <style>{`
                .shop-preview-container {
                    padding: 20px;
                    background-color: #f0f4f8;
                    font-family: sans-serif;
                    min-height: 100vh;
                }
                .shop-header {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    padding: 30px;
                    margin-bottom: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .shop-logo {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 4px solid #007BFF;
                    margin-bottom: 20px;
                }
                .shop-info h1 {
                    color: #003366;
                    margin: 0 0 10px 0;
                }
                .seller-name {
                    color: #555;
                    font-style: italic;
                    margin: 0 0 15px 0;
                }
                .shop-description {
                    color: #333;
                    max-width: 600px;
                }
                .products-section-title {
                    color: #003366;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #ddd;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }

                /* Reusing Product Card Styles */
                .product-card {
                    margin: 10px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
                }
                .product-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .product-details {
                    padding: 15px;
                    flex-grow: 1;
                }
                .product-title {
                    margin: 0 0 5px;
                    font-size: 18px;
                    color: #333;
                }
                .product-divider {
                    border: 0;
                    border-top: 1px solid #f0f0f0;
                    margin: 0;
                }
                .product-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    font-size: 16px;
                }
                .product-price {
                    font-weight: bold;
                    color: #003366;
                }
                .add-to-cart-btn {
                    padding: 8px 16px;
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                }
                
                @media (min-width: 768px) {
                    .shop-header {
                        flex-direction: row;
                        text-align: left;
                    }
                    .shop-logo {
                        margin-bottom: 0;
                        margin-right: 30px;
                    }
                }
            `}</style>
        </>
    );
}

export default ShopPreview;
