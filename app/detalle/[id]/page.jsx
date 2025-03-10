"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./auction_style.module.css";  // ✅ Importación corregida

const subastas = [
  {
    id: "1",
    nombre: "Sartén de Hierro Fundido",
    imagen: "/img/sarten1.jpg",
    precio: "$50",
    descripcion: "Sartén de hierro fundido duradero y de alta calidad.",
  },
  {
    id: "2",
    nombre: "Sartén Antiadherente Premium",
    imagen: "/img/sarten2.jpg",
    precio: "$35",
    descripcion: "Sartén con recubrimiento antiadherente para cocina saludable.",
  },
  {
    id: "3",
    nombre: "Sartén de Cobre Profesional",
    imagen: "/img/sarten3.jpg",
    precio: "$75",
    descripcion: "Sartén de cobre con distribución uniforme del calor.",
  },
];

export default function DetalleSubasta() {
  const { id } = useParams();
  const subasta = subastas.find((item) => item.id === id);

  if (!subasta) {
    return (
      <div className={styles["main-detalles"]}>
        <h1>Subasta no encontrada</h1>
        <Link href="/">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <main className={styles["main-detalles"]}>
      <Image src={subasta.imagen} alt={subasta.nombre} width={300} height={300} />
      <h1>{subasta.nombre}</h1>
      <p className={styles.descripcion}>{subasta.descripcion}</p>
      <p className={styles.precio}>Precio actual: {subasta.precio}</p>

      <button className="cta-button-bid">Pujar Ahora</button>

      <Link href="/">
        <button className="cta-button">Volver al inicio</button>
      </Link>
    </main>
  );
}

