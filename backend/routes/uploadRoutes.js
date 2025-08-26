import express from 'express';
import upload from '../utils/cloudinary.js';

const router = express.Router();

// This route uses a custom function to wrap the middleware, providing better error handling.
router.post('/', (req, res) => {
  const uploader = upload.single('image');

  uploader(req, res, function (err) {
    if (err) {
      // This will catch any errors from multer or Cloudinary during the upload.
      console.error("--- IMAGE UPLOAD FAILED ---");
      console.error("Error Name:", err.name);
      console.error("Error Message:", err.message);
      console.error("---------------------------");
      return res.status(500).json({ message: 'Image upload failed.', error: err.message });
    }

    // If we get here, the upload was successful.
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    res.json({
      message: 'Image uploaded successfully!',
      imageUrl: req.file.path, // The URL of the image on Cloudinary
    });
  });
});

export default router;
