import React from "react";
import styles from "./styles.module.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const PageTemplate = ({children}) => {
    return(
        <div className={styles.container}>
            <Header />
            <section className={styles.section}>{children}</section>
            <Footer />
        </div>
    );
};

export default PageTemplate;