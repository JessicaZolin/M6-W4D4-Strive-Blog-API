import { useState, useEffect } from "react";
import { Form, Button, Alert, ListGroup } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../color.css";
import TipTapEditor from "./TipTapEditor";
import parser from "html-react-parser";
import "./TipTapEditorStyle.css";

const Comments = ({ id }) => {
  // Inizializza lo stato per i commenti, il nuovo commento e l'errore, utilizzo il context per ottenere l'utente attuale
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  // ---------------------------- Function to obtain comments ----------------------------
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Error while fetching comments");
    }
  };

  // Utilizzo useEffect per chiamare la funzione fetchComments ogni volta che l'id cambia
  useEffect(() => {
    fetchComments();
  }, [id]);

  // ---------------------------- Function to handle form submission ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}`,
        // requestBody / request payload
        {
          content: newComment,
          author: user._id,
          blogPost: id,
        }
      );
      // Aggiungo il nuovo commento alla lista dei commenti
      setComments([response.data, ...comments]);
      // Resetto il nuovo commento dal form e l'editor
      // Reset editor content
      setNewComment("");
      setError("");
    } catch (error) {
      console.log(error);
      setError(`Error while creating comment: ${error.response.data.message}`);
    }
  };

  // ---------------------------- Function to handle comment deletion ----------------------------
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}/comment/${commentId}`
      );
      // Rimuovo il commento dalla lista dei commenti utilizzando il metodo filter per filtrare i commenti che non hanno l'id uguale a comment
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.log("Error deleting comment:", error);
      setError("Error while deleting comment");
    }
  };

  // --------------------------- render of list of comments ---------------------------
  return (
    <div className="mt-5">
      <h4 className="mb-4">Comments</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      {user && (
        <Form onSubmit={handleSubmit} className="mb-4">
          <TipTapEditor
            onUpdate={({ editor }) => {
              let content = editor.getHTML();
              setNewComment(content);
            }}
          />
          {/*  <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
          </Form.Group> */}
          <Button
            type="submit"
            className="color-button-546a76"
            disabled={!newComment?.trim()}
          >
            Publish comment
          </Button>
        </Form>
      )}

      {/* ----------------------------LISTA COMMENTI ---------------------------- */}

      {/* ---------------------------- Se non ci sono commenti, stampo un messaggio che indichi che non ci sono */}
      {comments.length === 0 && (
        <div className="text-muted">No comments yet</div>
      )}

      {/* ---------------------------- Stampo la lista dei commenti */}
      <ListGroup className="mt-4">
        {comments.map((comment) => (
          <ListGroup.Item
            key={comment._id}
            className="d-flex justify-content-between align-items-center bg-transparent shadow-sm"
          >
            <div className="me-auto">
              <div className="fw-bold">
                {comment.author.firstName.charAt(0).toUpperCase() +
                  comment.author.firstName.slice(1)}{" "}
                {comment.author.lastName.charAt(0).toUpperCase() +
                  comment.author.lastName.slice(1)}
              </div>
              {parser(comment.content)}
              <div className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>
            {user && user._id === comment.author._id && (
              <Button
                className="color-button-delete"
                size="sm"
                onClick={() => handleDelete(comment._id)}
              >
                Delete
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Comments;
