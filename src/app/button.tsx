import React from "react";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  style = {},
  disabled = false,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "#4f46e5",
      color: "white",
    },
    secondary: {
      backgroundColor: "white",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
    danger: {
      backgroundColor: "#dc2626",
      color: "white",
    },
    amber: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant] }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
