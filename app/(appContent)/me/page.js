"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InitTemplate from "francisco/components/InitTemplate/InitTemplate";
import { getProfile, changePassword } from "./utils";
import styles from "./page.module.css";



export default function UserProfile() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token-jwt");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await getProfile(token);
                if (response.ok) {
                    const details = await response.json();
                    setUserDetails(details);
                } else {
                    throw new Error("Error al obtener los datos del usuario");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);


    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const formData = new FormData(e.target);
        const oldPassword = formData.get('oldPassword');
        const newPassword = formData.get('newPassword');

        try {
            const token = localStorage.getItem("token-jwt");
            const storedPassword = localStorage.getItem("password")
            
            if (oldPassword !== storedPassword) {
                setMessage("La contraseña actual no es correcta");
            return;
            }

            const response = await changePassword(token, oldPassword, newPassword);

            if (response.ok) {
                setMessage("Contraseña actualizada correctamente");
                e.target.reset(); // Limpia el formulario
            } else {
                const data = await response.json();
                throw new Error(data.message || "Error al cambiar la contraseña");
            }
        } catch (err) {
            setError(err.message);
        }
    };



    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userDetails) return <div>Usuario no encontrado</div>;

    return (
        <InitTemplate>
            <h1>Mi Perfil</h1>
            <p><strong>Usuario:</strong> {userDetails.username}</p>
            <p><strong>Nombre:</strong> {userDetails.first_name} {userDetails.last_name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Localidad:</strong> {userDetails.locality}</p>
            <p><strong>Municipio:</strong> {userDetails.municipality}</p>
            <h1>Cambiar Contraseña</h1>
            <form onSubmit={handlePasswordChange} className={styles.form}>
                <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    required
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    required
                    minLength={8}
                />
                {message && <p className={styles.success}>{message}</p>}
                <button type="submit">
                    Cambiar Contraseña
                </button>
            </form>
        </InitTemplate>

    );
}