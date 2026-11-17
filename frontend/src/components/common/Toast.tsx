import React, { useEffect } from 'react';
import { ToastNotification } from '../../types';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

interface ToastProps {
  notification: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const duration = notification.duration ?? 4000;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const renderIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon success" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon warning" />;
      case 'error':
        return <XCircle size={18} className="toast-icon error" />;
      default:
        return <Info size={18} className="toast-icon info" />;
    }
  };

  return (
    <aside className="toast-container" aria-live="polite" aria-atomic="true">
      <div className={`toast-card toast-${notification.type}`} role="status">
        <div className="toast-gloss" aria-hidden="true" />
        <div className="toast-content-wrapper">
          <div className="toast-icon-slot">{renderIcon()}</div>
          <div className="toast-text-slot">
            {notification.title && <h3 className="toast-title">{notification.title}</h3>}
            <p className="toast-message">{notification.message}</p>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={onClose}
            aria-label="Tutup notifikasi"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

