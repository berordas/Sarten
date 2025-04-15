"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../public/styles/index_styles.css"; 
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // Obtener datos del usuario
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

    // Obtener subastas
    fetch("https://sarten-backend.onrender.com/api/auctions/")
    .then((res) => res.json())
    .then((data) => {
      // Obtener 3 subastas aleatorias
      const allAuctions = data.results || [];
      const randomAuctions = [];
      const totalAuctions = allAuctions.length;
      
      if (totalAuctions > 0) {
        // Obtener 3 índices aleatorios únicos
        const indices = new Set();
        while (indices.size < Math.min(3, totalAuctions)) {
          indices.add(Math.floor(Math.random() * totalAuctions));
        }
        
        // Obtener las subastas correspondientes a esos índices
        indices.forEach(index => {
          randomAuctions.push(allAuctions[index]);
        });
      }
      
      setSubastas(randomAuctions);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error al obtener subastas:", error);
      setLoading(false);
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
          {username && (
            <a href="/auction" className="cta-button-info">
              Vender una Sartén
            </a>
          )}
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
          {loading ? (
            <p>Cargando subastas...</p>
          ) : subastas.length > 0 ? (
            subastas.map((subasta) => (
              <article key={subasta.id} className="auction-item">
                <figure>
                  <Image 
                    src={subasta.thumbnail || "/img/placeholder.jpg"} 
                    alt={`Imagen de ${subasta.title}`}
                    width={300} 
                    height={200} 
                  />
                  <figcaption>{subasta.title}</figcaption>
                </figure>
                
                  <a href={username ? `/detalle/${subasta.id}` : "/login"} className="cta-button-bid">
                    Pujar
                  </a>
              </article>
            ))
          ) : (
            <p>No hay subastas disponibles en este momento.</p>
          )}
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
    </main>
  );
}

