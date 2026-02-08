import { useEffect } from 'react';
import '../styles/ImageModal.css';

export default function ImageModal({ image, name, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <img src={image} alt={name} />
        <p className="modal-title">{name}</p>
      </div>
    </div>
  );
}
