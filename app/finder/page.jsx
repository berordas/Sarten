"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./finder_style.module.css";

export default function Finder() {
  const [query, setQuery] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resultados, setResultados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener las categorías al montar el componente
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
          setCategories(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        
        // Construir la URL con los parámetros de búsqueda
        let url = new URL("https://sarten-backend.onrender.com/api/auctions/");
        
        // Añadir parámetros de búsqueda si tienen valor
        if (precioMin) url.searchParams.append("priceMin", precioMin);
        if (precioMax) url.searchParams.append("priceMax", precioMax);
        if (categoria) url.searchParams.append("category", categoria);
        if (query.trim()) url.searchParams.append("text", query.trim());

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResultados(data.results || []);
        } else {
          throw new Error("Error al obtener las subastas");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar las subastas");
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar demasiadas llamadas a la API
    const timeoutId = setTimeout(fetchAuctions, 300);
    return () => clearTimeout(timeoutId);

  }, [query, precioMin, precioMax, categoria]);

  if (error) {
    return <div className={styles["error-message"]}>{error}</div>;
  }

  return (
    <main className={styles["main-finder"]}>
      <section className={styles["busqueda"]}>
        <input
          type="text"
          id="buscarInput"
          placeholder="Buscar una subasta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>

      <section className={styles["filtros"]}>
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
          step="0.01"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
          min={precioMin || "1"}
          step="0.01"
        />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </section>

      <section className={styles["grid-subastas"]}>
        {loading ? (
          <div className={styles["loading"]}>Cargando...</div>
        ) : resultados.length > 0 ? (
          resultados.map((subasta) => (
            <div key={subasta.id} className={styles["subasta-item"]}>
              <Image
                src={subasta.thumbnail || "/img/placeholder.jpg"}
                alt={subasta.title}
                width={180}
                height={180}
                className={styles["subasta-imagen"]}
              />
              <h3>{subasta.title}</h3>
              <p className={styles["precio"]}>Precio: ${subasta.price}</p>

              <Link href={`/detalle/${subasta.id}`}>
                <button className="cta-button-bid">Ver Subasta</button>
              </Link>
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </section>
    </main>
  );
}


