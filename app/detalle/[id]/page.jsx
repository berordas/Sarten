"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./auction_style.module.css";

export default function DetalleSubasta() {
  const { id } = useParams();
  const [subasta, setSubasta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubasta = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener la subasta");
        }

        const data = await response.json();
        setSubasta(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar la subasta");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubasta();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles["main-detalles"]}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !subasta) {
    return (
      <div className={styles["main-detalles"]}>
        <h1>Subasta no encontrada</h1>
        <p>{error}</p>
        <Link href="/finder">
          <button className="cta-button">Volver al buscador</button>
        </Link>
      </div>
    );
  }

  return (
    <main className={styles["main-detalles"]}>
      <Image 
        src={subasta.thumbnail || "/img/placeholder.jpg"} 
        alt={subasta.title} 
        width={300} 
        height={300} 
      />
      <h1>{subasta.title}</h1>
      <div className={styles.vendedor}>
        <p>Id_Vendedor: <span>{subasta.auctioneer}</span></p>
      </div>
      <p className={styles.descripcion}>{subasta.description}</p>
      <p className={styles.precio}>Precio actual: ${subasta.price}</p>
      <p className={styles.stock}>Stock disponible: {subasta.stock}</p>
      <p className={styles.brand}>Marca: {subasta.brand}</p>
      {subasta.rating && (
        <p className={styles.rating}>Valoración: {subasta.rating}</p>
      )}
      <p className={styles.closing}>
        Fecha de cierre: {new Date(subasta.closing_date).toLocaleString()}
      </p>

      <div className={styles.pujaContainer}>
        <h2>Realizar una puja</h2>
        <div className={styles.pujaForm}>
          <input
            type="number"
            placeholder="Introduce tu puja"
            min={subasta.price}
            step="0.01"
            className={styles.pujaInput}
          />
          <button className={`${styles.pujaButton} cta-button-bid`}>
            Confirmar Puja
          </button>
        </div>
        <p className={styles.pujaInfo}>
          La puja debe ser mayor que el precio actual: ${subasta.price}
        </p>
      </div>

      <Link href="/finder">
        <button className="cta-button">Volver al buscador</button>
      </Link>
    </main>
  );
}

