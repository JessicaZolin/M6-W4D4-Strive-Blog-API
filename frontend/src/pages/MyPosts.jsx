import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import "../color.css";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Utilizza il context per ottenere l'utente attuale
  const navigate = useNavigate();

  // --------------------------- Function to fetch my posts ---------------------------
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/blogPosts?author=${user._id}`
      );
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching my posts:", error);
      setError("Error while fetching my posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  // --------------------------- Function to handle post deletion ---------------------------
  const handleDelete = async (postId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${postId}`
      );
      fetchMyPosts(); // Aggiorna la lista dei post dopo la cancellazione
    } catch (error) {
      setError("Error while deleting post");
    }
  };

  if (loading)
    return (
      <Container className="mt-4">
        <p>Loading...</p>
      </Container>
    );
  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  // --------------------------- Render the component my posts ---------------------------
  return (
    <>
      <Button
        className="container-main align-items-center mt-5 color-button-546a76-bg-white"
        onClick={() => navigate("/dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-arrow-left mb-1 me-2"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to the User Dashboard
      </Button>
      <Container className="mt-4"
      style={{marginBottom: "100px"}}>
        <h2 className="mb-4 title-my-post">My Posts</h2>
        <Row>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Col key={post._id} xs={12} md={4} className="mb-4">
                <PostCard
                  post={post}
                  showAction={true}
                  onDelete={() => handleDelete(post._id)}
                />
              </Col>
            ))
          ) : (
            <Col>
              <p>You have not published any posts yet.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default MyPosts;
