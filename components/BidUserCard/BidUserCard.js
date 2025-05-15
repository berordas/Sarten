import React from 'react';
import Card from 'francisco/components/Card/Card';
import Button from 'francisco/components/Button/Button';

const BidUserCard = ({ bid, onDeleteBid }) => {
  return (
    <Card key={bid.id}>
      <h3>Subasta: {bid.auction}</h3>
      <p>Precio de puja: ${bid.price}</p>
      <p>Fecha: {new Date(bid.creation_date).toLocaleString()}</p>
      <Button 
        label="Eliminar Puja" 
        onClick={() => onDeleteBid(bid.auction, bid.id)} 
      />
    </Card>
  );
};

export default BidUserCard;