export const getAuctions = async (precioMin, precioMax, categoria, query) => {
    let url = new URL("http://127.0.0.1:8000/api/auctions/");
    
    if (precioMin) url.searchParams.append("priceMin", precioMin);
    if (precioMax) url.searchParams.append("priceMax", precioMax);
    if (categoria) url.searchParams.append("category", categoria);
    if (query.trim()) url.searchParams.append("text", query.trim());

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


export const getCategories = async (setCategories) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auctions/categories/");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
