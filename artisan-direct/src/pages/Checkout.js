import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // FIXED: Removed unused 'Link'
import { User, Truck, CreditCard, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react';

function Checkout({ onOrderSuccess }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize state directly from location state to avoid useEffect dependency
    const [itemsToPurchase, setItemsToPurchase] = useState(() => location.state?.items || []);
    const [deliveryInfo, setDeliveryInfo] = useState({ name: '', phone: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    
    // This effect now only runs once to pre-fill the form and check for empty items.
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("userData"));
        if (currentUser) {
            setDeliveryInfo({
                name: currentUser.name || '',
                phone: currentUser.phone || '',
                address: `${currentUser.address || ''}, ${currentUser.city || ''}, ${currentUser.state || ''}`.trim(),
            });
        }
        
        // If the checkout page is loaded without any items, redirect to the cart.
        if (itemsToPurchase.length === 0) {
            navigate('/cart');
        }
    // FIXED: Added missing dependency to the array.
    }, [navigate, itemsToPurchase.length]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveItem = (itemToRemove) => {
        const updatedItems = itemsToPurchase.filter(item => item._id !== itemToRemove._id);
        setItemsToPurchase(updatedItems);
        if (updatedItems.length === 0) {
            navigate('/cart');
        }
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem("userData"));
            const orderDetails = {
                buyerId: currentUser._id,
                products: itemsToPurchase.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    sellerId: item.sellerId._id,
                })),
                totalAmount: calculateTotal(),
                shippingAddress: deliveryInfo,
                paymentMethod: paymentMethod,
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to place order.");
            
            onOrderSuccess(itemsToPurchase);
            setStep(4);

        } catch (err) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const calculateTotal = () => {
        return itemsToPurchase.reduce((sum, item) => sum + item.price, 0);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="step-header"><User /><h2>Step 1: Confirm Delivery Details</h2></div>
                        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                            <div className="input-group"><label>Full Name</label><input name="name" value={deliveryInfo.name} onChange={handleInputChange} required /></div>
                            <div className="input-group"><label>Phone Number</label><input name="phone" value={deliveryInfo.phone} onChange={handleInputChange} required /></div>
                            <div className="input-group"><label>Full Address</label><textarea name="address" value={deliveryInfo.address} onChange={handleInputChange} rows="3" required /></div>
                            <button type="submit" className="action-btn">Next: Payment</button>
                        </form>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="step-header"><CreditCard /><h2>Step 2: Choose Payment Method</h2></div>
                        <div className="payment-options">
                            {['Cash on Delivery (COD)', 'UPI', 'Net Banking'].map(method => (
                                <button key={method} className={`payment-btn ${paymentMethod === method ? 'selected' : ''}`} onClick={() => setPaymentMethod(method)}>{method}</button>
                            ))}
                        </div>
                        <button onClick={() => setStep(3)} className="action-btn" disabled={!paymentMethod}>Next: Review Order</button>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="step-header"><Truck /><h2>Step 3: Review Your Order</h2></div>
                        <div className="summary-section">
                            <h4>Items ({itemsToPurchase.length})</h4>
                            {itemsToPurchase.map(item => (
                                <div key={item._id} className="summary-item-card">
                                    <img src={item.imageUrl} alt={item.name} />
                                    <div className="summary-item-info"><p>{item.name}</p><strong>₹{item.price}</strong></div>
                                    <button className="summary-remove-btn" onClick={() => handleRemoveItem(item)}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="summary-section">
                            <h4>Shipping To</h4>
                            <p>{deliveryInfo.name}<br/>{deliveryInfo.address}<br/>{deliveryInfo.phone}</p>
                        </div>
                        <div className="summary-section">
                            <h4>Payment</h4>
                            <p>Method: {paymentMethod}</p>
                            <div className="bill-details">
                                <span>Subtotal:</span><span>₹{calculateTotal()}</span>
                                <span>Delivery Fee:</span><span>FREE</span>
                                <hr/>
                                <strong><span>Total:</span><span>₹{calculateTotal()}</span></strong>
                            </div>
                        </div>
                        <button onClick={handlePlaceOrder} className="action-btn place-order-btn" disabled={isLoading}>{isLoading ? "Placing Order..." : "Confirm & Place Order"}</button>
                    </>
                );
            case 4:
                return (
                    <div className="success-container">
                        <CheckCircle size={60} className="success-icon" />
                        <h2>Order Confirmed!</h2>
                        <p>Thank you for your purchase. You can track your order on the "Your Orders" page.</p>
                        <button onClick={() => navigate('/orders')} className="action-btn">View Your Orders</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <>
            <div className="checkout-container">
                <div className="checkout-box">
                    {step > 1 && step < 4 && <button className="back-btn" onClick={() => setStep(step - 1)}><ArrowLeft size={20} /> Back</button>}
                    {renderStep()}
                </div>
            </div>
            <style>{`
                .checkout-container { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background-color: #f0f4f8; font-family: sans-serif; padding: 20px; }
                .checkout-box { width: 100%; max-width: 600px; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); position: relative; }
                .step-header { display: flex; align-items: center; gap: 15px; color: #003366; margin-bottom: 2rem; }
                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
                .input-group input, .input-group textarea { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box; }
                .action-btn { width: 100%; padding: 15px; border: none; border-radius: 8px; background-color: #007BFF; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; }
                .action-btn:disabled { background-color: #ccc; }
                .payment-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1rem; }
                .payment-btn { padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #f8f9fa; cursor: pointer; text-align: left; font-weight: 500; }
                .payment-btn.selected { border-color: #007BFF; background-color: #e7f3ff; font-weight: bold; }
                .summary-section { margin-bottom: 2rem; }
                .summary-section h4 { color: #003366; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                .summary-item-card { display: flex; gap: 15px; align-items: center; margin-bottom: 10px; }
                .summary-item-card img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
                .summary-item-info { flex-grow: 1; }
                .summary-remove-btn { background: none; border: none; color: #dc3545; cursor: pointer; padding: 5px; margin-left: auto; }
                .bill-details { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 1rem; }
                .bill-details hr { grid-column: 1 / -1; border: 0; border-top: 1px solid #eee; }
                .place-order-btn { background-color: #28a745; }
                .success-container { text-align: center; }
                .success-icon { color: #28a745; margin-bottom: 1rem; }
                .back-btn { position: absolute; top: 20px; left: 20px; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; color: #555; font-weight: bold; }
            `}</style>
        </>
    );
}

export default Checkout;
