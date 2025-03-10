"use client";

import styles from "./register_style.module.css"; 
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        locality: "",
        municipality: "",
    });

    const [comunidad, setComunidad] = useState("");
    const [ciudades, setCiudades] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const ciudadesPorComunidad = {
        Madrid: ["Madrid"],
        Cataluña: ["Barcelona", "Girona", "Lleida", "Tarragona"],
        Andalucía: ["Sevilla", "Málaga", "Granada", "Córdoba"],
        Valencia: ["Valencia", "Alicante", "Castellón"],
        Galicia: ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
        "País Vasco": ["Bilbao", "San Sebastián", "Vitoria"],
        "Castilla y León": ["Valladolid", "Salamanca", "León"],
        "Castilla-La Mancha": ["Toledo", "Albacete", "Ciudad Real"],
        Canarias: ["Las Palmas", "Santa Cruz de Tenerife"],
        Aragón: ["Zaragoza", "Huesca", "Teruel"],
        Extremadura: ["Mérida", "Badajoz", "Cáceres"],
        Baleares: ["Palma de Mallorca", "Ibiza", "Menorca"],
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const cargarCiudades = (e) => {
        const selectedComunidad = e.target.value;
        setComunidad(selectedComunidad);
        setFormData({ ...formData, locality: selectedComunidad });
        setCiudades(ciudadesPorComunidad[selectedComunidad] || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        const formattedDate = formData.birth_date.split("/").reverse().join("-");
    
        try {
            const response = await fetch("https://das-p2-backend.onrender.com/api/users/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    birth_date: formattedDate, 
                    locality: formData.locality,
                    municipality: formData.municipality,
                }),
            });
    
            const data = await response.json();
            console.log("Respuesta del backend:", data); 
    
            if (!response.ok) {
                throw new Error(data.detail || "Error en el registro. Verifica los datos.");
            }
    
            setSuccess("Registro exitoso. Redirigiendo a login...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <main className={styles["main-register"]}>
            <section className={styles["register-container"]}>
                <h2>Registro de Usuario</h2>

                {error && <p className={styles["error-message"]}>{error}</p>}
                {success && <p className={styles["success-message"]}>{success}</p>}

                <form onSubmit={handleSubmit} className={styles["register-form"]}>
                    <label htmlFor="username">Usuario:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                    <label htmlFor="email">Correo Electrónico:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required pattern="^[a-zA-Z0-9._%+-]+@comillas\.edu$" />

                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                    <label htmlFor="first_name">Nombre:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />

                    <label htmlFor="last_name">Apellidos:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />

                    <label htmlFor="birth_date">Fecha de Nacimiento:</label>
                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />

                    <label htmlFor="comunidad">Comunidad Autónoma:</label>
                    <select id="comunidad" name="comunidad" onChange={cargarCiudades} required>
                        <option value="">Seleccione una comunidad</option>
                        {Object.keys(ciudadesPorComunidad).map((com) => (
                            <option key={com} value={com}>{com}</option>
                        ))}
                    </select>

                    <label htmlFor="municipality">Ciudad:</label>
                    <select name="municipality" value={formData.municipality} onChange={handleChange} required>
                        <option value="">Seleccione una ciudad</option>
                        {ciudades.map((ciudad) => (
                            <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                    </select>

                    <div className={styles["button-group"]}>
                        <button type="submit" className="cta-button">Registrarse</button>
                        <button type="button" className="cta-button" onClick={() => router.push("/")}>Volver</button>
                    </div>
                </form>
            </section>
        </main>
    );
}
