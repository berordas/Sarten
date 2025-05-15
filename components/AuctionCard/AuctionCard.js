"use client"
import Card from "francisco/components/Card/Card";
import styles from "./styles.module.css"
import Button from "francisco/components/Button/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AuctionCard = ({ name, price, open, thumbnail, id}) => {
    const router = useRouter();
    return (
        <Card className = {styles.card}>
            <h3>{name}</h3>
            <Image
                src={thumbnail || "/img/placeholder.jpg"}
                alt={`Imagen de la subasta: ${name}`}
                width={140}
                height={120}
            />
            <p>{price}$</p>
            <p>{open? "Abierta": "Cerrada"}</p>
            {open && <Button label="Participar" onClick= {() => {router.push(`/detalle/${id}`)}} />}
        </Card>
    );
};

export default AuctionCard;