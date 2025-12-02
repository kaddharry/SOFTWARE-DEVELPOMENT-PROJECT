import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, X, Edit, Trash2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Product Detail Modal for Seller
const SellerProductModal = ({ product, onClose, onEdit, onDelete }) => {
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={28} /></button>
                
                <div className="modal-image-container">
                    <div className="modal-image-bg" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                    <img src={product.imageUrl} alt={product.name} className="modal-image" />
                </div>

                <div className="modal-details">
                    <h2 className="modal-title">{product.name}</h2>
                    <p className="modal-price">₹{product.price}</p>
                    <p className="modal-stock">Stock: {product.quantity} units</p>
                    <p className="modal-category">Category: {product.category || 'General'}</p>
                    <p className="modal-description">{product.description}</p>
                    <div className="modal-actions">
                        <button className="modal-btn edit-btn" onClick={() => onEdit(product)}>
                            <Edit size={20} /> Edit Product
                        </button>
                        <button className="modal-btn delete-btn" onClick={() => onDelete(product)}>
                            <Trash2 size={20} /> Delete Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ product, onConfirm, onCancel }) => {
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <Trash2 size={48} className="confirm-icon" />
                <h2>Delete Product?</h2>
                <p>Are you sure you want to delete "<strong>{product.name}</strong>"?</p>
                <p className="warning-text">This action cannot be undone.</p>
                <p className="info-text">Note: Order history will be preserved for customers who already purchased this product.</p>
                <div className="confirm-actions">
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    <button className="confirm-delete-btn" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};

