"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./user_auction_style.module.css";

export default function MisSubastas() {
  const router = useRouter();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para eliminar una subasta
  const handleDelete = (auctionId) => {
    if (confirm("¿Estás seguro de eliminar esta subasta?")) {
      const token = localStorage.getItem("accessToken");
      // Petición DELETE a la URL del backend utilizando el ID de la subasta (auctionId)
      fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al eliminar la subasta.");
          }
          // Si la petición fue exitosa se elimina la subasta del estado local
          setAuctions((prevAuctions) =>
            prevAuctions.filter((auction) => auction.id !== auctionId)
          );
        })
        .catch((err) => {
          alert("No se pudo eliminar la subasta: " + err.message);
        });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    // Primero se obtiene el perfil del usuario para extraer su id
    fetch("https://sarten-backend.onrender.com/api/users/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener los datos del usuario.");
        }
        return res.json();
      })
      .then((userData) => {
        // Se obtiene todas las subastas y luego se filtran las que pertenecen al usuario (auctioneer === userData.id)
        fetch("https://sarten-backend.onrender.com/api/auctions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Error al obtener las subastas.");
            }
            return res.json();
          })
          .then((responseAuctions) => {
            // Asumiendo que el backend utiliza paginación, extraemos el arreglo de "results"
            const allAuctions = Array.isArray(responseAuctions)
              ? responseAuctions
              : responseAuctions.results || [];
            const userAuctions = allAuctions.filter(
              (auction) =>
                String(auction.auctioneer) === String(userData.id)
            );
            setAuctions(userAuctions);
            setLoading(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  return (
    <main className={styles["main-container"]}>
      <h1>Mis Subastas</h1>
      {loading && <p>Cargando subastas...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && auctions.length === 0 && <p>No tienes subastas creadas.</p>}
      <div className={styles["auction-list"]}>
        {auctions.map((auction) => (
          <div key={auction.id} className={styles["auction-item"]}>
            <img
              src={auction.thumbnail}
              alt={auction.title}
              className={styles["auction-image"]}
            />
            <div className={styles["auction-details"]}>
              <h2>{auction.title}</h2>
              <p>{auction.description}</p>
              <p>Precio: ${auction.price}</p>
              <p>
                Cierre:{" "}
                {new Date(auction.closing_date).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              {/* Botones de acción */}
              <div className={styles["auction-buttons"]}>
                <button
                  type="button"
                  className="cta-button"
                  onClick={() =>
                    router.push(`/edit_auction?auctionId=${auction.id}`)
                  }
                >
                  Editar Subasta
                </button>
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => handleDelete(auction.id)}
                >
                  Eliminar Subasta
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
