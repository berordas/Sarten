"use client"

import InitTemplate from "francisco/components/InitTemplate/InitTemplate";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProvinceLocalitySelector from "./(partials)/ProvinceLocalitySelector";
import { doRegister, validatePassword } from "./utils";


export default function Register() {
  const [province, setProvince] = useState("")
  const [locality, setLocality] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter();

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setError("");
    
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const email = formData.get("email");
    const first_name = formData.get("name");
    const last_name = formData.get("lastName");
    const birth_date = formData.get("birthDate");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const userLogged = await doRegister(
        username, 
        email, 
        password, 
        first_name, 
        last_name, 
        birth_date, 
        locality, 
        province
      );

      if (userLogged.error) {
        setError(userLogged.error);
        return;
      }

      router.push("/auctions");
    } catch (err) {
      setError("Error al conectar con el servidor. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InitTemplate>
      <h1>Crea tu usuario</h1>
      <form className={styles.loginForm} onSubmit={handleOnSubmit}>
        <input type="text" placeholder="Usuario" name="username" required />
        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          name="confirmPassword"
          required
        />
        <input type="email" placeholder="Email" name="email" required />
        <input type="text" placeholder="Nombre" name="name" required />
        <input type="text" placeholder="Apellido" name="lastName" required />
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          name="birthDate"
          required
        />
        <ProvinceLocalitySelector 
            province={province}
            setProvince={setProvince}
            locality={locality}
            setLocality={setLocality}
        />
        {error && <p>{error}</p>}
        {loading ? <p>Espere, por favor...</p> : <button type="submit">Registrar</button>}
      </form>
      <p>
        ¿Tienes una cuenta? <Link href="/login">Login</Link>
      </p>
      <Link href="/">Volver</Link>
    </InitTemplate>
  );
}