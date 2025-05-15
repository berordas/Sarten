export const getAuctions = async (auctioneer) => {
    let url = new URL("http://127.0.0.1:8000/api/auctions/");
    
    if (auctioneer) url.searchParams.append("auctioneer", auctioneer);

    // Obtener la primera página para saber el total
    const firstResponse = await fetch(url.toString());
    const firstData = await firstResponse.json();
    
    const totalPages = Math.ceil(firstData.count / firstData.results.length);
    let allAuctions = [...firstData.results];

    // Obtener el resto de páginas
    for (let page = 2; page <= totalPages; page++) {
        url.searchParams.set("page", page);
        const response = await fetch(url.toString());
        const data = await response.json();
        allAuctions = [...allAuctions, ...data.results];
    }

    return allAuctions;
}


export const deleteAuction = (token, auctionId) => {
    return fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Error al eliminar la subasta.");
        }
        return true;
    });
};