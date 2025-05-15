import React from "react"; 
import styles from "./styles.module.css"

const Footer = () => {
    return (
        <footer className={styles.footer}>
            SartenAuctions, derechos reservados {new Date().getFullYear()}
        </footer>
    ); 
}

export default Footer;