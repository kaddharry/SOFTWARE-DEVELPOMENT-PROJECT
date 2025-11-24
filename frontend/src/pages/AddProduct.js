import React, { useState, useEffect, useRef } from 'react';
// Fixed ESLint warnings
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, Image as ImageIcon, MessageSquare, Tag, Hash, CheckCircle, Mic, Square, Loader, Sparkles, Globe, AlertCircle, Eye } from 'lucide-react';

const ProgressBar = ({ step, totalSteps }) => {
    const progress = Math.min(100, Math.max(0, ((step - 1) / (totalSteps - 1)) * 100));
    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'kn', name: 'Kannada (कन्नड़)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' },
];

function AddProduct() {
    const [step, setStep] = useState(0); // 0=Mode, 0.2=Lang, 0.5=Record
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    // Voice Mode State
    // Removed unused isVoiceMode state
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const navigate = useNavigate();
    const totalSteps = 6; // Name, Image, Desc, Price, Qty, Preview

    useEffect(() => {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
            setCurrentUser(JSON.parse(savedData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // --- Voice Recording Logic ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop()); // Stop mic
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const analyzeAudio = async () => {
        if (!audioBlob) return;
        setIsAnalyzing(true);
        setError('');
        setMissingFields([]);

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('audio', audioBlob, 'recording.webm');
            formDataPayload.append('language', selectedLanguage);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/voice/analyze`, {
                method: 'POST',
                body: formDataPayload,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Analysis failed");

            // Pre-fill form
            const newFormData = {
                ...formData,
                name: data.name || '',
                description: data.description || '',
                price: data.price ? String(data.price) : '',
                quantity: data.quantity ? String(data.quantity) : '',
            };
            setFormData(newFormData);

            // Check for missing fields
            const missing = [];
            if (!data.name) missing.push('Name');
            if (!data.price) missing.push('Price');
            if (!data.quantity) missing.push('Quantity');
            if (!data.description) missing.push('Description');

            if (missing.length > 0) {
                setMissingFields(missing);
                setStep(0.8); // Missing Fields Step
            } else {
                // All good, go to Image Upload (Step 2)
                setStep(2); 
            }

        } catch (err) {
            setError("Failed to analyze audio. Please try again or use manual mode.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };
    // -----------------------------

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        if (!formData.name || !formData.description || !formData.price || !formData.quantity || !imageFile) {
            setError("Please make sure all fields are filled out before finishing.");
            setIsLoading(false);
            return;
        }

        try {
            const imageFormData = new FormData();
            imageFormData.append('image', imageFile);

            const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
                method: 'POST',
                body: imageFormData,
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.message || 'Image upload failed.');
            
            const { imageUrl } = uploadData;

            const productData = {
                ...formData,
                imageUrl: imageUrl,
                sellerId: currentUser._id
            };

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setStep(totalSteps + 1); // Success step
        } catch (err) {
            setError(err.message || "Failed to add product.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 0: // Mode Selection
                return (
                    <div className="step-content mode-selection">
                        <h2>How would you like to add your product?</h2>
                        <div className="mode-options">
                            <div className="mode-card" onClick={() => { setStep(0.2); }}>
                                <div className="icon-circle voice"><Mic size={32} /></div>
                                <h3>Voice Assistant</h3>
                                <p>Describe your product and let AI fill the details.</p>
                            </div>
                            <div className="mode-card" onClick={() => { setStep(1); }}>
                                <div className="icon-circle manual"><Type size={32} /></div>
                                <h3>Manual Entry</h3>
                                <p>Fill out the form step-by-step yourself.</p>
                            </div>
                        </div>
                    </div>
                );
            case 0.2: // Language Selection
                return (
                    <div className="step-content">
                        <Globe size={48} className="header-icon" />
                        <h2>Select Language</h2>
                        <p>Which language will you be speaking in?</p>
                        <select 
                            className="language-select" 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                        <button className="action-btn" style={{marginTop: '20px'}} onClick={() => setStep(0.5)}>Continue</button>
                    </div>
                );
            case 0.5: // Voice Recording Step
                return (
                    <div className="step-content voice-step">
                        <Sparkles size={48} className="header-icon ai-icon" />
                        <h2>Describe your product</h2>
                        <div className="prompt-box">
                            <p>Please mention:</p>
                            <ul>
                                <li>Product Name</li>
                                <li>Price</li>
                                <li>Quantity (Stock)</li>
                                <li>Description</li>
                            </ul>
                        </div>
                        
                        <div className="recording-container">
                            {!isRecording && !audioBlob && (
                                <button className="record-btn" onClick={startRecording}>
                                    <Mic size={24} /> Start Recording
                                </button>
                            )}
                            {isRecording && (
                                <button className="stop-btn" onClick={stopRecording}>
                                    <Square size={24} /> Stop Recording
                                </button>
                            )}
                            {!isRecording && audioBlob && (
                                <div className="audio-review">
                                    <p>Recording saved!</p>
                                    <button className="record-btn secondary" onClick={() => setAudioBlob(null)}>
                                        Record Again
                                    </button>
                                </div>
                            )}
                        </div>

                        {isAnalyzing && (
                            <div className="analyzing-loader">
                                <Loader className="spin" />
                                <p>Analyzing your voice...</p>
                            </div>
                        )}
                    </div>
                );
            
            case 0.8: // Missing Fields Alert
                return (
                    <div className="step-content">
                        <AlertCircle size={48} className="header-icon error-icon" style={{color: '#d93025'}} />
                        <h2>Some details were missed</h2>
                        <p>We couldn't catch the following:</p>
                        <div className="missing-tags">
                            {missingFields.map(field => <span key={field} className="missing-tag">{field}</span>)}
                        </div>
                        <div className="missing-actions">
                            <button className="action-btn secondary" onClick={() => { setAudioBlob(null); setStep(0.5); }}>Start Over</button>
                            <button className="action-btn" onClick={() => setStep(1)}>Fill Manually</button>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="step-content">
                        <Type size={48} className="header-icon" />
                        <h2>What is the product's name?</h2>
                        <input name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="e.g., Hand-Painted Ceramic Vase" />
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <ImageIcon size={48} className="header-icon" />
                        <h2>Upload a photo</h2>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="image-input"/>
                        {previewImage && <img src={previewImage} alt="Product preview" className="image-preview" />}
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <MessageSquare size={48} className="header-icon" />
                        <h2>Describe your product</h2>
                        <textarea name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="e.g., Made with locally sourced clay..." rows="4"></textarea>
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <Tag size={48} className="header-icon" />
                        <h2>Set a price (in ₹)</h2>
                        <input name="price" type="number" value={formData.price || ''} onChange={handleInputChange} placeholder="e.g., 1200" />
                    </div>
                );
            case 5:
                return (
                    <div className="step-content">
                        <Hash size={48} className="header-icon" />
                        <h2>How many do you have?</h2>
                        <input name="quantity" type="number" value={formData.quantity || ''} onChange={handleInputChange} placeholder="e.g., 10" />
                    </div>
                );
            case 6: // Preview Step
                return (
                    <div className="step-content preview-step">
                        <Eye size={48} className="header-icon" />
                        <h2>Preview Product</h2>
                        <div className="product-preview-card">
                            {previewImage && <img src={previewImage} alt="Preview" className="preview-card-img" />}
                            <div className="preview-details">
                                <h3>{formData.name}</h3>
                                <p className="preview-price">₹{formData.price}</p>
                                <p className="preview-desc">{formData.description}</p>
                                <p className="preview-stock">Stock: {formData.quantity}</p>
                            </div>
                        </div>
                    </div>
                );

            case 7: // Success screen
                return (
                    <div className="success-container">
                        <CheckCircle size={60} className="success-icon" />
                        <h2>Product Added!</h2>
                        <p>Your new product is now listed in your shop.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    // Helper to check if current step is valid for Manual Mode
    const isStepValid = () => {
        if (step === 1) return formData.name.trim() !== '';
        if (step === 2) return imageFile !== null;
        if (step === 3) return formData.description.trim() !== '';
        if (step === 4) return formData.price !== '';
        if (step === 5) return formData.quantity !== '';
        return true;
    };

    return (
        <>
            <div className="add-product-container">
                <div className="add-product-box">
                    {step <= totalSteps && step >= 1 && (
                        <div className="wizard-header">
                            <button onClick={prevStep} className="back-btn"><ArrowLeft /></button>
                            <ProgressBar step={step} totalSteps={totalSteps} />
                        </div>
                    )}
                    {step < 1 && (
                        <div className="wizard-header">
                             <button onClick={() => step === 0 ? navigate(-1) : prevStep()} className="back-btn"><ArrowLeft /></button>
                             <span style={{marginLeft: '10px', fontWeight: 'bold', color: '#555'}}>Add New Product</span>
                        </div>
                    )}

                    <div className="wizard-content">
                        {renderStepContent()}
                    </div>

                    {step <= totalSteps && step >= 1 && (
                        <div className="wizard-footer">
                            {error && <p className="error-message">{error}</p>}
                            {step < totalSteps && (
                                <button 
                                    onClick={nextStep} 
                                    className="action-btn" 
                                    disabled={!isStepValid()}
                                >
                                    Next
                                </button>
                            )}
                            {step === totalSteps && (
                                <button onClick={handleSubmit} className="action-btn" disabled={isLoading}>
                                    {isLoading ? "Publishing..." : "Publish Product"}
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Special Footer for Voice Step */}
                    {step === 0.5 && (
                         <div className="wizard-footer">
                            {error && <p className="error-message">{error}</p>}
                            <button onClick={analyzeAudio} className="action-btn" disabled={!audioBlob || isAnalyzing}>
                                {isAnalyzing ? "Processing..." : "Analyze & Continue"}
                            </button>
                         </div>
                    )}

                    {step > totalSteps && (
                         <div className="wizard-footer">
                            <button onClick={() => navigate('/my-products')} className="action-btn">View All Products</button>
                         </div>
                    )}
                </div>
            </div>
            <style>{`
                .add-product-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f4f8; font-family: sans-serif; padding: 20px; }
                .add-product-box { width: 100%; max-width: 500px; background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); overflow: hidden; display: flex; flex-direction: column; min-height: 550px; }
                .wizard-header { display: flex; align-items: center; padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; }
                .back-btn { background: none; border: none; cursor: pointer; color: #555; padding: 5px; display: flex; align-items: center; justify-content: center; }
                .progress-bar-container { flex-grow: 1; height: 8px; background-color: #e9ecef; border-radius: 4px; margin: 0 15px; }
                .progress-bar { height: 100%; background-color: #007BFF; border-radius: 4px; transition: width 0.4s ease; }
                .wizard-content { padding: 2rem; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; box-sizing: border-box; }
                .header-icon { color: #007BFF; margin-bottom: 1rem; }
                .step-content { width: 100%; }
                .step-content h2 { color: #003366; margin-top: 0; font-size: 1.5rem; margin-bottom: 0.5rem; }
                .step-content p { color: #666; margin-bottom: 1.5rem; }
                .step-content input, .step-content textarea, .language-select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box; font-size: 1rem; }
                .image-input { margin-top: 1rem; }
                .image-preview { max-width: 100%; max-height: 150px; height: auto; margin-top: 1rem; border-radius: 8px; }
                .wizard-footer { padding: 20px; background-color: #f8f9fa; text-align: right; border-top: 1px solid #dee2e6; }
                .action-btn { padding: 12px 30px; border: none; border-radius: 8px; background-color: #007BFF; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background 0.2s; }
                .action-btn:disabled { background-color: #a0c4ff; cursor: not-allowed; }
                .action-btn.secondary { background-color: white; color: #007BFF; border: 1px solid #007BFF; margin-right: 10px; }
                .error-message { color: #d93025; text-align: center; margin-bottom: 10px; }
                .success-container { text-align: center; }
                .success-icon { color: #28a745; margin-bottom: 1rem; }
                
                /* Mode Selection Styles */
                .mode-options { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
                .mode-card { background: #f8f9fa; border: 2px solid transparent; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; text-align: center; }
                .mode-card:hover { border-color: #007BFF; background: #eef5ff; transform: translateY(-2px); }
                .icon-circle { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; }
                .icon-circle.voice { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                .icon-circle.manual { background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%); }
                .mode-card h3 { margin: 0 0 10px; font-size: 1.1rem; color: #333; }
                .mode-card p { font-size: 0.85rem; margin: 0; color: #666; }

                /* Voice Recording Styles */
                .ai-icon { color: #764ba2; }
                .prompt-box { background: #f0f7ff; padding: 15px; border-radius: 8px; text-align: left; margin-bottom: 20px; border-left: 4px solid #007BFF; }
                .prompt-box p { margin: 0 0 5px; font-weight: bold; color: #0056b3; }
                .prompt-box ul { margin: 0; padding-left: 20px; color: #333; }
                .recording-container { display: flex; flex-direction: column; align-items: center; gap: 15px; margin-top: 10px; }
                .record-btn { display: flex; align-items: center; gap: 10px; padding: 15px 30px; border-radius: 50px; border: none; background: #d93025; color: white; font-size: 1.1rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(217, 48, 37, 0.3); transition: transform 0.1s; }
                .record-btn:active { transform: scale(0.95); }
                .record-btn.secondary { background: #6c757d; box-shadow: none; font-size: 0.9rem; padding: 10px 20px; }
                .stop-btn { display: flex; align-items: center; gap: 10px; padding: 15px 30px; border-radius: 50px; border: none; background: #333; color: white; font-size: 1.1rem; font-weight: bold; cursor: pointer; animation: pulse 2s infinite; }
                .analyzing-loader { margin-top: 20px; color: #764ba2; font-weight: bold; }
                .spin { animation: spin 1s linear infinite; margin-bottom: 10px; }

                /* Missing Fields Styles */
                .missing-tags { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 20px; }
                .missing-tag { background: #ffebee; color: #c62828; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem; font-weight: bold; }
                .missing-actions { display: flex; justify-content: center; gap: 10px; }

                /* Preview Styles */
                .product-preview-card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .preview-card-img { width: 100%; height: 200px; object-fit: cover; }
                .preview-details { padding: 15px; }
                .preview-details h3 { margin: 0 0 5px; font-size: 1.2rem; color: #333; }
                .preview-price { font-size: 1.1rem; font-weight: bold; color: #28a745; margin: 0 0 10px; }
                .preview-desc { font-size: 0.9rem; color: #666; margin-bottom: 10px; line-height: 1.4; }
                .preview-stock { font-size: 0.8rem; color: #999; margin: 0; }

                @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(51, 51, 51, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(51, 51, 51, 0); } 100% { box-shadow: 0 0 0 0 rgba(51, 51, 51, 0); } }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}

export default AddProduct;
