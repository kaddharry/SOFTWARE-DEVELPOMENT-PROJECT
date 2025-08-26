import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for the button
import { Shield, Edit, CheckCircle } from 'lucide-react';

function EditProfile() {
    const [isVerified, setIsVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        shopName: '',
        name: '',
        address: '',
        city: '',
        state: '',
    });

    // Load user data from localStorage when the component mounts
    useEffect(() => {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setCurrentUser(parsedData); // Store the full user object
            setFormData({
                shopName: parsedData.shopName || '',
                name: parsedData.name || '',
                address: parsedData.address || '',
                city: parsedData.city || '',
                state: parsedData.state || '',
            });
        }
    }, []);

    const handlePasswordVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!currentUser || !currentUser.phone) {
            setError("Could not find user data. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/users/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: currentUser.phone, password: password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Password verification failed.");
            }

            setIsVerified(true); // On success, show the edit form

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:5000/api/users/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: currentUser.phone, ...formData })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile.");
            }
            
            // IMPORTANT: Update localStorage with the new user data from the server
            localStorage.setItem('userData', JSON.stringify(data.user));
            setSuccess("Profile updated successfully!");

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="edit-profile-container">
                <div className="edit-profile-box">
                    {!isVerified ? (
                        // -- STATE 1: VERIFY PASSWORD --
                        <>
                            <div className="edit-profile-header">
                                <Shield size={48} className="header-icon" />
                                <h2>Verify Your Identity</h2>
                                <p>Please enter your current password to continue.</p>
                            </div>
                            <form onSubmit={handlePasswordVerify}>
                                <div className="input-group">
                                    <label htmlFor="password">Current Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="action-btn" disabled={isLoading}>
                                    {isLoading ? "Verifying..." : "Verify"}
                                </button>
                            </form>
                        </>
                    ) : success ? (
                        // -- STATE 3: SUCCESS SCREEN --
                        <div className="success-container">
                            <CheckCircle size={60} className="success-icon" />
                            <h2>Update Successful!</h2>
                            <p>{success}</p>
                            <Link to="/profile" className="action-btn go-back-btn">
                                Go Back to Profile
                            </Link>
                        </div>
                    ) : (
                        // -- STATE 2: EDIT FORM --
                        <>
                            <div className="edit-profile-header">
                                <Edit size={48} className="header-icon" />
                                <h2>Edit Your Profile</h2>
                                <p>Update your shop and personal information.</p>
                            </div>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="input-group">
                                    <label htmlFor="shopName">Shop Name</label>
                                    <input id="shopName" name="shopName" type="text" value={formData.shopName} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="name">Seller Name</label>
                                    <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="address">Address</label>
                                    <input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="city">City</label>
                                    <input id="city" name="city" type="text" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="state">State</label>
                                    <input id="state" name="state" type="text" value={formData.state} onChange={handleInputChange} />
                                </div>
                                <button type="submit" className="action-btn" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </>
                    )}
                    {error && !success && <p className="error-message">{error}</p>}
                </div>
            </div>
            <style>{`
                .edit-profile-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f0f4f8;
                    font-family: sans-serif;
                    padding: 20px;
                }
                .edit-profile-box {
                    width: 100%;
                    max-width: 450px;
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                }
                .edit-profile-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .header-icon {
                    color: #007BFF;
                }
                .edit-profile-header h2 {
                    color: #003366;
                    margin: 1rem 0 0.5rem;
                }
                .edit-profile-header p {
                    color: #666;
                    font-size: 0.9rem;
                }
                .input-group {
                    margin-bottom: 1.5rem;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    color: #333;
                }
                .input-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: #007BFF;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
                }
                .action-btn {
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 8px;
                    background-color: #007BFF;
                    color: white;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    transition: background-color 0.3s ease;
                }
                .action-btn:hover:not(:disabled) {
                    background-color: #0056b3;
                }
                .action-btn:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
                .error-message {
                    color: #d93025;
                    text-align: center;
                    margin-top: 1rem;
                }
                .success-container {
                    text-align: center;
                }
                .success-icon {
                    color: #28a745;
                    margin-bottom: 1rem;
                }
                .success-container h2 {
                    color: #003366;
                }
                .success-container p {
                    color: #555;
                    margin-bottom: 2rem;
                }
                .go-back-btn {
                    background-color: #28a745;
                }
                .go-back-btn:hover {
                    background-color: #218838;
                }
            `}</style>
        </>
    );
}

export default EditProfile;
