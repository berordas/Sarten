"use client"

import React, { useState, useEffect } from "react"; 
import styles from "./styles.module.css"
import Link from "next/link";

const Header = () => {
    const [token, setToken] = useState(null)
    const [userName, setUserName] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("token-jwt");
        const storedUsername = localStorage.getItem("username");
        console.log("Stored username:", storedUsername);
        
        setToken(storedToken)
        setUserName(storedUsername)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token-jwt")
        localStorage.removeItem("username")
        localStorage.removeItem("password")
        localStorage.removeItem("id")
        setToken(null)
        setUserName(null)
    };

    return (
        <nav className={styles.header}>
            <Link href="/auctions" className={styles.linkStyle}>
                <h1>Sartén Auctions</h1>{" "}
            </Link>
            <div className={styles.actionContainer}>
                {token? (<>
                    <Link href="/create" className={styles.linkStyle}>
                        <p>Crear Subasta</p>
                    </Link>
                    <Link href="/myAuctions" className={styles.linkStyle}>
                        <p>Mis Subastas</p>
                    </Link>
                    <Link href="/myBids" className={styles.linkStyle}>
                        <p>Mis Pujas</p>
                    </Link>
                    </>):(<></>)}
            </div>

            <div className={styles.actionContainer}>
                {token ? (
                    <>
                    <Link href="/me" className={styles.linkStyle}>
                        <p>{userName}</p>
                    </Link>
                    <Link href="/auctions" className={styles.linkStyle} onClick={handleLogout}>
                        <p>Log Out</p>
                    </Link>
                    </>
                ) : (
                    <>
                    <Link href="/login" className={styles.linkStyle}>
                        <p>Login</p>
                    </Link>
                    <Link href="/register" className={styles.linkStyle}>
                        <p>Register</p>
                    </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;