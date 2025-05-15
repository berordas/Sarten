"use client"

import  { getAuctions, deleteAuction } from "./utils";
import AuctionUserCard from "francisco/components/AuctionUserCard/AuctioUserCard";
import styles from "./page.module.css"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Auctions = () => {
    const [auctions, setAuctions] = useState([])
    const router = useRouter();

    useEffect(() => {
    const fetchAuctions = async () => {
        const id = localStorage.getItem("id")

        if (!id) {
            router.push("/login");
            return;
        }

        try {
            const auctionsData = await getAuctions(id);
            setAuctions(auctionsData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const timeoutId = setTimeout(() => {
        fetchAuctions();
    }, 3000);
    
    return () => clearTimeout(timeoutId);
}, [router]);

    const handleDeleteAuction = (auctionId) => {
    if (!confirm("¿Estás seguro de eliminar esta subasta?")) return;
    
    const token = localStorage.getItem("token-jwt");
    deleteAuction(token, auctionId)
        .then(() => {
            setAuctions(prevAuctions => 
                prevAuctions.filter(auction => auction.id !== auctionId)
            );
        })
        .catch((err) => {
            alert("No se pudo eliminar la subasta: " + err.message);
        });
}   ;


    return (
    <>
        <h2>Mis Subastas</h2>
        <div className={styles.auctions}>
            {auctions.map((auction) => (
                <AuctionUserCard 
                    key={auction.id}
                    auction={auction}
                    onDeleteAuction={handleDeleteAuction}
                />
            ))}
        </div>
    </>
    )
}

export default Auctions;