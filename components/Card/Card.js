import React from "react"
import styles from "./styles.module.css"

const Card = ({children, className}) => {
    return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default Card;