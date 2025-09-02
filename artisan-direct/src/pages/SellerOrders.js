import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Check, Truck, Search } from 'lucide-react';

// --- Main Seller Orders Page ---
function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // **NEW**: State for the search bar
    const navigate = useNavigate();

    const fetchSellerOrders = useCallback(async () => {
        const savedData = localStorage.getItem("userData");
        if (!savedData) {
            navigate('/login');
            return;
        }
        const sellerId = JSON.parse(savedData)._id;
        try {
            setIsLoading(true);
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/by-seller/${sellerId}`);
            if (!res.ok) throw new Error("Could not fetch your orders.");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchSellerOrders();
    }, [fetchSellerOrders]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/update-status/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status.");
            fetchSellerOrders(); 
        } catch (err) {
            alert(err.message);
        }
    };

    // **NEW**: This logic filters and splits orders into sections
    const filteredOrders = useMemo(() => {
        return orders.filter(order => 
            (order.buyerId?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order._id.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [orders, searchQuery]);

    const activeOrders = filteredOrders.filter(o => o.status === 'Pending' || o.status === 'Confirmed');
    const pastOrders = filteredOrders.filter(o => o.status === 'Shipped' || o.status === 'Delivered');

    return (
        <>
            <div className="seller-orders-container">
                <div className="seller-orders-header">
                    <Package size={32} />
                    <h1>Orders Received</h1>
                </div>

                {/* **NEW**: Search Bar */}
                <div className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by buyer name or order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading && <p className="loading-message">Loading incoming orders...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && !error && orders.length === 0 && (
                    <div className="no-orders-message">
                        <h2>No orders yet!</h2>
                        <p>When a customer places an order for one of your products, it will appear here.</p>
                    </div>
                )}
                
                {!isLoading && !error && (
                    <>
                        {/* **NEW**: Active Orders Section */}
                        <h2 className="section-title">Active Orders</h2>
                        {activeOrders.length > 0 ? (
                            <div className="orders-list">
                                {activeOrders.map(order => (
                                    <div key={order._id} className="order-item-card">
                                        <div className="order-card-main-info">
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Buyer:</strong> {order.buyerId ? order.buyerId.name : 'N/A'}</p>
                                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</p>
                                        </div>
                                        <hr/>
                                        <div className="order-products-list">
                                            <h4>Products:</h4>
                                            {order.products.map(product => (
                                                <div key={product.productId} className="product-line-item">
                                                    <img src={product.imageUrl} alt={product.name}/>
                                                    <span>{product.name}</span>
                                                    <strong>₹{product.price}</strong>
                                                </div>
                                            ))}
                                        </div>
                                        <hr/>
                                        {order.status === 'Pending' && (
                                            <div className="order-actions">
                                                <button className="confirm-btn" onClick={() => handleUpdateStatus(order._id, 'Confirmed')}><Check size={18} /> Confirm Order</button>
                                            </div>
                                        )}
                                        {order.status === 'Confirmed' && (
                                            <div className="order-actions">
                                                <button className="ship-btn" onClick={() => handleUpdateStatus(order._id, 'Shipped')}><Truck size={18} /> Mark as Shipped</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : <p className="no-orders-message-small">No active orders found.</p>}

                        {/* **NEW**: Past Orders Section */}
                        <h2 className="section-title">Past Orders</h2>
                        {pastOrders.length > 0 ? (
                            <div className="orders-list">
                                {pastOrders.map(order => (
                                    <div key={order._id} className="order-item-card past-order">
                                        {/* Same card structure, just styled differently */}
                                        <div className="order-card-main-info">
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Buyer:</strong> {order.buyerId ? order.buyerId.name : 'N/A'}</p>
                                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="no-orders-message-small">No past orders found.</p>}
                    </>
                )}
            </div>
            <style>{`
                .seller-orders-container { padding: 20px; background-color: #f0f4f8; font-family: sans-serif; min-height: 100vh; }
                .seller-orders-header { display: flex; align-items: center; gap: 15px; color: #003366; margin-bottom: 20px; }
                .loading-message, .error-message { text-align: center; font-size: 1.2rem; color: #555; padding: 40px; }
                .error-message { color: #d93025; }
                .no-orders-message { text-align: center; padding: 50px; background: white; border-radius: 12px; }
                .no-orders-message-small { text-align: center; padding: 20px; color: #777; }
                
                .search-bar-wrapper { position: relative; margin-bottom: 30px; }
                .search-input { width: 100%; padding: 12px 15px 12px 40px; border-radius: 8px; border: 1px solid #ddd; font-size: 1rem; }
                .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #aaa; }
                
                .section-title { color: #003366; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                .orders-list { display: flex; flex-direction: column; gap: 20px; }
                .order-item-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
                .past-order { opacity: 0.7; }
                .order-card-main-info p { margin: 0 0 8px; }
                .order-status { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: white; }
                .status-shipped { background-color: #FFA500; }
                .status-delivered { background-color: #28a745; }
                .status-pending { background-color: #6c757d; }
                .status-confirmed { background-color: #007BFF; }
                .order-item-card hr { border: 0; border-top: 1px solid #f0f0f0; margin: 15px 0; }
                .product-line-item { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
                .product-line-item img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
                .product-line-item strong { margin-left: auto; }
                .order-actions { display: flex; justify-content: flex-end; gap: 10px; }
                .order-actions button { display: flex; align-items: center; gap: 8px; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
                .confirm-btn { background-color: #28a745; color: white; }
                .ship-btn { background-color: #007BFF; color: white; }
            `}</style>
        </>
    );
}

export default SellerOrders;

