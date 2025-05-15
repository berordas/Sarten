export const getAuction = async (id, setAuction) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/`);
    if (response.ok) {
        const data = await response.json();
        setAuction(data);
    }
}

export const getBids = async (id, setBids) => {
    try {
        let allBids = [];
        let nextPage = `https://sarten-backend.onrender.com/api/auctions/${id}/bid/`;

        while (nextPage) {
            const response = await fetch(nextPage);
            if (!response.ok) break;

            const data = await response.json();
            allBids = [...allBids, ...(data.results || [])];
            nextPage = data.next;
        }

        setBids(allBids);
    } catch (error) {
        console.error("Error fetching bids:", error);
    }
}

export const doBid = async(id, user, amount, token) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${id}/bid/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            price: amount,
            bidder: user,           
            auction: parseInt(id)
        })
    });
    return response
}


export const doComment = async(auctionId, comment, token, username) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            auction: parseInt(auctionId),
            user: username,
            title: `Comentario de ${username}`,
            comment: comment
        })
    });
    return response;
}

export const getComments = async (id, setComments, username) => {
    try {
        let allComments = [];
        let nextPage = `https://sarten-backend.onrender.com/api/auctions/${id}/comment/`;

        while (nextPage) {
            const response = await fetch(nextPage);
            if (!response.ok) break;

            const data = await response.json();
            allComments = [...allComments, ...(data.results || [])];
            nextPage = data.next;
        }

        setComments(allComments.map(comment => ({
            id: comment.id,
            text: comment.comment,
            user: comment.user,
            timestamp: comment.modification_date,
            mine: comment.user === username
        })));
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
};

export const deleteComment = (token, auctionId, commentId) => {
    return fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/comment/${commentId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Error al eliminar el comentario.");
        }
        return true;
    });
};

export const editComment = async (auctionId, commentId, newText, token) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/comment/${commentId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            comment: newText
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al editar el comentario');
    }
    
    return response;
};


export const getRatings = async (id, setRatings, username) => {
    try {
        let allRatings = [];
        let nextPage = `https://sarten-backend.onrender.com/api/auctions/${id}/rating/`;

        while (nextPage) {
            const response = await fetch(nextPage);
            if (!response.ok) break;

            const data = await response.json();
            allRatings = [...allRatings, ...(data.results || [])];
            nextPage = data.next;
        }

        setRatings(allRatings.map(rating => ({
            id: rating.id,
            value: rating.value,
            user: rating.user,
            mine: rating.user === username
        })));
    } catch (error) {
        console.error("Error fetching ratings:", error);
    }
};

export const doRating = async(auctionId, ratingValue, token, username) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/rating/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            value: ratingValue,
            user: username,
            auction: parseInt(auctionId)
        })
    });
    return response;
};

export const deleteRating = (token, auctionId, ratingId) => {
    return fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/rating/${ratingId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        if (!res.ok) {
            throw new Error("Error al eliminar la valoración.");
        }
        return true;
    });
};

export const editRating = async (auctionId, ratingId, newValue, token) => {
    const response = await fetch(`https://sarten-backend.onrender.com/api/auctions/${auctionId}/rating/${ratingId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            value: newValue
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al editar la valoración');
    }
    
    return response;
};