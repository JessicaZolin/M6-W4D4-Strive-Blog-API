import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EditPost = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    cover: "",
    readTime: {
      value: "",
      unit: "minutes",
    },
    content: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // --------------------------- Function to handle post input changes ----------------------------
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}`
        );
        const post = response.data;

        if (post.author._id !== user._id) {
          navigate("/"); // Redirect to home if the user doesn't own the post
          return;
        }

        setFormData({
          category: post.category,
          title: post.title,
          cover: post.cover,
          readTime: post.readTime,
          content: post.content,
        });
        setPreviewUrl(post.cover);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error while fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user._id, navigate]);

  // --------------------------- Function to handle cover image change ----------------------------
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ---------------------------- Function to handle form submit ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("category", formData.category);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append(
        "readTime",
        JSON.stringify({
          value: parseInt(formData.readTime.value),
          unit: formData.readTime.unit,
        })
      );

      // Append cover image if it exists
      if (coverImage) {
        formDataToSend.append("cover", coverImage);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/blogPosts/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        navigate(`/blogPosts/${id}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setError(error.response?.data?.message || "Error while updating post");
    }
  };

  if (loading)
    return (
      <Container className="container-main mt-4">
        <p>Loading...</p>
      </Container>
    );

  // --------------------------- Render the form ----------------------------
  return (
    <Container
      className="background-card p-4 mt-5 rounded shadow"
      style={{ marginBottom: "100px" }}
    >
      <Row className="justify-content-center ">
        <Col xs={12} md={6}>
          <h2 className="title">Edit Post</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* ---------------------------- Form Field Category ---------------------------- */}
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </Form.Group>

            {/*                        ---------------------------- Form Field Title ---------------------------- */}
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            {/*                        ---------------------------- Form Field Cover Image ---------------------------- */}
            <Form.Group className="mb-3" controlId="cover">
              <Form.Label>Cover Image</Form.Label>
              {previewUrl && (
                <div className="mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      display: "block",
                      marginBottom: "1rem",
                      boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
              <Form.Text className="text-muted">
                Upload an image for the cover only if you want to change it.
              </Form.Text>
            </Form.Group>

            {/*                        ---------------------------- Form Field Read Time ---------------------------- */}
            <Form.Group className="mb-3" controlId="readTime">
              <Form.Label>Read Time (minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter read time"
                value={formData.readTime.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    readTime: { ...formData.readTime, value: e.target.value },
                  })
                }
                required
              />
            </Form.Group>

            {/*                        ---------------------------- Form Field Content ---------------------------- */}
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button className="color-button-post" type="submit">
              Update Post
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditPost;
