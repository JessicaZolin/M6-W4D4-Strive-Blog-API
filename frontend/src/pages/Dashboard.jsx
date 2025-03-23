import { Card, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Button
        className="container-main align-items-center mt-5 color-button-546a76-bg-white"
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
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to the Homepage
      </Button>

      <Container className="mt-5">
        <Row>
          <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/blogPosts/create`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>Create Post</Card.Title>
              <Card.Text>Create a new blog post.</Card.Text>
            </Card.Body>
          </Card>

          <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/my-posts`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>My Post</Card.Title>
              <Card.Text>See and modify your blog posts.</Card.Text>
            </Card.Body>
          </Card>

          <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/profile`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="d-flex flex-column justify-content-evenly">
              <Card.Title>User Profile</Card.Title>
              <Card.Text>
                Modify your profile and change your password
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
