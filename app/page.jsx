"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import "../public/styles/index_styles.css"; 
import { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch("https://sarten-backend.onrender.com/api/users/profile/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        setUsername(data.username);
    });
}, []);



  return (
    <main className="main-index">
      <header className="hero">
        <h1>Bienvenido a SartenAuctions</h1>
        <p>
          Compra y vende los mejores sartenes del mundo en nuestra plataforma de
          subastas.
        </p>
        <nav>
          <a href="/finder" className="cta-button-info">
            Explorar Subastas
          </a>
          <a href="#" className="cta-button-info">
            Vender una Sartén
          </a>
          {username && (
                        <a className="cta-button-info" onClick={() => router.push("/user")}>
                            Bienvenido {username}
                        </a>
                    )}
        </nav>
      </header>
      <section className="featured-auctions">
        <h2>Sartenes Destacadas</h2>
        <section className="auction-grid">
          <article className="auction-item">
            <figure>
              <Image src="/img/sarten1.jpg" alt="Sartén antiadherente" width={300} height={200} />
              <figcaption>Sartén de Hierro Fundido</figcaption>
            </figure>
            <p className="price">Precio actual: $50</p>
            <a href="/detalle/1" className="cta-button-bid">
              Pujar
            </a>
          </article>
          <article className="auction-item">
            <figure>
              <Image src="/img/sarten2.jpg" alt="Sartén antiadherente" width={300} height={200} />
              <figcaption>Sartén Antiadherente Premium</figcaption>
            </figure>
            <p className="price">Precio actual: $35</p>
            <a href="/detalle/2" className="cta-button-bid">
              Pujar
            </a>
          </article>
          <article className="auction-item">
            <figure>
              <Image src="/img/sarten3.jpg" alt="Sartén antiadherente" width={300} height={200} />
              <figcaption>Sartén de Cobre Profesional</figcaption>
            </figure>
            <p className="price">Precio actual: $75</p>
            <a href="/detalle/3" className="cta-button-bid">
              Pujar
            </a>
          </article>
        </section>
      </section>
      <aside className="info-section">
        <h2>¿Cómo Funciona?</h2>
        <p>
          Regístrate, explora subastas y haz tu oferta para ganar los mejores
          sartenes del mercado.
        </p>
        <a href="#" className="cta-button">
          Aprender Más
        </a>
      </aside>
      <section className="no-auctions">
        <p>No hay subastas activas en este momento. ¡Vuelve pronto!</p>
      </section>
    </main>
  );
}

