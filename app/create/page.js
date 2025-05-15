"use client"

import InitTemplate from "francisco/components/InitTemplate/InitTemplate";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getCategories, createAuc} from "./utils";


export default function CreateAuction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter();
  const [categories, setCategories] = useState([])
  const [categoria, setCategoria] = useState("")
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);


  useEffect(() => {
    // Get localStorage items after component mounts
    const storedToken = localStorage.getItem("token-jwt");
    const storedId = localStorage.getItem("id");
    
    if (!storedToken || !storedId) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setId(storedId);
    getCategories(setCategories);
  }, [router]);
  

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setError("");
    
    if (!categoria) {
        setError("Por favor, selecciona una categoría");
        return;
    }
    
    const formData = new FormData(event.target);
    const auctionData = {
        title: formData.get("title"),
        description: formData.get("description"),
        closing_date: formData.get("closing_date"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        rating: 1,
        brand: formData.get("brand"),
        thumbnail: formData.get("thumbnail"),
        category: parseInt(categoria),
        auctioneer: parseInt(id)
    };

    // Añadir logs de depuración
    console.log('Datos a enviar:', auctionData);
    console.log('Token:', token);

    setLoading(true);
    try {
        const auction = await createAuc(token, auctionData);
        console.log('Respuesta del servidor:', auction);

        if (auction.error) {
            setError(auction.error);
            return;
        }

        router.push("/auctions");
    } catch (err) {
        console.error('Error completo:', err);
        setError("Error al conectar con el servidor. Por favor, intenta nuevamente.");
    } finally {
        setLoading(false);
    }
};

  return (
    <InitTemplate>
      <h1>Crea tu subasta</h1>
      <form className={styles.createForm} onSubmit={handleOnSubmit}>
        <input
            type="text"
            name="title"
            placeholder="Título"
            required
        />

        <textarea
            name="description"
            placeholder="Descripción"
            required
        />

        <label>Fecha de cierre</label>
        <input
            type="datetime-local"
            name="closing_date"
            placeholder="Fecha de cierre"
            required
        />

        <input
            type="number"
            name="price"
            placeholder="Precio"
            min={0}
            required
        />

        <input
            type="number"
            name="stock"
            placeholder="Stock"
            min={1}
            required
        />


        <input type="text" name="brand" placeholder="Marca" required/>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
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
            required
        />

        {error && <p>{error}</p>}
        {loading ? <p>Espere, por favor...</p> : <button type="submit">Crear</button>}
      </form>
      <Link href="/">Volver</Link>
    </InitTemplate>
  );
}