"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./user_styles.module.css"; // ✅ Importación correcta

export default function UserProfile() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        locality: "",
        municipality: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch("https://sarten-backend.onrender.com/api/users/profile/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setUserData(data);
            setLoading(false);
        })
        .catch(() => {
            setError("Error al obtener los datos del usuario");
            setLoading(false);
        });
    }, [router]);


    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
        
    });
    const [message, setMessage] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = localStorage.getItem("accessToken");
        
        try {
            if (passwordData.currentPassword !== localStorage.getItem("password")) {
                setMessage('La contraseña actual es incorrecta');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setMessage('Las contraseñas no coinciden');
                return;
            }

            // Si la verificación es correcta, hacer el cambio de contraseña
            const changeResponse = await fetch("https://sarten-backend.onrender.com/api/users/change-password/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    old_password: localStorage.getItem("password"),
                    new_password: passwordData.newPassword
                })
            });

            if (changeResponse.ok) {
                setMessage('Contraseña actualizada correctamente');
                setPasswordData({ currentPassword: '', newPassword: '' });
            } else {
                setMessage('La contraseña es demasiado común');
            }
        } catch (error) {
            setMessage('Error de conexión');
        }
    };









    if (loading) return <p className={styles.loading}>Cargando datos...</p>;
    if (error) return <p className={styles.error}>Error: {error}</p>;

    return (
        <main className={styles["userContainer"]}>
            <section>
                <h2>Perfil de Usuario</h2>
                <div className={styles["userInfo"]}>
                    <p><strong>Usuario:</strong> {userData.username}</p>
                    <p><strong>Correo Electrónico:</strong> {userData.email}</p>
                    <p><strong>Nombre:</strong> {userData.first_name}</p>
                    <p><strong>Apellidos:</strong> {userData.last_name}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {userData.birth_date}</p>
                    <p><strong>Localidad:</strong> {userData.locality}</p>
                    <p><strong>Municipio:</strong> {userData.municipality}</p>
                </div>
                <div className={styles["buttonContainer"]}>
                    <button
                        type="button"
                        className="cta-button"
                        onClick={() => router.push("/user_auction")}
                    >
                        Mis subastas
                    </button>
                </div>
                <form className={styles["passwordForm"]} onSubmit={handlePasswordChange}>
                    <h3>Cambiar Contraseña</h3>
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                    />

                    {message && <p className={styles.message}>{message}</p>}
                    <button type="submit" className="cta-button">Cambiar Contraseña</button>
                </form>
                <div className={styles["buttonContainer"]}>
                    <button type="button" className="cta-button" onClick={() => router.push("/")}>Volver</button>
                </div>
            </section>
        </main>
    );
}
