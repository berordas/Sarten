export async function getAllBids(token) {
  try {
    // 1. Obtener todas las subastas (con paginación)
    let allAuctions = [];
    let nextPage = "http://127.0.0.1:8000/api/auctions";

    while (nextPage) {
      const auctionsResponse = await fetch(nextPage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!auctionsResponse.ok) {
        throw new Error("Error al obtener las subastas.");
      }

      const auctionsData = await auctionsResponse.json();
      const currentAuctions = Array.isArray(auctionsData) ? auctionsData : auctionsData.results || [];
      allAuctions = [...allAuctions, ...currentAuctions];
      
      // Actualizar nextPage para la siguiente iteración
      nextPage = auctionsData.next;
    }

    // 2. Obtener todas las pujas para cada subasta
    const bidsArrays = await Promise.all(
      allAuctions.map(async (auction) => {
        let allBidsForAuction = [];
        let nextBidPage = `http://127.0.0.1:8000/api/auctions/${auction.id}/bid`;

        while (nextBidPage) {
          const bidResponse = await fetch(nextBidPage, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!bidResponse.ok) {
            return [];
          }

          const bidData = await bidResponse.json();
          const currentBids = bidData.results || [];
          allBidsForAuction = [...allBidsForAuction, ...currentBids];
          
          // Actualizar nextBidPage para la siguiente iteración
          nextBidPage = bidData.next;
        }

        return allBidsForAuction.map((bid) => ({
          ...bid,
          auctionId: auction.id,
        }));
      })
    );

    // 3. Aplanar el array de pujas
    return bidsArrays.flat();
  } catch (error) {
    throw new Error(`Error obteniendo las pujas: ${error.message}`);
  }
}


export const deleteBid = (token, auctionId, bidId) => {
  return fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bid/${bidId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error al eliminar la puja.");
    }
    return true;
  });
};