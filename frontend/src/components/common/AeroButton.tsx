import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type AeroButtonVariant = 'primary' | 'video' | 'audio' | 'pill' | 'ghost';

export interface AeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AeroButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export const AeroButton: React.FC<AeroButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-aero-primary';
      case 'video':
        return 'btn-aero-video';
      case 'audio':
        return 'btn-aero-audio';
      case 'pill':
        return 'btn-glass-pill';
      case 'ghost':
        return 'btn-glass-ghost';
      default:
        return 'btn-aero-primary';
    }
  };

  return (
    <button
      className={`${getVariantClass()} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      <span className="aero-btn-gloss" aria-hidden="true" />
      {isLoading ? (
        <>
          <Loader2 size={16} className="spin" aria-hidden="true" />
          <span>{loadingText || 'Memproses...'}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

