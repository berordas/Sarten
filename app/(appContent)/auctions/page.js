"use client"

import  { getAuctions, getCategories } from "./utils";
import AuctionCard from "francisco/components/AuctionCard/AuctionCard";
import styles from "./page.module.css"
import { useState, useEffect } from "react";

const Auctions = () => {
    const [query, setQuery] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [categoria, setCategoria] = useState("");
    const [auctions, setAuctions] = useState([])
    const [categories, setCategories] = useState([])

    
    useEffect(() => {
        getCategories(setCategories);
    }, []);


    useEffect(() => {
    const fetchAuctions = async () => {
        try {
            const auctionsData = await getAuctions(precioMin, precioMax, categoria, query);
            setAuctions(auctionsData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const timeoutId = setTimeout(() => {
        fetchAuctions();
    }, 3000);
    
    return () => clearTimeout(timeoutId);
}, [precioMin, precioMax, categoria, query]);


    return (
    <>
        <h2>Subastas Disponibles</h2>
        <div className={styles.filter}>
            <input
            type="text"
            id="buscarInput"
            placeholder="Buscar una subasta..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            <input
            type="number"
            placeholder="Precio mínimo"
            value={precioMin}
            onChange={(e) => {
                const value = e.target.value;
                setPrecioMin(value);
                // Si el precio máximo es menor que el nuevo precio mínimo, actualizarlo
                if (precioMax && Number(value) > Number(precioMax)) {
                setPrecioMax(value);
                }
            }}
            min="1"
            step="1"
            />
            <input
            type="number"
            placeholder="Precio máximo"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            min={precioMin || "1"}
            step="1"
            />

            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                    {cat.name}
                    </option>
                ))}
            </select>
        </div>

        <div className={styles.auctions}>
        {auctions.map((auction) => (
            <AuctionCard 
                key={auction.title}
                name={auction.title}
                price={auction.price}
                open={auction.isOpen}
                thumbnail = {auction.thumbnail}
                id = {auction.id}
            />
        ))}
        </div>
    </>
    )
}

export default Auctions;