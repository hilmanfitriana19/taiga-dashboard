import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  variant, 
  title, 
  message, 
  onClose,
  className = '' 
}) => {
  const variantStyles = {
    success: {
      container: 'bg-green-900/20 border-green-800 text-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />
    },
    error: {
      container: 'bg-red-900/20 border-red-800 text-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />
    },
    warning: {
      container: 'bg-amber-900/20 border-amber-800 text-amber-200',
      icon: <AlertCircle className="h-5 w-5 text-amber-400" />
    },
    info: {
      container: 'bg-blue-900/20 border-blue-800 text-blue-200',
      icon: <Info className="h-5 w-5 text-blue-400" />
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} ${className} flex items-start gap-3 rounded-lg border p-4`} role="alert">
      <div className="flex-shrink-0">{styles.icon}</div>
      <div className="flex-1">
        {title && <h3 className="font-medium">{title}</h3>}
        <p className={title ? "text-sm opacity-90" : ""}>{message}</p>
      </div>
      {onClose && (
        <button 
          type="button" 
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-1 hover:bg-white/10 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;