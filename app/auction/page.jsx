"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./auction_styles.module.css";

export default function CrearSubasta() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    closing_date: "",
    price: "",
    stock: "",
    rating: "",
    category: "",
    brand: "",
    thumbnail: "",
  });
  const [message, setMessage] = useState("");

  // Obtener el ID del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const username = localStorage.getItem("username");
        
        if (!token || !username) {
          console.error("No hay token o username disponible");
          router.push("/login");
          return;
        }

        const response = await fetch(`https://sarten-backend.onrender.com/api/users/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log("User data received:", userData);
          setUserId(userData.id);
        } else {
          const errorData = await response.json();
          console.error("Error fetching user data:", errorData);
          if (response.status === 401) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        if (error.message.includes("unauthorized")) {
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [router]);



  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("https://sarten-backend.onrender.com/api/auctions/categories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Categorías recibidas:", data);
          const categoriesArray = data.results || [];
          setCategories(categoriesArray);
        } else {
          console.error("Error fetching categories");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      if (!userId) {
        setMessage("Error: No se pudo obtener el ID del usuario");
        return;
      }

      const auctionData = {
        title: formData.title,
        description: formData.description,
        closing_date: formData.closing_date,
        price: formData.price,
        stock: parseInt(formData.stock),
        rating: formData.rating || "",
        brand: formData.brand,
        thumbnail: formData.thumbnail,
        category: parseInt(formData.category),
        auctioneer: userId // Usando el ID del usuario
      };

      console.log("Datos a enviar:", auctionData);

      const response = await fetch("https://sarten-backend.onrender.com/api/auctions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(auctionData),
      });

      if (response.ok) {
        setMessage("Subasta creada con éxito.");
        router.push("/finder");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setMessage(`Error: ${errorData.detail || "Error al crear la subasta"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al conectar con el servidor.");
    }
  };

  return (
    <div className={styles["auction-container"]}>
      <div className={styles["auction-content"]}>
        <h1>Crear Nueva Subasta</h1>
        <div className={styles["auction-form"]}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <label htmlFor="closing_date">Fecha de Cierre</label>
            <input
              type="datetime-local"
              id="closing_date"
              name="closing_date"
              value={formData.closing_date}
              onChange={handleChange}
              required
            />

            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              min={0}
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />

            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              min={1}
              value={formData.stock}
              onChange={handleChange}
              required
            />

            <label htmlFor="rating">Valoración (1 a 5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              min={1}
              max={5}
              onChange={handleChange}
              required
            />

            <label htmlFor="brand">Marca</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />

            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay categorías disponibles</option>
              )}
            </select>

            <label htmlFor="thumbnail">URL de la imagen</label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Introduce la URL de la imagen"
              required
            />

            <button type="submit">Crear Subasta</button>
          </form>

          {message && <div className={styles["message"]}>{message}</div>}
        </div>
      </div>
    </div>
  );
}
