import React from 'react';

/**
 * 再利用可能なボタンコンポーネント
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  disabled = false,
  type = 'button',
  onClick,
  className = ''
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'medium' ? `btn-${size}` : '';
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

/**
 * アイコンボタンコンポーネント
 */
export const IconButton = ({
  icon: Icon,
  onClick,
  disabled = false,
  className = '',
  size = 16
}) => {
  return (
    <button
      type="button"
      className={`btn-icon ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={size} />
    </button>
  );
};

export default Button;
