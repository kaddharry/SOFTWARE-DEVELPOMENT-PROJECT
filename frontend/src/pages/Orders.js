import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, AlertTriangle, Phone, Shield } from 'lucide-react';
import './Orders.css';

// --- Reusable Confirmation Modal ---
const IssueConfirmationModal = ({ onConfirm, onCancel, step }) => {
    const messages = {
        1: {
            title: "Report Delivery Issue?",
            body: "Please wait another 1-2 days for the delivery to arrive before raising an issue. Are you sure you want to proceed now?",
            confirmText: "Yes, Proceed"
        },
        2: {
            title: "Contact Seller",
            body: "Your issue has been flagged. You can now contact the seller directly to resolve this.",
            confirmText: "Okay"
        }
    };
    const current = messages[step];

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal-content">
                <div className="confirmation-icon">
                    {step === 1 ? <AlertTriangle size={48} /> : <Phone size={48} />}
                </div>
                <h2>{current.title}</h2>
                <p>{current.body}</p>
                <div className="confirmation-actions">
                    {step === 1 && <button className="cancel-btn" onClick={onCancel}>Wait Longer</button>}
                    <button className="confirm-btn" onClick={onConfirm}>{current.confirmText}</button>
                </div>
            </div>
        </div>
    );
};


// --- Redesigned Order Detail Modal (Receipt) ---
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    // --- FIX: Correctly calculate subtotal from all items and quantities ---
    const subtotal = order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="receipt-close-btn" onClick={onClose}><X size={24} /></button>
                
                <div className="receipt-header">
                    <h2>Order Receipt</h2>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="receipt-section">
                    <h4>Items Purchased</h4>
                    <div className="receipt-items-list">
                        {order.products.map((p, i) => (
                            <div key={i} className="receipt-item">
                                <img src={p.imageUrl} alt={p.name} className="receipt-item-img"/>
                                <div className="receipt-item-info">
                                    <span className="receipt-item-name">{p.name}</span>
                                    <span className="receipt-item-price-qty">₹{p.price.toFixed(2)} x {p.quantity}</span>
                                </div>
                                <strong className="receipt-item-total">₹{(p.price * p.quantity).toFixed(2)}</strong>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="receipt-section">
                    <h4>Shipping To</h4>
                    <div className="shipping-info">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.phone}</p>
                    </div>
                </div>
                
                <div className="receipt-section">
                    <h4>Payment Summary</h4>
                    <div className="receipt-bill-details">
                        {/* --- FIX: Display the correctly calculated subtotal --- */}
                        <span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span>
                        <span>Delivery Fee:</span><span>FREE</span>
                        <hr/>
                        <strong><span>Total Paid:</span><span>₹{order.totalAmount.toFixed(2)}</span></strong>
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
    const [issueOrder, setIssueOrder] = useState(null); // Order for which issue is being raised
    const [modalStep, setModalStep] = useState(1);
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        const savedData = localStorage.getItem("userData");
        if (!savedData) {
            navigate('/login');
            return;
        }
        const buyerId = JSON.parse(savedData)._id;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/by-buyer/${buyerId}`);
            if (!res.ok) throw new Error("Could not fetch your orders.");
            const data = await res.json();
            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleReportIssueClick = (order) => {
        setIssueOrder(order);
        setModalStep(1);
    };

    const handleConfirmIssue = async () => {
        if (modalStep === 1) {
            try {
                // Call API to flag the order
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/report-issue/${issueOrder._id}`, {
                    method: 'PUT',
                });
                if (!res.ok) throw new Error("Failed to report issue.");
                
                // Update the local state to reflect the change immediately
                setOrders(prevOrders => prevOrders.map(o => 
                    o._id === issueOrder._id ? { ...o, hasDeliveryIssue: true } : o
                ));

                setModalStep(2); // Move to the "Contact Seller" step
            } catch (err) {
                alert(err.message);
                setIssueOrder(null);
            }
        } else {
            // This is for the "Okay" button on the final step
            setIssueOrder(null);
        }
    };

    const handleCancelIssue = () => {
        setIssueOrder(null);
    };

    return (
        <>
            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            {issueOrder && <IssueConfirmationModal onConfirm={handleConfirmIssue} onCancel={handleCancelIssue} step={modalStep} />}

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
                            <div key={order._id} className="timeline-item">
                                <div className={`timeline-dot ${order.status === 'Delivered' ? 'delivered' : ''}`}></div>
                                <div className="timeline-content">
                                    <div className="order-card-header" onClick={() => setSelectedOrder(order)}>
                                        <span className="order-date">{new Date(order.createdAt).toDateString()}</span>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                                    </div>
                                    <div className="order-card-body" onClick={() => setSelectedOrder(order)}>
                                        <div className="product-images-preview">
                                            {order.products.slice(0, 3).map((p, i) => <img key={i} src={p.imageUrl} alt={p.name} />)}
                                            {order.products.length > 3 && <div className="more-items">+{order.products.length - 3}</div>}
                                        </div>
                                        <div className="order-summary-info">
                                            <p>{order.products.reduce((sum, p) => sum + p.quantity, 0)} item(s)</p>
                                            <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                    {/* --- NEW: Button to report issue --- */}
                                    {order.status === 'Shipped' && (
                                        <div className="order-card-footer">
                                            {order.hasDeliveryIssue ? (
                                                <p className="issue-reported-text"><Shield size={16} /> Issue Reported</p>
                                            ) : (
                                                <button className="report-issue-btn" onClick={() => handleReportIssueClick(order)}>
                                                    <AlertTriangle size={16} /> I haven't received this
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Orders;

