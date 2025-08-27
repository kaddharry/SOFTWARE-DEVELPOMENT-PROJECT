import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Shield, HelpCircle, ShoppingBag, PlusCircle, BarChart2, Star, Eye, Camera, Upload, X } from 'lucide-react';

// --- Shop Closed Sign Component ---
const ShopClosedSign = ({ onClose }) => {
    return (
        <div className="shop-closed-overlay">
            <div className="shop-closed-sign">
                <button className="close-sign-btn" onClick={onClose}><X size={24} /></button>
                <h2>Shop Closed</h2>
                <p>We'll miss you! Come back soon.</p>
                <small>Your products will be shown as "Out of Stock" to customers.</small>
            </div>
        </div>
    );
};


function Profile() {
    // --- State Management ---
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [showClosedSign, setShowClosedSign] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [uploading, setUploading] = useState(false); // To show loading state
    const fileInputRef = useRef(null);

    // --- Data Fetching & Effects ---
    useEffect(() => {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setUserData(parsedData);
            setIsShopOpen(parsedData.isShopOpen !== false);
        }
    }, []);

    useEffect(() => {
        if (!isShopOpen) {
            setShowClosedSign(true);
        }
    }, [isShopOpen]);

    // --- Event Handlers ---
    const handleToggleShopStatus = async () => {
        const newStatus = !isShopOpen;
        setIsShopOpen(newStatus);

        if (!userData || !userData.phone) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: userData.phone, isShopOpen: newStatus })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            localStorage.setItem('userData', JSON.stringify(data.user));
        } catch (error) {
            console.error("Failed to update shop status:", error);
            setIsShopOpen(!newStatus);
            alert("Could not update shop status.");
        }
    };

    const handleImageUploadClick = () => {
        fileInputRef.current.click();
    };

    // **FIXED**: This function now handles the full upload and save process.
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsModalOpen(false);
        setUploading(true);

        const formData = new FormData();
        formData.append('image', file); // "image" must match the key in uploadRoutes.js

        try {
            // Step 1: Upload the image to the backend/Cloudinary
            const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed.');
            
            const { imageUrl } = uploadData;

            // Step 2: Save the returned URL to the user's profile
            const updateRes = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: userData.phone, profilePicUrl: imageUrl })
            });
            const updatedUserData = await updateRes.json();
            if (!updateRes.ok) throw new Error(updatedUserData.message || 'Failed to update profile.');

            // Step 3: Update localStorage and component state
            localStorage.setItem('userData', JSON.stringify(updatedUserData.user));
            setUserData(updatedUserData.user);

        } catch (error) {
            console.error("Failed to upload profile picture:", error);
            alert("Error uploading image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const dashboardData = {
        revenue: "N/A",
        monthlyOrders: 0,
        bestSeller: "N/A"
    };

    if (!userData) {
        return <div>Loading Profile...</div>;
    }

    return (
        <>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        <h3>Upload Profile Photo</h3>
                        <button className="modal-option-btn" onClick={handleImageUploadClick}><Upload size={20} /> From Device</button>
                        <button className="modal-option-btn" disabled><Camera size={20} /> From Camera (Coming Soon)</button>
                    </div>
                </div>
            )}
            
            {showClosedSign && <ShopClosedSign onClose={() => setShowClosedSign(false)} />}

            <div className="profile-container">
                <div className="profile-header card">
                    <div className="profile-picture-container" onClick={() => !uploading && setIsModalOpen(true)}>
                        <img src={userData.profilePicUrl || `https://placehold.co/100x100/E7F3FF/003366?text=${userData.name ? userData.name.charAt(0) : 'S'}`} alt="Shop Logo" className={`profile-picture ${uploading ? 'uploading' : ''}`} />
                        {!uploading && <div className="plus-icon">+</div>}
                        {uploading && <div className="spinner"></div>}
                    </div>
                    <div className="profile-info">
                        <h1 className="shop-name">{userData.shopName}</h1>
                        <p className="seller-name">Seller: {userData.name}</p>
                        <p className="seller-id">ID: {userData._id}</p>
                    </div>
                    <div className="shop-status">
                        <label className="switch">
                            <input type="checkbox" checked={isShopOpen} onChange={handleToggleShopStatus} />
                            <span className="slider round"></span>
                        </label>
                        <span className="status-label">{isShopOpen ? "Open for Business" : "On Vacation"}</span>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card card"><BarChart2 size={28} className="icon-blue" /><h4>Total Revenue</h4><p className="metric">₹{dashboardData.revenue}</p></div>
                    <div className="dashboard-card card"><ShoppingBag size={28} className="icon-orange" /><h4>Orders This Month</h4><p className="metric">{dashboardData.monthlyOrders}</p></div>
                    <div className="dashboard-card card"><Star size={28} className="icon-green" /><h4>Best Seller</h4><p className="metric-small">{dashboardData.bestSeller}</p></div>
                </div>
                <div className="menu-container card">
                    <h3 className="menu-title">Manage Your Shop</h3>
                    <div className="menu-grid"><Link to="/add-product" className="menu-item"><PlusCircle size={24} /><span>Add New Product</span></Link><Link to="/my-products" className="menu-item"><ShoppingBag size={24} /><span>View Your Products</span></Link><Link to="/shop-preview" className="menu-item"><Eye size={24} /><span>View as Customer</span></Link></div>
                    <h3 className="menu-title">Account & Settings</h3>
                    <div className="menu-grid"><Link to="/edit-profile" className="menu-item"><Edit size={24} /><span>Edit Profile</span></Link><Link to="/reset-password" className="menu-item"><Shield size={24} /><span>Reset Password</span></Link></div>
                    <h3 className="menu-title">Support</h3>
                    <div className="menu-grid"><Link to="/help" className="menu-item"><HelpCircle size={24} /><span>Help & FAQ</span></Link></div>
                </div>
            </div>

            <style>{`
                .profile-container { padding: 20px; background-color: #f0f4f8; font-family: sans-serif; min-height: 100vh; }
                .card { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); padding: 20px; margin-bottom: 20px; }
                .profile-header { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
                .profile-picture-container { position: relative; cursor: pointer; }
                .profile-picture { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #007BFF; transition: filter 0.3s ease; }
                .profile-picture.uploading { filter: brightness(0.5); }
                .plus-icon { position: absolute; bottom: 0; right: 0; background-color: #007BFF; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; border: 2px solid white; transition: transform 0.2s ease; }
                .profile-picture-container:hover .plus-icon { transform: scale(1.1); }
                .profile-info { flex-grow: 1; }
                .shop-name { margin: 0; font-size: 1.8rem; color: #003366; }
                .seller-name { margin: 5px 0 0; color: #555; }
                .seller-id { font-size: 0.8rem; color: #888; margin-top: 5px; word-break: break-all; }
                .shop-status { display: flex; align-items: center; gap: 10px; margin-left: auto; }
                .status-label { font-weight: bold; color: #333; }
                .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
                .dashboard-card { text-align: center; }
                .dashboard-card h4 { margin: 10px 0 5px; color: #555; font-size: 0.9rem; }
                .metric { margin: 0; font-size: 2rem; font-weight: bold; color: #003366; }
                .metric-small { margin: 0; font-size: 1rem; font-weight: bold; color: #333; }
                .icon-blue { color: #007BFF; } .icon-orange { color: #FFA500; } .icon-green { color: #28a745; }
                .menu-title { color: #003366; border-bottom: 2px solid #f0f4f8; padding-bottom: 10px; margin-top: 20px; margin-bottom: 15px; }
                .menu-title:first-child { margin-top: 0; }
                .menu-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
                .menu-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 8px; text-decoration: none; color: #333; font-weight: 500; transition: background-color 0.2s ease, color 0.2s ease; }
                .menu-item:hover { background-color: #e7f3ff; color: #0056b3; }
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
                input:checked + .slider { background-color: #28a745; }
                input:checked + .slider:before { transform: translateX(22px); }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 350px; position: relative; }
                .modal-close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; color: #888; }
                .modal-content h3 { text-align: center; color: #003366; margin-top: 0; }
                .modal-option-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; margin-top: 1rem; border-radius: 8px; border: 1px solid #ccc; background: #f9f9f9; font-weight: bold; cursor: pointer; }
                .modal-option-btn:hover:not(:disabled) { background: #e7f3ff; }
                .modal-option-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                @keyframes fadeInScaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .shop-closed-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 51, 102, 0.8); display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 20px; }
                .shop-closed-sign { background: white; color: #003366; padding: 3rem; border-radius: 12px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position: relative; animation: fadeInScaleUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .shop-closed-sign h2 { font-size: 2rem; color: #dc3545; margin: 0 0 1rem 0; }
                .shop-closed-sign p { font-size: 1.2rem; margin-bottom: 0.5rem; }
                .shop-closed-sign small { color: #555; }
                .close-sign-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; color: #888; }
                
                /* Spinner for image upload */
                .spinner { position: absolute; top: 50%; left: 50%; width: 30px; height: 30px; border: 4px solid rgba(255, 255, 255, 0.3); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; transform: translate(-50%, -50%); }
                @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

                @media (min-width: 768px) { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
            `}</style>
        </>
    );
}

export default Profile;
