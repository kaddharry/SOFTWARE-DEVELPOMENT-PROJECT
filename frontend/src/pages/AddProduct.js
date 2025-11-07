import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, Image as ImageIcon, MessageSquare, Tag, Hash, CheckCircle } from 'lucide-react';

const ProgressBar = ({ step, totalSteps }) => {
    const progress = ((step - 1) / (totalSteps - 1)) * 100;
    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

function AddProduct() {
    const [step, setStep] = useState(1);
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
    const navigate = useNavigate();
    const totalSteps = 5; // Name, Image, Description, Price, Quantity

    useEffect(() => {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
            setCurrentUser(JSON.parse(savedData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps + 1));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

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

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        // **FIX**: Added validation for all fields before submitting.
        if (!formData.name || !formData.description || !formData.price || !formData.quantity || !imageFile) {
            setError("Please make sure all fields are filled out before finishing.");
            setIsLoading(false);
            return;
        }

        if (!currentUser || !currentUser._id) {
            setError("You must be logged in to add a product.");
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

            setStep(totalSteps + 1);
        } catch (err) {
            setError(err.message || "Failed to add product.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content">
                        <Type size={48} className="header-icon" />
                        <h2>What is the product's name?</h2>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Hand-Painted Ceramic Vase" />
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
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g., Made with locally sourced clay..." rows="4"></textarea>
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <Tag size={48} className="header-icon" />
                        <h2>Set a price (in ₹)</h2>
                        <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="e.g., 1200" />
                    </div>
                );
            case 5:
                return (
                    <div className="step-content">
                        <Hash size={48} className="header-icon" />
                        <h2>How many do you have?</h2>
                        <input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="e.g., 10" />
                    </div>
                );
            case 6: // Success screen
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

    return (
        <>
            <div className="add-product-container">
                <div className="add-product-box">
                    {step <= totalSteps && (
                        <div className="wizard-header">
                            {step > 1 && <button onClick={prevStep} className="back-btn"><ArrowLeft /></button>}
                            <ProgressBar step={step} totalSteps={totalSteps} />
                        </div>
                    )}

                    <div className="wizard-content">
                        {renderStepContent()}
                    </div>

                    {step <= totalSteps && (
                        <div className="wizard-footer">
                            {error && <p className="error-message">{error}</p>}
                            {step < totalSteps && <button onClick={nextStep} className="action-btn">Next</button>}
                            {step === totalSteps && <button onClick={handleSubmit} className="action-btn" disabled={isLoading}>{isLoading ? "Saving..." : "Finish & Add Product"}</button>}
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
                .add-product-box { width: 100%; max-width: 500px; background: white; border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); overflow: hidden; display: flex; flex-direction: column; }
                .wizard-header { display: flex; align-items: center; padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; }
                .back-btn { background: none; border: none; cursor: pointer; color: #555; padding: 5px; display: flex; align-items: center; justify-content: center; }
                .progress-bar-container { flex-grow: 1; height: 8px; background-color: #e9ecef; border-radius: 4px; margin: 0 15px; }
                .progress-bar { height: 100%; background-color: #007BFF; border-radius: 4px; transition: width 0.4s ease; }
                .wizard-content { padding: 2.5rem; text-align: center; flex-grow: 1; }
                .header-icon { color: #007BFF; margin-bottom: 1rem; }
                .step-content h2 { color: #003366; margin-top: 0; }
                .step-content p { color: #666; margin-bottom: 1.5rem; }
                .step-content input, .step-content textarea { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box; font-size: 1rem; }
                .image-input { margin-top: 1rem; }
                .image-preview { max-width: 100%; max-height: 150px; height: auto; margin-top: 1rem; border-radius: 8px; }
                .wizard-footer { padding: 20px; background-color: #f8f9fa; text-align: right; border-top: 1px solid #dee2e6; }
                .action-btn { padding: 12px 30px; border: none; border-radius: 8px; background-color: #007BFF; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; }
                .error-message { color: #d93025; text-align: center; margin-bottom: 10px; }
                .success-container { text-align: center; }
                .success-icon { color: #28a745; margin-bottom: 1rem; }
            `}</style>
        </>
    );
}

export default AddProduct;
