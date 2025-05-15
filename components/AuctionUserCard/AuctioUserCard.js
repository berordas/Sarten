import React from 'react';
import Card from 'francisco/components/Card/Card';
import Button from 'francisco/components/Button/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AuctionUserCard = ({ auction, onDeleteAuction }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/edit/${auction.id}`);
  };

  return (
    <Card key={auction.id}>
      <h3>{auction.title}</h3>
      <Image
        src={auction.thumbnail || '/placeholder.jpg'}
        alt={auction.title}
        width={200}
        height={200}
        objectFit="cover"
      />
      
      <Button 
        label="Editar" 
        onClick={handleEdit}
      />
      <Button 
        label="Eliminar" 
        onClick={() => onDeleteAuction(auction.id)}
      />
    </Card>
  );
};

export default AuctionUserCard;