import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';

function RegistrationSuccess() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
            setUserData(JSON.parse(savedData));
        }
    }, []);

    return (
        <>
            <div className="success-page-container">
                <div className="success-box">
                    <PartyPopper size={60} className="success-icon" />
                    <h2>Registration Successful!</h2>
                    <p>Welcome to Artisan Direct. We're excited to have you.</p>
                    
                    <div className="seller-id-box">
                        <p>This is your unique Seller ID:</p>
                        <strong>{userData ? userData._id : "Loading..."}</strong>
                        <small>You can always find this on your profile page.</small>
                    </div>

                    <button onClick={() => navigate('/home')} className="action-btn">
                        Let's Explore!
                    </button>
                </div>
            </div>
            <style>{`
                .success-page-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f4f8; font-family: sans-serif; padding: 20px; }
                .success-box { text-align: center; background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); }
                .success-icon { color: #FFA500; margin-bottom: 1rem; }
                .success-box h2 { color: #003366; }
                .success-box p { color: #555; margin-bottom: 2rem; }
                .seller-id-box { background-color: #e7f3ff; border-radius: 8px; padding: 1rem; margin-bottom: 2rem; }
                .seller-id-box p { margin: 0 0 0.5rem 0; color: #555; }
                .seller-id-box strong { color: #003366; font-size: 1.2rem; word-break: break-all; }
                .seller-id-box small { display: block; margin-top: 0.5rem; color: #777; }
                .action-btn { width: 100%; padding: 15px; border: none; border-radius: 8px; background-color: #28a745; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; }
            `}</style>
        </>
    );
}

export default RegistrationSuccess;
