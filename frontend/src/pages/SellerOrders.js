import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Check, Truck, Search, X as RejectIcon, Archive as PackedIcon, AlertTriangle } from 'lucide-react';
import './SellerOrders.css';

// --- Main Seller Orders Page ---
function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
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
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
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
    
    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            (order.buyerId?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order._id.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [orders, searchQuery]);

    // --- NEW: Separate logic for orders with delivery issues ---
    const deliveryIssues = filteredOrders.filter(o => o.hasDeliveryIssue);
    const activeOrders = filteredOrders.filter(o => ['Pending', 'Confirmed', 'Packed'].includes(o.status) && !o.hasDeliveryIssue);
    const pastOrders = filteredOrders.filter(o => ['Shipped', 'Delivered', 'Rejected', 'Cancelled'].includes(o.status) && !o.hasDeliveryIssue);

    return (
        <div className="seller-orders-container">
            <div className="seller-orders-header">
                <Package size={32} />
                <h1>Orders Received</h1>
            </div>

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
                    {/* --- NEW: Delivery Issues Section --- */}
                    {deliveryIssues.length > 0 && (
                        <>
                            <h2 className="section-title issues-title"><AlertTriangle /> Delivery Issues</h2>
                            <div className="orders-list">
                                {deliveryIssues.map(order => (
                                    <div key={order._id} className="order-item-card issue-card">
                                        <div className="order-card-main-info">
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Buyer:</strong> {order.buyerId ? order.buyerId.name : 'N/A'}</p>
                                            <p><strong>Contact:</strong> {order.shippingAddress?.phone || 'N/A'}</p>
                                            <p className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <h2 className="section-title">Active Orders</h2>
                    {activeOrders.length > 0 ? (
                        <div className="orders-list">
                            {activeOrders.map(order => (
                                <div key={order._id} className="order-item-card">
                                    <div className="order-card-main-info">
                                         <p><strong>Order ID:</strong> {order._id}</p>
                                         <p><strong>Buyer:</strong> {order.buyerId ? order.buyerId.name : 'N/A'}</p>
                                         <p><strong>Total Items:</strong> {order.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
                                         <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                         <p className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</p>
                                    </div>
                                    <hr/>
                                    <div className="order-products-list">
                                        <h4>Products:</h4>
                                        {order.products.map(product => (
                                            <div key={product.productId} className="product-line-item">
                                                <img src={product.imageUrl} alt={product.name}/>
                                                <div className="product-info">
                                                    <span>{product.name}</span>
                                                    <span className="product-qty">Qty: {product.quantity}</span>
                                                </div>
                                                <strong>₹{(product.price * product.quantity).toFixed(2)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                    <hr/>
                                    {order.status === 'Pending' && (
                                        <div className="order-actions">
                                            <button className="reject-btn" onClick={() => handleUpdateStatus(order._id, 'Rejected')}><RejectIcon size={18} /> Reject</button>
                                            <button className="confirm-btn" onClick={() => handleUpdateStatus(order._id, 'Confirmed')}><Check size={18} /> Confirm Order</button>
                                        </div>
                                    )}
                                    {order.status === 'Confirmed' && (
                                        <div className="order-actions">
                                            <button className="packed-btn" onClick={() => handleUpdateStatus(order._id, 'Packed')}><PackedIcon size={18} /> Mark as Packed</button>
                                        </div>
                                    )}
                                    {order.status === 'Packed' && (
                                        <div className="order-actions">
                                            <button className="ship-btn" onClick={() => handleUpdateStatus(order._id, 'Shipped')}><Truck size={18} /> Mark as Shipped</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : <p className="no-orders-message-small">No active orders found.</p>}

                    <h2 className="section-title">Past Orders</h2>
                    {pastOrders.length > 0 ? (
                        <div className="orders-list">
                            {pastOrders.map(order => (
                                <div key={order._id} className="order-item-card past-order">
                                    <div className="order-card-main-info">
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Buyer:</strong> {order.buyerId ? order.buyerId.name : 'N/A'}</p>
                                        <p><strong>Total Items:</strong> {order.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
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
    );
}

export default SellerOrders;

