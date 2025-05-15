import React from "react";
import styles from "./styles.module.css"

const Button = ({className, label, onClick, type}) => {
    return (
        <button
            className={`${styles.button} ${className}`}
            onClick={onClick}
            type={type}
        >
            {label}
        </button>
    );
};

export default Button;