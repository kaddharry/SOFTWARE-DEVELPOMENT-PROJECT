import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';

// --- Order Detail Modal (Receipt) ---
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={28} /></button>
                <div className="receipt-header">
                    <h3>Order Receipt</h3>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="receipt-section">
                    <h4>Items Purchased</h4>
                    {order.products.map((p, i) => (
                        <div key={i} className="receipt-item">
                            <img src={p.imageUrl} alt={p.name} />
                            <span>{p.name}</span>
                            <strong>₹{p.price}</strong>
                        </div>
                    ))}
                </div>
                <div className="receipt-section">
                    <h4>Shipping To</h4>
                    <p>{order.shippingAddress.name}<br/>{order.shippingAddress.address}<br/>{order.shippingAddress.phone}</p>
                </div>
                <div className="receipt-section">
                    <h4>Payment Summary</h4>
                    <div className="bill-details">
                        <span>Subtotal:</span><span>₹{order.totalAmount}</span>
                        <span>Delivery Fee:</span><span>FREE</span>
                        <hr/>
                        <strong><span>Total Paid:</span><span>₹{order.totalAmount}</span></strong>
                        <span>Method:</span><span>{order.paymentMethod}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Orders Page Component ---
function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const savedData = localStorage.getItem("userData");
            if (!savedData) {
                navigate('/login');
                return;
            }
            const buyerId = JSON.parse(savedData)._id;

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/by-buyer/${buyerId}`);
                if (!res.ok) {
                    throw new Error("Could not fetch your orders.");
                }
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <>
            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            <div className="orders-container">
                <div className="orders-header">
                    <ShoppingBag size={32} />
                    <h1>Your Orders</h1>
                </div>

                {isLoading && <p className="loading-message">Loading your order history...</p>}
                {error && <p className="error-message">{error}</p>}

                {!isLoading && !error && orders.length === 0 && (
                    <div className="no-orders-message">
                        <h2>No orders yet!</h2>
                        <p>Looks like you haven't made any purchases. Let's change that!</p>
                        <button onClick={() => navigate('/home')} className="shop-now-btn">Start Shopping</button>
                    </div>
                )}
                
                {!isLoading && !error && orders.length > 0 && (
                    <div className="timeline">
                        {orders.map(order => (
                            <div key={order._id} className="timeline-item" onClick={() => setSelectedOrder(order)}>
                                {/* **FIX**: Added a conditional class to the dot */}
                                <div className={`timeline-dot ${order.status === 'Delivered' ? 'delivered' : ''}`}></div>
                                <div className="timeline-content">
                                    <div className="order-card-header">
                                        <span className="order-date">{new Date(order.createdAt).toDateString()}</span>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                                    </div>
                                    <div className="order-card-body">
                                        <div className="product-images-preview">
                                            {order.products.slice(0, 3).map((p, i) => <img key={i} src={p.imageUrl} alt={p.name} />)}
                                            {order.products.length > 3 && <div className="more-items">+{order.products.length - 3}</div>}
                                        </div>
                                        <div className="order-summary-info">
                                            <p>{order.products.length} item(s)</p>
                                            <strong>Total: ₹{order.totalAmount}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .orders-container { padding: 20px; background-color: #f0f4f8; font-family: sans-serif; min-height: 100vh; }
                .orders-header { display: flex; align-items: center; gap: 15px; color: #003366; margin-bottom: 30px; }
                .no-orders-message { text-align: center; padding: 50px; background: white; border-radius: 12px; }
                .shop-now-btn { padding: 12px 30px; border: none; border-radius: 8px; background-color: #007BFF; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; }
                .loading-message, .error-message { text-align: center; font-size: 1.2rem; color: #555; padding: 40px; }
                .error-message { color: #d93025; }
                
                /* Timeline Styles */
                .timeline { position: relative; max-width: 800px; margin: 0 auto; padding: 20px 0; }
                .timeline::after { content: ''; position: absolute; width: 4px; background-color: #007BFF; top: 0; bottom: 0; left: 30px; margin-left: -2px; }
                .timeline-item { padding: 10px 40px; position: relative; background-color: inherit; width: 100%; margin-left: 30px; }
                .timeline-dot { content: ''; position: absolute; width: 20px; height: 20px; right: auto; left: -10px; top: 28px; background-color: white; border: 4px solid #007BFF; border-radius: 50%; z-index: 1; transition: background-color 0.3s ease; }
                /* **FIX**: New style for the delivered dot */
                .timeline-dot.delivered {
                    background-color: #007BFF;
                }
                .timeline-content { padding: 20px; background-color: white; position: relative; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); cursor: pointer; transition: box-shadow 0.2s ease; }
                .timeline-content:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
                .order-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .order-date { font-weight: bold; color: #333; }
                .order-status { padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: white; }
                .status-shipped { background-color: #FFA500; }
                .status-delivered { background-color: #28a745; }
                .status-pending { background-color: #6c757d; }
                .order-card-body { display: flex; align-items: center; gap: 15px; }
                .product-images-preview { display: flex; }
                .product-images-preview img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; margin-right: -15px; border: 2px solid white; }
                .more-items { width: 50px; height: 50px; border-radius: 8px; background: #e9ecef; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 2; }
                .order-summary-info { margin-left: auto; text-align: right; }
                .order-summary-info p { margin: 0 0 5px; color: #555; }
                .order-summary-info strong { color: #003366; }

                /* Modal (Receipt) Styles */
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .modal-content { background: white; border-radius: 15px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; animation: slideUp 0.3s ease-out; padding: 25px; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-close-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; cursor: pointer; color: #888; }
                .receipt-header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 15px; }
                .receipt-section { margin-bottom: 20px; }
                .receipt-section h4 { color: #003366; margin-bottom: 10px; }
                .receipt-item { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
                .receipt-item img { width: 50px; height: 50px; border-radius: 8px; }
                .receipt-item strong { margin-left: auto; }
                .bill-details { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
                .bill-details hr { grid-column: 1 / -1; border: 0; border-top: 1px solid #eee; }
            `}</style>
        </>
    );
}

export default Orders;
