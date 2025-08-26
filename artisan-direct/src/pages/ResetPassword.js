import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Phone, MessageSquare, Lock, CheckCircle } from 'lucide-react';

function ResetPassword() {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // **FIX**: New state to track if reCAPTCHA is ready for use.
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    useEffect(() => {
        // Use an async function inside useEffect to handle the promise from render().
        const initializeRecaptcha = async () => {
            try {
                if (!window.recaptchaVerifier) {
                    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        'size': 'invisible',
                        'callback': () => console.log("reCAPTCHA verified"),
                    });
                    // render() returns a promise. We await it to ensure it's fully ready.
                    await verifier.render();
                    window.recaptchaVerifier = verifier;
                }
                setIsRecaptchaReady(true); // Signal that reCAPTCHA is ready
            } catch (err) {
                console.error("Recaptcha initialization error:", err);
                setError("Failed to initialize verification. Please refresh the page.");
            }
        };

        initializeRecaptcha();

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const appVerifier = window.recaptchaVerifier;
            const formattedPhoneNumber = `+91${phone}`;
            const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
            setConfirmationResult(result);
            setStep(2);
        } catch (err) {
            console.error("Error sending OTP:", err);
            setError("Failed to send OTP. Please check the phone number and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        if (!confirmationResult) {
            setError("OTP confirmation is missing. Please try sending the OTP again.");
            setIsLoading(false);
            return;
        }
        try {
            await confirmationResult.confirm(otp);
            setStep(3);
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/users/reset-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setStep(4);
        } catch (err) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleSendOtp}>
                        <div className="reset-header"><Phone size={48} className="header-icon" /><h2>Reset Password</h2><p>Enter your phone number to receive a verification code.</p></div>
                        <div className="input-group"><label htmlFor="phone">Phone Number</label><input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength="10" required /></div>
                        {/* **FIX**: Button is disabled until reCAPTCHA is fully ready. */}
                        <button type="submit" className="action-btn" disabled={isLoading || !isRecaptchaReady}>
                            {isLoading ? "Sending..." : (isRecaptchaReady ? "Send OTP" : "Initializing...")}
                        </button>
                    </form>
                );
            case 2:
                return (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="reset-header"><MessageSquare size={48} className="header-icon" /><h2>Verify Code</h2><p>Enter the 6-digit code sent to +91 {phone}.</p></div>
                        <div className="input-group"><label htmlFor="otp">Verification Code</label><input id="otp" type="tel" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required /></div>
                        <button type="submit" className="action-btn" disabled={isLoading}>{isLoading ? "Verifying..." : "Verify"}</button>
                    </form>
                );
            case 3:
                return (
                    <form onSubmit={handlePasswordReset}>
                        <div className="reset-header"><Lock size={48} className="header-icon" /><h2>Create New Password</h2><p>Your new password must be at least 6 characters long.</p></div>
                        <div className="input-group"><label htmlFor="newPassword">New Password</label><input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
                        <div className="input-group"><label htmlFor="confirmPassword">Confirm New Password</label><input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                        <button type="submit" className="action-btn" disabled={isLoading}>{isLoading ? "Saving..." : "Reset Password"}</button>
                    </form>
                );
            case 4:
                return (
                    <div className="success-container">
                        <CheckCircle size={60} className="success-icon" /><h2>Password Reset!</h2><p>Your password has been updated successfully.</p>
                        <button onClick={() => navigate('/login')} className="action-btn go-to-login-btn">Go to Login</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="reset-password-container">
                <div id="recaptcha-container"></div>
                <div className="reset-password-box">
                    {renderStep()}
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
            <style>{`
                .reset-password-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f4f8; font-family: sans-serif; padding: 20px; }
                .reset-password-box { width: 100%; max-width: 400px; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); }
                .reset-header { text-align: center; margin-bottom: 2rem; }
                .header-icon { color: #007BFF; }
                .reset-header h2 { color: #003366; margin: 1rem 0 0.5rem; }
                .reset-header p { color: #666; font-size: 0.9rem; }
                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333; }
                .input-group input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box; }
                .action-btn { width: 100%; padding: 15px; border: none; border-radius: 8px; background-color: #007BFF; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; }
                .action-btn:disabled { background-color: #ccc; cursor: not-allowed; }
                .error-message { color: #d93025; text-align: center; margin-top: 1rem; }
                .success-container { text-align: center; }
                .success-icon { color: #28a745; margin-bottom: 1rem; }
                .go-to-login-btn { background-color: #28a745; }
            `}</style>
        </>
    );
}

export default ResetPassword;
