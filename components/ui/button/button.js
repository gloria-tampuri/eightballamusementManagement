import React, { forwardRef } from "react";
import classes from "./button.module.css";

const AddButton = forwardRef(({ type, text, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`${classes.dialogTrigger} ${className || ""}`}
      {...props}
    >
      {text || type}
    </button>
  );
});

// Add this line to fix the error
AddButton.displayName = "AddButton";

export default AddButton;