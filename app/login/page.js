"use client"

import InitTemplate from "francisco/components/InitTemplate/InitTemplate";
import Link from "next/link";
import styles from "./page.module.css"
import { doLogin, getProfile} from "./utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const username = formData.get("username");
    const password = formData.get("password");

    setLoading(true);
    try {
      const userLogged = await doLogin(username, password);
      if (userLogged.error) {
        alert(userLogged.error);
        return;
      }

      
      const profile = await getProfile(userLogged.access);
      if (profile.error) {
        alert(profile.error);
        return;
      }

      localStorage.setItem("token-jwt", userLogged.access);
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      localStorage.setItem("id", profile.id);

      // console.log(profile.id);



      router.push("/auctions");
    } catch {
      alert("Algo salio mal!");
    } finally {
      setLoading(false);
    }
  };

  return (
  <InitTemplate>
    <h1>Bienvenido! Inicia sesión</h1>
    <form className={styles.loginForm} onSubmit={handleOnSubmit}>
      <input type= "text" name="username"/>
      <input type= "password" name="password"/>
      {loading ? <p>Espere, por favor...</p> : <button type= "submit">Login</button>}
    </form>
    <p>
      No tienes cuenta? <Link href="/register">Registrate</Link>
    </p>
    <Link href="/">Volver</Link>
  </InitTemplate>
  );
}
