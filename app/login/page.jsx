"use client";

import styles from "./login_style.module.css"; // ✅ Importación correcta
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("usuario");
        const password = formData.get("password");

        try {
            const response = await fetch("https://sarten-backend.onrender.com/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("username", data.username);
            localStorage.setItem("password", password);
            window.location.href = "/";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className={styles["main-login"]}>
            <section className={styles["login-container"]}>
                <h2>Iniciar Sesión</h2>
                {error && <p className={styles["error-message"]}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles["login-form"]}>
                    <label htmlFor="usuario">Usuario:</label>
                    <input type="text" id="usuario" name="usuario" required className={styles["input-field"]} />

                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required className={styles["input-field"]} />

                    <div className={styles["button-group"]}>
                        <button type="submit" className="cta-button">Iniciar Sesión</button>
                        <button type="button" className="cta-button" onClick={() => router.push("/register")}>Registrarse</button>
                        <button type="button" className="cta-button" onClick={() => router.push("/")}>Volver</button>
                    </div>
                </form>
            </section>
        </main>
    );
}
