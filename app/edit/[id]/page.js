"use client"

import InitTemplate from "francisco/components/InitTemplate/InitTemplate";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCategories, getAuction, updateAuction } from "./utils";

export default function EditAuction() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [auction, setAuction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoria, setCategoria] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token-jwt");
            const userId = localStorage.getItem("id");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const auctionData = await getAuction(params.id, token);
                
                if (!auctionData) {
                    setError("No se encontró la subasta");
                    return;
                }

                if (auctionData.auctioneer !== parseInt(userId)) {
                    setError("No tienes permisos para editar esta subasta");
                    setTimeout(() => router.push("/auctions"), 2000);
                    return;
                }

                setAuction(auctionData);
                setCategoria(auctionData.category);
                await getCategories(setCategories);
            } catch (err) {
                setError(`Error al cargar los datos: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, router]);

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        
        if (!categoria) {
            setError("Por favor, selecciona una categoría");
            return;
        }
        
        setLoading(true);
        try {
            const token = localStorage.getItem("token-jwt");
            const userId = localStorage.getItem("id");
            
            const formData = new FormData(event.target);
            const auctionData = {
                title: formData.get("title"),
                description: formData.get("description"),
                closing_date: formData.get("closing_date"),
                price: auction.price,
                stock: parseInt(formData.get("stock")),
                rating: auction.rating,
                brand: formData.get("brand"),
                thumbnail: formData.get("thumbnail"),
                category: parseInt(categoria),
                auctioneer: parseInt(userId)
            };

            const response = await updateAuction(params.id, token, auctionData);
            
            console.log(response)

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Error al actualizar la subasta");
            }

            setMessage("Subasta actualizada exitosamente");
            setTimeout(() => router.push("/auctions"), 2000);
        } catch (err) {
            setError(err.message || "Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!auction) return <div>Subasta no encontrada</div>;

    return (
        <InitTemplate>
            <h1>Editar Subasta</h1>
            <form className={styles.createForm} onSubmit={handleOnSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    defaultValue={auction.title}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Descripción"
                    defaultValue={auction.description}
                    required
                />

                <label>Fecha de cierre</label>
                <input
                    type="datetime-local"
                    name="closing_date"
                    placeholder="Fecha de cierre"
                    defaultValue={new Date(auction.closing_date).toISOString().slice(0, 16)}
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    defaultValue={auction.stock}
                    min={1}
                    required
                />

                <input 
                    type="text" 
                    name="brand" 
                    placeholder="Marca" 
                    defaultValue={auction.brand}
                    required
                />

                <select 
                    value={categoria} 
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="thumbnail"
                    placeholder="Introduce la URL de la imagen"
                    defaultValue={auction.thumbnail}
                    required
                />

                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
                {loading ? <p>Espere, por favor...</p> : <button type="submit">Actualizar</button>}
            </form>
            <Link href="/auctions">Volver</Link>
        </InitTemplate>
    );
}