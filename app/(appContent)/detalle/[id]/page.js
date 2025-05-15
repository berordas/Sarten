"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import BidCard from "francisco/components/BidCard/BidCard";
import { getAuction, getBids, doBid, doComment, getComments, deleteComment, editComment, getRatings, doRating, deleteRating, editRating } from "./utils";
import { useRouter } from "next/navigation";

export default function DetalleSubasta() {
    const params = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bids, setBids] = useState([]);
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const username = localStorage.getItem("username");
            await getAuction(params.id, setAuction);
            await getBids(params.id, setBids);
            await getComments(params.id, setComments, username);
            await getRatings(params.id, setRatings, username); // Añadir username aquí
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const handleBidSubmit = async (amount) => {
        const token = localStorage.getItem("token-jwt");
        const username = localStorage.getItem("username");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await doBid(params.id, username, amount, token);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al realizar la puja');
            }
            await getBids(params.id, setBids);

        } catch (err) {
            setError(err.message);
            throw err; // Re-throw the error to be handled by the component
        }
    };

    const handleCommentSubmit = async (commentText) => {
        const token = localStorage.getItem("token-jwt");
        const username = localStorage.getItem("username");
        
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await doComment(params.id, commentText, token, username);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al enviar el comentario');
            }
            // Recargar todos los datos
            await fetchData();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleCommentDelete = async (commentId) => {
        const token = localStorage.getItem("token-jwt");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            await deleteComment(token, params.id, commentId);
            // Refresh comments after successful deletion
            const username = localStorage.getItem("username");
            await getComments(params.id, setComments, username);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommentEdit = async (commentId, newText) => {
        const token = localStorage.getItem("token-jwt");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await editComment(params.id, commentId, newText, token);
            if (!response.ok) {
                throw new Error('Error al editar el comentario');
            }
            // Refresh comments after successful edit
            const username = localStorage.getItem("username");
            await getComments(params.id, setComments, username);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleRatingSubmit = async (value) => {
        const token = localStorage.getItem("token-jwt");
        const username = localStorage.getItem("username");
        
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await doRating(params.id, value, token, username);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al enviar la valoración');
            }
            // Recargar todos los datos
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRatingDelete = async (ratingId) => {
        const token = localStorage.getItem("token-jwt");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            await deleteRating(token, params.id, ratingId);
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRatingEdit = async (ratingId, newValue) => {
        const token = localStorage.getItem("token-jwt");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await editRating(params.id, ratingId, newValue, token);
            if (!response.ok) {
                throw new Error('Error al editar la valoración');
            }
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!auction) return <div>Subasta no encontrada</div>;

    const formattedBids = bids.map(bid => ({
        user: bid.bidder,
        amount: bid.price,
    }));

    return (
        <BidCard
            title={auction.title}
            currentPrice={auction.current_price || auction.price}
            thumbnail={auction.thumbnail}
            isOpen={auction.isOpen}
            rating={auction.rating}
            previousBids={formattedBids}
            comments={comments}
            ratings={ratings}
            onBidSubmit={handleBidSubmit}
            onCommentSubmit={handleCommentSubmit}
            onCommentDelete={handleCommentDelete}
            onCommentEdit={handleCommentEdit}
            onRatingSubmit={handleRatingSubmit}
            onRatingDelete={handleRatingDelete}
            onRatingEdit={handleRatingEdit}
        />
    );
}