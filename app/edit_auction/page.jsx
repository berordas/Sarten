"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./edit_auction_style.module.css";

export default function EditAuction() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("auctionId");

  const [auctionData, setAuctionData] = useState({
    title: "",
    description: "",
    closing_date: "",
    price: "",
    stock: "",
    rating: "",
    category: "",
    brand: "",
    thumbnail: "",
    auctioneer: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Obtener la subasta actual a editar (incluyendo auctioneer)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!auctionId) {
      setError("No se ha especificado la subasta a editar.");
      setLoading(false);
      return;
    }

    fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener los datos de la subasta.");
        }
        return res.json();
      })
      .then((data) => {
        // Formatear la fecha para el input datetime-local: "YYYY-MM-DDTHH:MM"
        const formattedDate = data.closing_date ? data.closing_date.slice(0, 16) : "";
        setAuctionData({
          title: data.title || "",
          description: data.description || "",
          closing_date: formattedDate,
          price: data.price || "",
          stock: data.stock || "",
          rating: data.rating || "",
          category: data.category || "",
          brand: data.brand || "",
          thumbnail: data.thumbnail || "",
          auctioneer: data.auctioneer || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [auctionId, router]);

  // Obtener todas las categorías disponibles
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch("https://sarten-backend.onrender.com/api/auctions/categories/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener las categorías.");
        }
        return res.json();
      })
      .then((data) => {
        const categoriesArray = data.results || [];
        setCategories(categoriesArray);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setAuctionData({
      ...auctionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  // Manejar el envío del formulario para actualizar la subasta
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    const formData = new FormData();
    formData.append("title", auctionData.title);
    formData.append("description", auctionData.description);
    formData.append("closing_date", auctionData.closing_date);
    formData.append("price", auctionData.price);
    formData.append("stock", auctionData.stock);
    formData.append("rating", auctionData.rating);
    formData.append("brand", auctionData.brand);
    formData.append("category", auctionData.category);
    // Incluir el campo auctioneer, ya que es requerido
    formData.append("auctioneer", auctionData.auctioneer);
    // Si se selecciona un nuevo archivo, se añade; de lo contrario, se envía el URL existente
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else {
      formData.append("thumbnail", auctionData.thumbnail);
    }

    fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al actualizar la subasta.");
        }
        return res.json();
      })
      .then((data) => {
        setMessage("Subasta actualizada con éxito.");
        // Opcional: redirigir a la página de mis subastas
        // router.push("/mis-subastas");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) return <p className={styles["loading"]}>Cargando datos...</p>;
  if (error) return <p className={styles["error"]}>Error: {error}</p>;

  return (
    <main className={styles["mainContainer"]}>
      <h1>Editar Subasta</h1>
      <form className={styles["editAuctionForm"]} onSubmit={handleSubmit}>
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={auctionData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={auctionData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="closing_date">Fecha de Cierre</label>
        <input
          type="datetime-local"
          id="closing_date"
          name="closing_date"
          value={auctionData.closing_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Precio</label>
        <input
          type="number"
          id="price"
          name="price"
          value={auctionData.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={auctionData.stock}
          onChange={handleChange}
          required
        />

        <label htmlFor="rating">Valoración (1 a 5)</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={auctionData.rating}
          min="1"
          max="5"
          onChange={handleChange}
          required
        />

        <label htmlFor="brand">Marca</label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={auctionData.brand}
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          name="category"
          value={auctionData.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una categoría</option>
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No hay categorías disponibles
            </option>
          )}
        </select>

        <label htmlFor="thumbnail">Imagen (URL de la imagen)</label>
        <input
          type="text"
          id="thumbnail"
          name="thumbnail"
          value={auctionData.thumbnail}
          onChange={handleChange}
          placeholder="Introduce la URL de la imagen"
          required
        />

        {message && <p className={styles["message"]}>{message}</p>}
        <button type="submit" className="cta-button">
          Actualizar Subasta
        </button>
      </form>
    </main>
  );
}
