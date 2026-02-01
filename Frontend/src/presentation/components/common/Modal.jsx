import React from 'react';
import { X } from 'lucide-react';

/**
 * 再利用可能なモーダルコンポーネント
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