// Edit Product Modal
const EditProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        quantity: product?.quantity || '',
        imageUrl: product?.imageUrl || '',
        category: product?.category || 'General',
        description: product?.description || ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(product?.imageUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                quantity: product.quantity || '',
                imageUrl: product.imageUrl || '',
                category: product.category || 'General',
                description: product.description || ''
            });
            setPreviewImage(product.imageUrl || '');
            setImageFile(null);
        }
    }, [product]);

    if (!product) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let imageUrl = formData.imageUrl;

            // Upload new image if selected
            if (imageFile) {
                setIsUploadingImage(true);
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
                    method: 'POST',
                    body: imageFormData,
                });

                if (!uploadRes.ok) throw new Error("Failed to upload image");
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
                setIsUploadingImage(false);
            }

            await onSave(product._id, { ...formData, imageUrl });
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
            setIsUploadingImage(false);
        }
    };

    const CATEGORIES = ["Home Decor", "Jewelry", "Art", "Clothing", "Toys", "Accessories", "Kitchen", "General"];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={28} /></button>
                <h2 className="edit-modal-title">Edit Product</h2>
                
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={formData.quantity} 
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <div className="image-upload-container">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                id="edit-image-upload"
                                className="file-input"
                            />
                            <label htmlFor="edit-image-upload" className="file-input-label">
                                <Edit size={20} />
                                {imageFile ? 'Change Image' : 'Upload New Image'}
                            </label>
                        </div>
                        {previewImage && (
                            <img src={previewImage} alt="Preview" className="image-preview" />
                        )}
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <div className="category-grid-edit">
                            {CATEGORIES.map(cat => (
                                <div
                                    key={cat}
                                    className={`category-card-edit ${formData.category === cat ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={isSubmitting || isUploadingImage}>
                            {isUploadingImage ? 'Uploading Image...' : isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function MyProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyProducts = async () => {
            const savedData = localStorage.getItem("userData");
            if (!savedData) {
                navigate('/login');
                return;
            }
            const sellerId = JSON.parse(savedData)._id;

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/by-seller/${sellerId}`);
                if (!res.ok) throw new Error("Could not fetch your products.");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyProducts();
    }, [navigate]);

    const handleEdit = (product) => {
        setSelectedProduct(null);
        setEditProduct(product);
    };

    const handleSaveEdit = async (productId, formData) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/update/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Failed to update product");
            
            const data = await res.json();
            // Update local state
            setProducts(products.map(p => p._id === productId ? data.product : p));
            setEditProduct(null);
        } catch (err) {
            alert("Error updating product: " + err.message);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(null);
        setDeleteProduct(product);
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${deleteProduct._id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error("Failed to delete product");
            
            // Remove from local state
            setProducts(products.filter(p => p._id !== deleteProduct._id));
            setDeleteProduct(null);
        } catch (err) {
            alert("Error deleting product: " + err.message);
        }
    };

    return (
        <>
            <SellerProductModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />
            <EditProductModal 
                product={editProduct}
                onClose={() => setEditProduct(null)}
                onSave={handleSaveEdit}
            />
            <DeleteConfirmModal 
                product={deleteProduct}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteProduct(null)}
            />

            <div className="my-products-container">
                <div className="my-products-header">
                    <h1>Your Products</h1>
                    <Link to="/add-product" className="add-product-btn">
                        <PlusCircle size={20} />
                        <span>Add New Product</span>
                    </Link>
                </div>

                {isLoading && <p className="loading-message">Loading your products...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && !error && (
                    products.length > 0 ? (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard 
                                    key={product._id} 
                                    product={product}
                                    onClick={() => setSelectedProduct(product)}
                                    isSellerView={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products-message">
                            <h2>You haven't added any products yet.</h2>
                            <p>Click the "Add New Product" button to get started!</p>
                        </div>
                    )
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

                .my-products-container { 
                    padding: 30px 20px 100px; 
                    background: linear-gradient(-45deg, #f5f7ff, #fff5f8, #f0f9ff, #fef5ff);
                    background-size: 400% 400%;
                    animation: gradientShift 20s ease infinite;
                    font-family: 'Outfit', 'Inter', sans-serif; 
                    min-height: 100vh; 
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .my-products-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 40px;
                    max-width: 1280px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .my-products-header h1 { 
                    color: #667eea; 
                    margin: 0;
                    font-size: 2.5rem;
                    font-weight: 700;
                }
                .add-product-btn { 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    padding: 12px 24px; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white; 
                    text-decoration: none; 
                    border-radius: 50px; 
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }
                .add-product-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }

                .products-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
                    gap: 30px;
                    max-width: 1280px;
                    margin: 0 auto;
                }

                .no-products-message { 
                    text-align: center; 
                    padding: 60px; 
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    max-width: 600px;
                    margin: 50px auto;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }
                .no-products-message h2 {
                    color: #667eea;
                    margin-bottom: 10px;
                }

                .loading-message, .error-message { 
                    text-align: center; 
                    font-size: 1.2rem; 
                    color: #555; 
                    padding: 40px; 
                }
                .error-message { color: #d93025; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                }

                .modal-content {
                    background: white;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .modal-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    transition: all 0.2s;
                }
                .modal-close-btn:hover {
                    background: rgba(0, 0, 0, 0.7);
                    transform: rotate(90deg);
                }

                .modal-image-container {
                    position: relative;
                    width: 100%;
                    height: 300px;
                    overflow: hidden;
                    border-radius: 20px 20px 0 0;
                }

                .modal-image-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-size: cover;
                    background-position: center;
                    filter: blur(20px);
                    transform: scale(1.1);
                }

                .modal-image {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    z-index: 1;
                }

                .modal-details {
                    padding: 30px;
                }

                .modal-title {
                    font-size: 1.8rem;
                    color: #333;
                    margin: 0 0 10px;
                }

                .modal-price {
                    font-size: 1.5rem;
                    color: #667eea;
                    font-weight: 700;
                    margin: 0 0 10px;
                }

                .modal-stock, .modal-category {
                    font-size: 1rem;
                    color: #666;
                    margin: 5px 0;
                }

                .modal-description {
                    font-size: 1rem;
                    color: #555;
                    line-height: 1.6;
                    margin: 20px 0;
                }

                .modal-actions {
                    display: flex;
                    gap: clamp(10px, 2vw, 15px);
                    margin-top: 25px;
                    width: 100%;
                }

                .modal-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: clamp(6px, 1.5vw, 10px);
                    padding: clamp(12px, 3vw, 18px) clamp(16px, 4vw, 28px);
                    border: none;
                    border-radius: 12px;
                    font-size: clamp(0.85rem, 2.5vw, 1.05rem);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: 'Outfit', sans-serif;
                    min-height: clamp(48px, 10vw, 56px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .modal-btn svg {
                    flex-shrink: 0;
                    width: clamp(18px, 4vw, 22px);
                    height: clamp(18px, 4vw, 22px);
                }

                .edit-btn {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .edit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }

                .delete-btn {
                    background: #fff;
                    color: #dc3545;
                    border: 2px solid #dc3545;
                }

                .delete-btn:hover {
                    background: #dc3545;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
                }

                /* Confirmation Modal */
                .confirm-modal-content {
                    background: white;
                    border-radius: 20px;
                    max-width: 450px;
                    width: 100%;
                    padding: 40px;
                    text-align: center;
                    animation: slideUp 0.3s ease-out;
                }

                .confirm-icon {
                    color: #dc3545;
                    margin-bottom: 20px;
                }

                .confirm-modal-content h2 {
                    color: #333;
                    margin-bottom: 15px;
                }

                .confirm-modal-content p {
                    color: #666;
                    margin-bottom: 10px;
                    line-height: 1.5;
                }

                .warning-text {
                    color: #dc3545;
                    font-weight: 600;
                    margin-bottom: 25px !important;
                }

                .confirm-actions {
                    display: flex;
                    gap: 15px;
                }

                .cancel-btn, .confirm-delete-btn {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: 'Outfit', sans-serif;
                }

                .cancel-btn {
                    background: #f8f9fa;
                    color: #666;
                }

                .cancel-btn:hover {
                    background: #e9ecef;
                }

                .confirm-delete-btn {
                    background: #dc3545;
                    color: white;
                }

                .confirm-delete-btn:hover {
                    background: #c82333;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
                }

                .info-text {
                    color: #667eea;
                    font-size: 0.9rem;
                    font-weight: 500;
                    margin-bottom: 20px !important;
                }

                /* Edit Modal Styles */
                .edit-modal-content {
                    background: white;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 40px;
                    position: relative;
                    animation: slideUp 0.3s ease-out;
                }

                .edit-modal-title {
                    color: #667eea;
                    font-size: 2rem;
                    margin: 0 0 30px;
                    text-align: center;
                }

                .edit-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-weight: 600;
                    color: #333;
                    font-size: 0.95rem;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-family: 'Outfit', sans-serif;
                    transition: all 0.3s;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .image-upload-container {
                    margin-bottom: 10px;
                }

                .file-input {
                    display: none;
                }

                .file-input-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                    font-family: 'Outfit', sans-serif;
                }

                .file-input-label:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }

                .category-grid-edit {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 10px;
                }

                .category-card-edit {
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                    background: white;
                }

                .category-card-edit:hover {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.05);
                }

                .category-card-edit.selected {
                    border-color: #667eea;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    font-weight: 600;
                }

                .image-preview {
                    width: 100%;
                    max-height: 200px;
                    object-fit: contain;
                    border-radius: 12px;
                    margin-top: 10px;
                    border: 2px solid #e9ecef;
                }

                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                }

                .save-btn {
                    flex: 1;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: 'Outfit', sans-serif;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .save-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }

                .save-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .my-products-header {
                        flex-direction: column;
                        gap: 20px;
                        align-items: stretch;
                    }
                    .my-products-header h1 {
                        font-size: 2rem;
                        text-align: center;
                    }
                    .products-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }
                    .modal-actions {
                        flex-direction: column;
                        gap: 12px;
                    }
                    .modal-btn {
                        width: 100%;
                        font-size: clamp(0.9rem, 4vw, 1rem);
                        padding: 14px 20px;
                        min-height: 52px;
                    }
                    .modal-btn svg {
                        width: 20px;
                        height: 20px;
                    }
                    .modal-content {
                        margin: 10px;
                        max-width: calc(100vw - 20px);
                    }
                    .modal-details {
                        padding: 20px;
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    .edit-modal-content {
                        padding: 30px 20px;
                        margin: 10px;
                        max-width: calc(100vw - 20px);
                    }
                }

                @media (max-width: 480px) {
                    .modal-btn {
                        font-size: 0.9rem;
                        padding: 12px 16px;
                        gap: 8px;
                    }
                    .modal-btn svg {
                        width: 18px;
                        height: 18px;
                    }
                }
            `}</style>
        </>
    );
}

export default MyProducts;

