import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, AlertTriangle, Phone, Shield } from 'lucide-react';
import './Orders.css';

// --- Reusable Confirmation Modal ---
const IssueConfirmationModal = ({ onConfirm, onCancel, step, seller, issueType, setIssueType, issueDescription, setIssueDescription }) => {
    const messages = {
        1: {
            title: "Report Delivery Issue?",
            body: "Please wait another 1-2 days for the delivery to arrive before raising an issue. Are you sure you want to proceed now?",
            confirmText: "Yes, Proceed"
        },
        2: {
            title: "What problems are you facing with the order?",
            body: "Please select the issue type and provide details if needed.",
            confirmText: "Report Issue"
        },
        3: {
            title: "Contact Seller",
            body: "Your issue has been flagged. You can now contact the seller directly to resolve this.",
            confirmText: "Okay"
        }
    };
    const current = messages[step];

    const issueOptions = [
        { value: 'not_received', label: 'Order not received' },
        { value: 'damaged', label: 'Item damaged or broken' },
        { value: 'wrong_item', label: 'Wrong item received' },
        { value: 'incomplete', label: 'Order incomplete' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal-content">
                <div className="confirmation-icon">
                    {step === 1 ? <AlertTriangle size={48} /> : step === 2 ? <AlertTriangle size={48} /> : <Phone size={48} />}
                </div>
                <h2>{current.title}</h2>
                <p>{current.body}</p>
                {step === 2 && (
                    <div className="issue-form">
                        {issueOptions.map(option => (
                            <label key={option.value} className="issue-option">
                                <input
                                    type="radio"
                                    name="issueType"
                                    value={option.value}
                                    checked={issueType === option.value}
                                    onChange={(e) => setIssueType(e.target.value)}
                                />
                                {option.label}
                            </label>
                        ))}
                        {issueType === 'other' && (
                            <textarea
                                placeholder="Please describe the issue..."
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                className="issue-description"
                            />
                        )}
                    </div>
                )}
                {step === 3 && seller && (
                    <div className="seller-contact-info">
                        <h3>Seller Details</h3>
                        <p><strong>Shop:</strong> {seller.shopName}</p>
                        <p><strong>Phone:</strong> <a href={`tel:${seller.phone}`}>{seller.phone}</a></p>
                        <p><strong>Email:</strong> <a href={`mailto:${seller.email}`}>{seller.email}</a></p>
                    </div>
                )}
                <div className="confirmation-actions">
                    {step === 1 && <button className="cancel-btn" onClick={onCancel}>Wait Longer</button>}
                    <button className="confirm-btn" onClick={onConfirm} disabled={step === 2 && !issueType}>{current.confirmText}</button>
                </div>
            </div>
        </div>
    );
};


// --- Redesigned Order Detail Modal (Receipt) ---
const OrderDetailModal = ({ order, onClose, onReportIssue }) => {
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

                {/* Report Issue Button */}
                {order.status === 'Shipped' && !order.hasDeliveryIssue && onReportIssue && (
                    <div className="receipt-section">
                        <button className="report-issue-btn" onClick={() => onReportIssue(order)}>
                            <AlertTriangle size={16} /> I haven't received this order
                        </button>
                    </div>
                )}
                {order.hasDeliveryIssue && (
                    <div className="receipt-section">
                        <p className="issue-reported-text"><Shield size={16} /> Delivery issue reported</p>
                    </div>
                )}
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
    const [issueType, setIssueType] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
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
            setModalStep(2); // Move to issue selection
        } else if (modalStep === 2) {
            try {
                // Call API to report issue with details
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/report-issue/${issueOrder._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ issueType, issueDescription })
                });
                if (!res.ok) throw new Error("Failed to report issue.");

                // Update the local state to reflect the change immediately
                setOrders(prevOrders => prevOrders.map(o =>
                    o._id === issueOrder._id ? { ...o, hasDeliveryIssue: true, issueType, issueDescription } : o
                ));

                setModalStep(3); // Move to the "Contact Seller" step
            } catch (err) {
                alert(err.message);
                setIssueOrder(null);
                setIssueType('');
                setIssueDescription('');
            }
        } else {
            // This is for the "Okay" button on the final step
            setIssueOrder(null);
            setIssueType('');
            setIssueDescription('');
        }
    };

    const handleCancelIssue = () => {
        setIssueOrder(null);
        setModalStep(1);
        setIssueType('');
        setIssueDescription('');
    };

    const handleResolveIssue = async (orderId, userType) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/resolve-issue/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userType }),
            });
            if (!res.ok) throw new Error("Failed to resolve issue.");
            fetchOrders();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onReportIssue={handleReportIssueClick} />
            {issueOrder && <IssueConfirmationModal onConfirm={handleConfirmIssue} onCancel={handleCancelIssue} step={modalStep} seller={issueOrder.sellerId} issueType={issueType} setIssueType={setIssueType} issueDescription={issueDescription} setIssueDescription={setIssueDescription} />}

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
                                                <>
                                                    <p className="issue-reported-text"><Shield size={16} /> Issue Reported</p>
                                                    {!order.buyerResolved && (
                                                        <button className="resolve-btn" onClick={() => handleResolveIssue(order._id, 'buyer')}>
                                                            Mark as Resolved
                                                        </button>
                                                    )}
                                                    {order.buyerResolved && <p className="resolved-text">You marked as resolved</p>}
                                                    {order.sellerResolved && <p className="resolved-text">Seller also resolved</p>}
                                                </>
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

