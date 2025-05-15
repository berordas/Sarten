export const getAuction = async (id, token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};

export const updateAuction = async (id, token, formData) => {
    const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
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
      const response = await fetch("http://127.0.0.1:8000/api/auctions/categories/");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };