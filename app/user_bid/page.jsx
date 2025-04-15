"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./user_bid_style.module.css";

export default function UserBids() {
  const router = useRouter();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  // Obtener el perfil del usuario para conocer el username
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("https://sarten-backend.onrender.com/api/users/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el perfil del usuario.");
        }
        return res.json();
      })
      .then((data) => {
        setUsername(data.username);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [router]);

  // Una vez obtenido el username, obtener todas las auctions y de cada una las pujas
  useEffect(() => {
    if (!username) return; // Espera a que el username esté disponible
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("https://sarten-backend.onrender.com/api/auctions", {
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
      .then((data) => {
        // Si el backend está paginado, las auctions estarán en data.results
        const auctionsArray = Array.isArray(data) ? data : data.results || [];
        // Para cada auction, obtener sus pujas
        return Promise.all(
          auctionsArray.map((auction) =>
            fetch(`https://sarten-backend.onrender.com/api/auctions/${auction.id}/bid`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => {
                if (!res.ok) {
                  // Si falla para una auction, retorna un array vacío
                  return [];
                }
                return res.json();
              })
              .then((bidData) => {
                // Las pujas estarán en bidData.results
                const bidsForAuction = bidData.results || [];
                // Agregamos el id de la auction para usarlo en la eliminación
                return bidsForAuction.map((bid) => ({
                  ...bid,
                  auctionId: auction.id,
                }));
              })
          )
        );
      })
      .then((bidsArrays) => {
        // Flatten: bidsArrays es un array de arrays
        const allBids = bidsArrays.flat();
        // Filtrar solo las pujas cuyo 'bidder' coincida con el username del usuario
        const userBids = allBids.filter(
          (bid) => String(bid.bidder) === String(username)
        );
        setBids(userBids);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username, router]);

  // Función para eliminar una puja
  const handleDeleteBid = (auctionId, bidId) => {
    if (!confirm("¿Estás seguro de eliminar esta puja?")) return;
    const token = localStorage.getItem("accessToken");
    fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/bid/${bidId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al eliminar la puja.");
        }
        // Actualizar el estado eliminando la puja borrada
        setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      })
      .catch((err) => {
        alert("No se pudo eliminar la puja: " + err.message);
      });
  };

  if (loading) return <p className={styles["loading"]}>Cargando pujas...</p>;
  if (error) return <p className={styles["error"]}>Error: {error}</p>;
  if (bids.length === 0) return <p className={styles["no-bids"]}>No tienes pujas realizadas.</p>;

  return (
    <main className={styles["main-container"]}>
      <h1>Mis Pujas</h1>
      <div className={styles["bid-list"]}>
        {bids.map((bid) => (
          <div key={bid.id} className={styles["bid-item"]}>
            <p><strong>ID:</strong> {bid.id}</p>
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {new Date(bid.creation_date).toLocaleString()}
            </p>
            <p><strong>Precio:</strong> ${bid.price}</p>
            <p><strong>Subasta:</strong> {bid.auctionId}</p>
            <button
              type="button"
              className="cta-button"
              onClick={() => handleDeleteBid(bid.auctionId, bid.id)}
            >
              Eliminar Puja
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
