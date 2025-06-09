import React from 'react';
import classes from './spinner.module.css';

const Spinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '',
  text = '',
  overlay = false 
}) => {
  const sizeClasses = {
    small: classes.small,
    medium: classes.medium,
    large: classes.large
  };

  const colorClasses = {
    primary: classes.primary,
    secondary: classes.secondary,
    white: classes.white,
    dark: classes.dark
  };

  const spinnerContent = (
    <div className={`${classes.spinnerContainer} ${className}`}>
      <div 
        className={`${classes.spinner} ${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <div className={classes.ring}></div>
        <div className={classes.ring}></div>
        <div className={classes.ring}></div>
        <div className={classes.ring}></div>
      </div>
      {text && <p className={classes.text}>{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className={classes.overlay}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default Spinner;