"use client"
import InitTemplate from "francisco/components/InitTemplate/InitTemplate";
import styles from "./styles.module.css"
import Button from "francisco/components/Button/Button";
import Image from "next/image";
import { useState } from "react";

const BidCard = ({ 
    title, 
    currentPrice, 
    thumbnail, 
    isOpen,
    rating, 
    previousBids = [],
    comments = [],
    ratings = [],
    onBidSubmit, 
    onCommentSubmit,
    onCommentDelete,
    onCommentEdit, 
    onRatingSubmit,
    onRatingDelete,
    onRatingEdit
}) => {
    const [bidAmount, setBidAmount] = useState("");
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const [ratingValue, setRatingValue] = useState(5);
    const [editingRatingId, setEditingRatingId] = useState(null);
    const [editedRatingValue, setEditedRatingValue] = useState(5);

    const handleBidSubmit = () => {
        const amount = parseFloat(bidAmount);
        
        if (isNaN(amount) || amount <= currentPrice) {
            setError("La puja debe ser mayor al precio actual");
            return;
        }
        
        onBidSubmit(amount).catch(err => setError(err.message));
        setBidAmount("");
        setError("");
    };

    const handleCommentSubmit = () => {
        if (!comment.trim()) {
            setError("El comentario no puede estar vacío");
            return;
        }
        
        onCommentSubmit(comment);
        setComment("");
        setError("");
    };

    const handleEditClick = (commentId, currentText) => {
        setEditingCommentId(commentId);
        setEditedCommentText(currentText);
    };

    const handleEditSubmit = (commentId) => {
        if (!editedCommentText.trim()) {
            setError("El comentario no puede estar vacío");
            return;
        }

        onCommentEdit(commentId, editedCommentText);
        setEditingCommentId(null);
        setEditedCommentText("");
        setError("");
    };

    const handleRatingSubmit = () => {
        if (ratingValue < 1 || ratingValue > 5) {
            setError("La valoración debe estar entre 1 y 5");
            return;
        }
        
        onRatingSubmit(ratingValue);
        setRatingValue(5);
        setError("");
    };

    const handleRatingEditClick = (ratingId, currentValue) => {
        setEditingRatingId(ratingId);
        setEditedRatingValue(currentValue);
    };

    const handleRatingEditSubmit = (ratingId) => {
        if (editedRatingValue < 1 || editedRatingValue > 5) {
            setError("La valoración debe estar entre 1 y 5");
            return;
        }

        onRatingEdit(ratingId, editedRatingValue);
        setEditingRatingId(null);
        setEditedRatingValue(5);
        setError("");
    };

    return (
        <InitTemplate>
            <h3>{title}</h3>
            <Image
                src={thumbnail || "/img/placeholder.jpg"}
                alt={`Imagen de la subasta: ${title}`}
                width={200}
                height={160}
            />

            <h3>Precio inicial: ${currentPrice}</h3>
            <p>Rating: {rating}/5</p>
            <p>Estado: {isOpen ? "Abierta" : "Cerrada"}</p>
            
            {isOpen && (
                <div className={styles.bidSection}>
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Introduce tu puja"
                        min={currentPrice + 1}
                        step="0.01"
                    />
                    <Button 
                        label="Pujar" 
                        onClick={handleBidSubmit}
                        disabled={!bidAmount || parseFloat(bidAmount) <= currentPrice}
                    />
                </div>
            )}

            {previousBids.length > 0 && (
                <>
                    <h4>Pujas anteriores</h4>
                    <ul>
                        {previousBids.map((bid, index) => (
                            <li key={index}>
                                <span>Usuario: {bid.user} --- Puja: ${bid.amount}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <div className={styles.commentsSection}>
                <h4>Comentarios</h4>
                {comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                        <p>{comment.text}</p>
                        <p>Por: {comment.user}</p>
                        <p>Date: {comment.timestamp}</p>
                        
                        {comment.mine === true && (
                            <div className={styles.commentButtons}>
                                <Button 
                                    label="Editar" 
                                    onClick={() => handleEditClick(comment.id, comment.text)}
                                />
                                <Button 
                                    label="Eliminar" 
                                    onClick={() => onCommentDelete(comment.id)}
                                />
                            </div>
                        )}
                        
                        {editingCommentId === comment.id && (
                            <div className={styles.editForm}>
                                <textarea
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    rows={3}
                                />
                                <div className={styles.buttonGroup}>
                                    <Button 
                                        label="Guardar" 
                                        onClick={() => handleEditSubmit(comment.id)}
                                    />
                                    <Button 
                                        label="Cancelar" 
                                        onClick={() => setEditingCommentId(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.bidSection}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tu comentario aquí..."
                    rows={4}
                />
                <Button 
                    label="Comentar" 
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim()}
                />
            </div>

            <div className={styles.ratingsSection}>
                <h4>Ratings</h4>
                {ratings.map((rating) => (
                    <div key={rating.id} className={styles.ratingItem}>
                        {editingRatingId === rating.id ? (
                            <div className={styles.editForm}>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={editedRatingValue}
                                    onChange={(e) => setEditedRatingValue(parseInt(e.target.value) || 5)}
                                />
                                <div className={styles.buttonGroup}>
                                    <Button 
                                        label="Guardar" 
                                        onClick={() => handleRatingEditSubmit(rating.id)}
                                    />
                                    <Button 
                                        label="Cancelar" 
                                        onClick={() => setEditingRatingId(null)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p>Valoración: {rating.value}/5</p>
                                <p>Por: {rating.user}</p>
                                {rating.mine && (
                                    <div className={styles.ratingButtons}>
                                        <Button 
                                            label="Editar" 
                                            onClick={() => handleRatingEditClick(rating.id, rating.value)}
                                        />
                                        <Button 
                                            label="Eliminar" 
                                            onClick={() => onRatingDelete(rating.id)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}

                {!ratings.some(rating => rating.mine) && (
                    <div className={styles.ratingInput}>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={ratingValue}
                            onChange={(e) => setRatingValue(parseInt(e.target.value) || 5)}
                            placeholder="1 a 5"
                        />
                        <Button 
                            label="Valorar" 
                            onClick={handleRatingSubmit}
                            disabled={ratingValue < 1 || ratingValue > 5}
                        />
                    </div>
                )}
            </div>

            {error && <p className={styles.error}>{error}</p>}
        </InitTemplate>
    );
};

export default BidCard;