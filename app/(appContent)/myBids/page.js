"use client"

import { getAllBids, deleteBid } from "./utils";
import BidUserCard from "francisco/components/BidUserCard/BidUserCard";
import styles from "./page.module.css"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function UserBids() {
  const router = useRouter();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token-jwt");
    const username = localStorage.getItem("username");
    
    console.log("Username:", username); // Añadir este log
    
    setLoading(true);
    getAllBids(token)
      .then(allBids => {
        console.log("Todas las pujas:", allBids); // Añadir este log
        const userBids = allBids.filter(
          (bid) => String(bid.bidder) === String(username)
        );
        console.log("Pujas filtradas:", userBids); // Añadir este log
        setBids(userBids);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err); // Añadir este log
        setError(err.message);
        setLoading(false);
      });
}, [router]);

  const handleDeleteBid = (auctionId, bidId) => {

    const token = localStorage.getItem("token-jwt");
    deleteBid(token, auctionId, bidId)
      .then(() => {
        setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      })
      .catch((err) => {
        setError("No se pudo eliminar la puja: " + err.message);
      });
};
    
    if (loading) return <p>Buscando tus pujas en todas las subastas...</p>;
    if (error) return <p>Error al cargar las pujas: {error}</p>;
    if (!loading && bids.length === 0) return <p>No se encontraron pujas realizadas por ti.</p>;

    return (
    <>
      <h2>Mis Pujas</h2>
      <div className={styles.auctions}>
        {bids.map((bid) => (
          <BidUserCard 
            key={bid.id}
            bid={bid}
            onDeleteBid={handleDeleteBid}
          />
        ))}
      </div>
    </>
    );
}
