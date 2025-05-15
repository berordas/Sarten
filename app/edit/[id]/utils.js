export const getAuction = async (id, token) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};

export const updateAuction = async (id, token, formData) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });
    
    return response;
};

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