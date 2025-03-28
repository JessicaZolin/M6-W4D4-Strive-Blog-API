import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../color.css";

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  // ---------------------------- Function to handle profile image change ----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log(file)
    }
  };

  useEffect(() => {
    if (profileImage) {
      console.log(profileImage);
    }
  }, [profileImage]);

  // ---------------------------- Function to handle form input changes ----------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------------- Function to handle profile update --------------------------
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      // Create a FormData object and append form data
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      if (formData.currentPassword) {
        formDataToSend.append("currentPassword", formData.currentPassword);
      }
      if (formData.newPassword) {
        formDataToSend.append("newPassword", formData.newPassword);
      }
      if (profileImage) {
        console.log(profileImage, {
          name: profileImage.name,
          type: profileImage.type,
          size: profileImage.size
        });
        formDataToSend.append("profileImage", profileImage);
      }

      // Better FormData logging
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].type})`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }


      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/authors/${user._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      login(response.data); // Aggiorna l'utente con i dati aggiornati dal backend
      setSuccess("Profile updated successfully.");
      setError("");
      setPreviewUrl("");

      // Reset the form after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setProfileImage(null);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong while updating profile."
      );
      // console.log(error);
      setSuccess("");
    }
  };

  // -------------------------- render the profile page --------------------------
  return (
    <>
      <Button
        className="container-main align-items-center color-button-546a76-bg-white"
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
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to the User Dashboard
      </Button>

      <Container
        className="background-card p-4 mt-5 rounded shadow"
        style={{ marginBottom: "100px" }}
      >
        <Row className="justify-content-center">
          <Col md={6}>
            {/* -------------------------- manage profile -------------------------- */}
            <h2 className="title">Manage Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </Form.Group>

              {/* -------------------------- change password -------------------------- */}
              <h4 className="mt-5 title">Change Password</h4>

              <Form.Group className="mb-3" controlId="currentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* -------------------------- Input field for profile image -------------------------- */}
              <h4 className="mt-5 title">Change profile image</h4>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Profile image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  placeholder="Upload your profile image"
                  onChange={handleImageChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2"
                    style={{
                      maxWidth: "200px",
                      display: "block",
                      marginBottom: "1rem",
                      boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                      borderRadius: "10px",
                    }}
                  />
                )}
              </Form.Group>

              <Button
                type="submit"
                className="w-100 color-button-546a76"
                size="lg"
              >
                Update Profile
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
