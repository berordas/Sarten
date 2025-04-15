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
  const [pujaValor, setPujaValor] = useState("");
  const [precioActual, setPrecioActual] = useState(0);
  const [historialPujas, setHistorialPujas] = useState([]);
  const [mensajePuja, setMensajePuja] = useState("");

  // Función para obtener el historial de pujas
  const fetchHistorialPujas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/bid/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const pujas = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
        setHistorialPujas(pujas);
        
        // Actualizar el precio con la puja más alta si existe
        if (pujas.length > 0) {
          const preciosNumericos = pujas.map(puja => parseFloat(puja.price)).filter(price => !isNaN(price));
          if (preciosNumericos.length > 0) {
            const precioMasAlto = Math.max(...preciosNumericos);
            setPrecioActual(precioMasAlto);
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener historial de pujas:", error);
    }
  };

  // Función para obtener datos de la subasta
  const fetchSubastaData = async () => {
    try {
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
      // Establecer el precio inicial de la subasta
      setPrecioActual(parseFloat(data.price));
      return data;
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar la subasta");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Primero obtenemos los datos de la subasta para establecer el precio inicial
        await fetchSubastaData();
        // Luego obtenemos el historial de pujas por si hay que actualizar el precio
        await fetchHistorialPujas();
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar la subasta");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handlePuja = async (e) => {
    e.preventDefault();
    setMensajePuja("");

    if (!pujaValor || parseFloat(pujaValor) <= parseFloat(subasta.price)) {
      setMensajePuja("La puja debe ser mayor que el precio actual");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const username = localStorage.getItem("username");

      const bodyData = {
        price: pujaValor,
        bidder: username,
        auction: parseInt(id)
      };

      const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/bid/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        setMensajePuja("¡Puja realizada con éxito!");
        setPujaValor("");
        
        // Actualizar datos de la subasta y el historial
        await fetchSubastaData();
        await fetchHistorialPujas();
      } else {
        const error = await response.json();
        setMensajePuja(error.detail || "Error al realizar la puja");
      }
    } catch (error) {
      console.error("Error al pujar:", error);
      setMensajePuja("Error al conectar con el servidor");
    }
  };

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
        alt={`Imagen detallada de la subasta: ${subasta.title}`} 
        width={300} 
        height={300} 
      />
      <h1>{subasta.title}</h1>
      <div className={styles["vendedor"]}>
        <p>ID del Vendedor: <span>{subasta.auctioneer}</span></p>
      </div>
      <p className={styles["descripcion"]}>{subasta.description}</p>
      <p className={styles["precio"]}>Precio actual: ${precioActual}</p>
      <p className={styles["stock"]}>Stock disponible: {subasta.stock}</p>
      <p className={styles["brand"]}>Marca: {subasta.brand}</p>
      {subasta.rating && (
        <p className={styles["rating"]}>Valoración: {subasta.rating}</p>
      )}
      <p className={styles["closing"]}>
        Fecha de cierre: {new Date(subasta.closing_date).toLocaleString()}
      </p>

      <div className={styles["pujaContainer"]}>
        <h2>Realizar una puja</h2>
        <div className={styles["pujaForm"]}>
          <input
            type="number"
            placeholder="Introduce tu puja"
            min={subasta.price}
            step="0.01"
            value={pujaValor}
            onChange={(e) => setPujaValor(e.target.value)}
            className={styles["pujaInput"]}
          />
          <button 
            onClick={handlePuja}
            className={`${styles["pujaButton"]} cta-button-bid`}
          >
            Confirmar Puja
          </button>
        </div>
        {mensajePuja && (
          <p className={`${styles["mensajePuja"]} ${mensajePuja.includes("éxito") ? styles["exitoso"] : styles["error"]}`}>
            {mensajePuja}
          </p>
        )}
        <p className={styles["pujaInfo"]}>
          La puja debe ser mayor que el precio actual: ${subasta.price}
        </p>

        <div className={styles["historialPujas"]}>
          <h3>Historial de Pujas</h3>
          {historialPujas && historialPujas.length > 0 ? (
            <ul>
              {historialPujas.map((puja, index) => {
                console.log("Renderizando puja:", puja);
                return (
                  <li key={index}>
                    Puja {index + 1}: ${puja.price}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No hay pujas anteriores</p>
          )}
        </div>
      </div>

      <Link href="/finder">
        <button className="cta-button">Volver al buscador</button>
      </Link>
    </main>
  );
}

