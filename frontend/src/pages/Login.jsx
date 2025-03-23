import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../color.css";

const Login = () => {
  // Initialize the state for email, password and error, useNavigate hook to navigate to different pages, useAuth hook to get the login function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Import the login function

  // ---------------------------- Function to handle form submission ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/authors/login/local`,
        // requestBody / request payload
        { email, password }
      );
      const { user, token } = response.data;
      login(user, token);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
      console.log(error.response?.data); // Log the error response
    }
  };

  // ---------------------------- Modyfing the useEffect hook to handle Google login authentication ----------------------------
  useEffect(() => {
    // Get the token from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/authors/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            //console.log(response.data);
            login(response.data, token);
            navigate("/");
          })
          .catch((error) => {
            setError("Authentication failed with Google");
          });
      } catch (error) {
        setError("Authentication failed with Google");
      }
    }
  }, [login, navigate]);

  // ---------------------------- Function to handle Google login ----------------------------
  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.REACT_APP_BACKEND_URL}/authors/google`;
    const promptUrl = `${googleAuthUrl}?prompt=select_account`;
    window.location.href = promptUrl;
    
  };


  // ---------------------------- Render the login form ----------------------------
  return (
    <Container className="background-card container-main p-4 my-5 rounded shadow ">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="title">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* ---------------------------- Email input ---------------------------- */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* ---------------------------- Password input ---------------------------- */}
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* ---------------------------- Login button ---------------------------- */}
            <div className="d-grid gap-2 mb-3">
              <Button
                type="submit"
                size="lg"
                className="py-2 color-button-546a76"
              >
                Login
              </Button>
            </div>
            <div className="text-muted text-center mb-3">Or</div>

            {/* ---------------------------- Google login button ---------------------------- */}
            <div className="d-grid gap-2">
              <Button
                variant="outline-secondary"
                onClick={handleGoogleLogin}
                className="d-flex align-items-center justify-content-center py-2 gap-2 color-button-google"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="16"
                  height="16"
                  viewBox="0 0 50 50"
                >
                  <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
                </svg>
                Login with Google
              </Button>
            </div>
            <p
              className="mt-4 bg-transparent"
              style={{ fontSize: "0.9rem", border: "none" }}
            >
              Don't have an account?{"  "}
              <Alert.Link href="/register">Register</Alert.Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
