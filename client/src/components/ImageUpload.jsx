import { useState } from 'react';
import api from '../api';
import '../styles/ImageUpload.css';

export default function ImageUpload({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await uploadImage(file);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setPreview(base64);
        
        const { data } = await api.post('/api/upload', {
          file: base64,
          fileName: file.name
        });
        
        onUpload(data.url);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('فشل رفع الصورة');
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="preview">
            <img src={preview} alt="Preview" />
            <button 
              onClick={() => { setPreview(null); onUpload(''); }} 
              className="btn-remove"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            {uploading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>جاري الرفع...</p>
              </div>
            ) : (
              <>
                <div className="upload-icon">📸</div>
                <p>اسحب الصورة هنا</p>
                <p className="or">أو</p>
                <label className="btn-browse">
                  اختر صورة
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
