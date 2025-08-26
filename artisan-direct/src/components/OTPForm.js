import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// A simple SVG icon for the OTP page header
const OTPSVGIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
);

function OTPForm({ userData, onVerify }) {
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    const phoneToVerify = userData ? userData.phone : null;

    useEffect(() => {
        if (!phoneToVerify) {
            console.error("No phone number found, redirecting to register.");
            navigate("/register");
            return;
        }

        const sendOtp = async () => {
            try {
                // **FIX**: Initialize the verifier once and ensure it's ready.
                if (!window.recaptchaVerifier) {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        'size': 'invisible'
                    });
                    // The render method returns a promise that resolves when the reCAPTCHA is ready.
                    await window.recaptchaVerifier.render();
                }
                
                const formattedPhoneNumber = `+91${phoneToVerify}`;
                const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);
                setConfirmationResult(result);
                console.log("OTP sent successfully!");

            } catch (err) {
                console.error("Error sending OTP:", err);
                setError("Failed to send OTP. Please refresh and try again.");
            }
        };
        
        sendOtp();

        // The cleanup function remains crucial for when the user navigates away.
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
                console.log("reCAPTCHA cleared.");
            }
        };

    }, [phoneToVerify, navigate]);


    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (!otp || otp.length < 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        if (!confirmationResult) {
            setError("Cannot verify OTP. Please go back and try again.");
            return;
        }

        setIsVerifying(true);
        try {
            await confirmationResult.confirm(otp);
            console.log("✅ OTP Verified successfully!");
            onVerify(); // This calls the function in App.js to navigate
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError("The OTP you entered is incorrect. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <>
            <div className="otp-container">
                {/* This div is required for Firebase reCAPTCHA */}
                <div id="recaptcha-container"></div>

                <div className="otp-box">
                    <div className="otp-header">
                        <OTPSVGIcon />
                        <h2>Phone Verification</h2>
                        <p>Step 2: Enter the code we sent to your phone</p>
                    </div>
                    
                    <div className="phone-display">
                        <p>A 6-digit code has been sent to:</p>
                        <strong>+91 {phoneToVerify || "..."}</strong>
                    </div>

                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-group">
                            <label htmlFor="otp">Verification Code</label>
                            <input
                                id="otp"
                                type="tel"
                                placeholder="------"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                            />
                        </div>
                        <button type="submit" className="verify-btn" disabled={isVerifying}>
                            {isVerifying ? "Verifying..." : "Verify & Continue"}
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}

                    <p className="back-link">
                       Wrong number? <Link to="/register">Go Back</Link>
                    </p>
                </div>
            </div>
            <style>{`
                /* This is required for the invisible reCAPTCHA */
                #recaptcha-container {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                }
                .otp-container {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background-color: #f0f4f8;
                  font-family: sans-serif;
                  padding: 20px;
                }
                .otp-box {
                  width: 100%;
                  max-width: 400px;
                  background: white;
                  padding: 4rem;
                  border-radius: 12px;
                  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
                .otp-header h2 {
                  color: #003366;
                  margin: 1rem 0 0.5rem;
                }
                .otp-header p {
                  color: #666;
                  font-size: 0.9rem;
                }
                .phone-display {
                    background-color: #e7f3ff;
                    border-radius: 8px;
                    padding: 1rem;
                    margin: 2rem 0;
                }
                .phone-display p {
                    margin: 0 0 0.5rem 0;
                    color: #555;
                }
                .phone-display strong {
                    color: #003366;
                    font-size: 1.2rem;
                }
                .input-group label {
                  display: block;
                  margin-bottom: 0.5rem;
                  font-weight: bold;
                  color: #333;
                  text-align: left;
                }
                .input-group input {
                  width: 100%;
                  padding: 12px 15px;
                  border-radius: 8px;
                  border: 1px solid #ccc;
                  text-align: center;
                  font-size: 1.5rem; /* Larger font for OTP */
                  letter-spacing: 0.5rem; /* Spreads out the numbers */
                  transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .input-group input:focus {
                  outline: none;
                  border-color: #007BFF;
                  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
                }
                .verify-btn {
                  width: 100%;
                  padding: 15px;
                  border: none;
                  border-radius: 8px;
                  background-color: #FFA500;
                  color: white;
                  font-size: 1rem;
                  font-weight: bold;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                  margin-top: 1rem;
                }
                .verify-btn:hover:not(:disabled) {
                  background-color: #e69500;
                }
                .verify-btn:disabled {
                  background-color: #ccc;
                  cursor: not-allowed;
                }
                .error-message {
                  color: #d93025;
                  margin-top: 1rem;
                }
                .back-link {
                  margin-top: 1.5rem;
                  font-size: 0.9rem;
                }
                .back-link a {
                  color: #007BFF;
                  text-decoration: none;
                  font-weight: bold;
                }
            `}</style>
        </>
    );
}

export default OTPForm;
