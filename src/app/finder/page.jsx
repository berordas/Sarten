"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./finder_style.module.css";

const subastas = [
  { id: "1", nombre: "Sartén de Hierro Fundido", imagen: "/img/sarten1.jpg", precio: 50, categoria: "Hierro" },
  { id: "2", nombre: "Sartén Antiadherente Premium", imagen: "/img/sarten2.jpg", precio: 35, categoria: "Antiadherente" },
  { id: "3", nombre: "Sartén de Cobre Profesional", imagen: "/img/sarten3.jpg", precio: 75, categoria: "Cobre" },
];

export default function Finder() {
  const [query, setQuery] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resultados, setResultados] = useState(subastas);

  useEffect(() => {
    let filtrados = [...subastas]; // ✅ Se copia el array original para evitar mutaciones

    if (query.trim() !== "") {
      filtrados = filtrados.filter((subasta) =>
        subasta.nombre.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (precioMin !== "" && !isNaN(precioMin)) {
      filtrados = filtrados.filter((subasta) => subasta.precio >= parseFloat(precioMin));
    }
    if (precioMax !== "" && !isNaN(precioMax)) {
      filtrados = filtrados.filter((subasta) => subasta.precio <= parseFloat(precioMax));
    }
    if (categoria !== "") {
      filtrados = filtrados.filter((subasta) => subasta.categoria.toLowerCase() === categoria.toLowerCase());
    }

    setResultados(filtrados);
  }, [query, precioMin, precioMax, categoria]);

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
          onChange={(e) => setPrecioMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
        />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="Hierro">Hierro</option>
          <option value="Antiadherente">Antiadherente</option>
          <option value="Cobre">Cobre</option>
          <option value="Acero">Acero</option>
          <option value="Cerámica">Cerámica</option>
        </select>
      </section>

      <section className={styles["grid-subastas"]}>
        {resultados.length > 0 ? (
          resultados.map((subasta, index) => (
            <div key={index} className={styles["subasta-item"]}>
              <Image
                src={subasta.imagen}
                alt={subasta.nombre}
                width={180}
                height={180}
                className={styles["subasta-imagen"]}
              />
              <h3>{subasta.nombre}</h3>
              <p className={styles["precio"]}>Precio: ${subasta.precio}</p>

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


