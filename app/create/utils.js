export const getCategories = async (setCategories) => {
    try {
      const response = await fetch("https://sarten-backend.onrender.com/api/auctions/categories/");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

export const createAuc = async (token,auctionData) => {
  const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(auctionData),
    });
  const data = await response.json();
  return data
  }