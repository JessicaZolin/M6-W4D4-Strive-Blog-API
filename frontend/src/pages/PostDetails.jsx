import { Container, Row, Col, Button, Alert, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Comments from "../components/Comments";
import axios from "axios";
import "../color.css";

const PostDetails = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // --------------------------- Function to fetch post details ---------------------------
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}`
        );
        setPost(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error while fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // --------------------------- Function to handle post deletion ---------------------------
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}`
        );
        navigate("/my-posts"); // Aggiorna la lista dei post dopo la cancellazione
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Error while deleting post");
      }
    }
  };

  // --------------------------- verify if the user is the author of the post
  const isAuthor = user && post.author && user._id === post.author._id;

  // --------------------------- Capitalize the first letter of the author's name and last name and save as a variable
  const userFirstName =
    post.author?.firstName.charAt(0).toUpperCase() +
    post.author?.firstName.slice(1);
  const userLastName =
    post.author?.lastName.charAt(0).toUpperCase() +
    post.author?.lastName.slice(1);

  // --------------------------- Render the page ---------------------------
  return (
    <>
      <Button
        className="container-main align-items-center color-button-546a76-bg-white"
        onClick={() => navigate("/")}
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
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to the Homepage
      </Button>
      <Container
        className="background-card p-4 mt-5 rounded shadow"
        style={{ marginBottom: "100px" }}
      >
        {loading && <p>Loading...</p>}
        {error && <Alert variant="danger">{error}</Alert>}
        {post && post._id && (
          <>
            <Row className="mb-4">
              <Col xs={12} md={8} style={{ minHeight: "300px" }}>
                <div
                  className="d-flex align-items-center pb-3 mb-2 gap-4"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <Badge className="background-badge-category me-2 p-2">
                    {post.category}
                  </Badge>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString().split(",")[0]}
                  </small>
                  <small className="text-muted">
                    {post.readTime?.value} {post.readTime?.unit} readtime
                  </small>
                </div>
                <div
                  className="d-flex justify-content-between align-items-start" /* style={{ height: '30%' }} */
                >
                  <h1 className="col-9">{post.title}</h1>

                  {/* --------------------------- verify if the user is the author of the post and show the edit and delete buttons */}
                  {isAuthor && (
                    <div className="mt-2">
                      <Button
                        className="me-2 color-button-546a76"
                        onClick={() => navigate(`/blogPosts/edit/${post._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="color-button-delete mt-2 mt-lg-0"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <p style={{ minHeight: "50%" }}>{post.content}</p>

                {/* --------------------------- show the author of the post if it exists */}
                <div
                  className="mt-3 d-flex align-items-center"
                  style={{ borderTop: "1px solid #ccc" }}
                >
                  <small className="text-muted">
                    Author:{" "}
                    {post.author
                      ? userFirstName + " " + userLastName
                      : "Unknown"}
                  </small>
                  {post.author && post.author.profileImage && (
                    <img
                      src={post.author?.profileImage}
                      className="rounded-circle"
                      alt="profile image"
                      style={{
                        width: "30px",
                        height: "30px",
                        margin: "5px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col xs={12} md={4} className="d-flex justify-content-center">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="img-fluid rounded shadow object-fit-cover"
                  style={{ maxHeight: "300px", marginTop: "60px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8}>
                <Comments id={post._id} />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default PostDetails;
