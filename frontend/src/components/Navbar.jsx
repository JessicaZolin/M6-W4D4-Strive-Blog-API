import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useState } from "react";
import "../color.css";

const NavBar = () => {
  // ---------------------------- useAuth hook to get the user and logout function,
  // ---------------------------- useNavigate hook to navigate to different pages,
  // ---------------------------- useSearch hook to get the search function
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { setSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  // ---------------------------- Function to handle search ----------------------------
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(query);
  };

  // ---------------------------- Function to handle logout and navigate to the home page ----------------------------
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ---------------------------- Capitalize the first letter of the user's name and last name and save as a variable
  const userFirstName = user?.firstName
    ? user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1)
    : "";
  const userLastName = user?.lastName
    ? user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1)
    : "";

  // ---------------------------- Profile default image
  const defaultProfileImage = user
    ? `https://ui-avatars.com/api/?background=a9c7d1&color=00000&name=${userFirstName}+${userLastName}`
    : "";

  // ---------------------------- Function to toggle the expanded state of the navbar ----------------------------
  const handleNavigation = () => {
    setExpanded(false);
  };

  // ---------------------------- Render the navbar ----------------------------
  return (
    <Navbar
      className="fixed-top shadow-sm background-546a76 text-white"
      expand="lg"
      // ---------------------------- Set the expanded state of the navbar
      expanded={expanded}
      onToggle={(isexpanded) => setExpanded(isexpanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavigation}>
          <img
            src="https://res.cloudinary.com/da9papeuy/image/upload/v1742572264/30_Seconds_To_Mars__Logo_gtr7eo.png"
            alt=""
            style={{ width: "200px", height: "70px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/" onClick={handleNavigation}>
              Home
            </Nav.Link>
          </Nav>

          <Form className="m-auto" onSubmit={handleSearch}>
            <Row className="d-flex flex-nowrap">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  style={{ width: "500px", fontSize: "13pt" }}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearch(e.target.value);
                  }}
                />
              </Col>
              <Col xs="auto">
                <Button
                  type="submit"
                  className="color-button-a9c7d1"
                  style={{ fontSize: "13pt" }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>

          <Nav className="mt-2 mt-lg-0">
            {user ? (
              <>
                <div className="d-flex align-items-center">
                  <Image
                    src={user.profileImage || defaultProfileImage}
                    roundedCircle
                    width={40}
                    height={40}
                    className="me-2 object-fit-cover"
                  />
                  <NavDropdown
                    title={`Hello, ${userFirstName} ${userLastName}`}
                    id="basic-nav-dropdown"
                    align="end"
                    style={{ fontSize: "13pt" }}
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/dashboard"
                      onClick={handleNavigation}
                      style={{ fontSize: "13pt" }}
                    >
                      Dashboard User
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      as={Link}
                      to="/blogPosts/create"
                      onClick={handleNavigation}
                      style={{ fontSize: "13pt" }}
                    >
                      Create New Post
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/my-posts"
                      onClick={handleNavigation}
                      style={{ fontSize: "13pt" }}
                    >
                      My Posts
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/profile"
                      onClick={handleNavigation}
                      style={{ fontSize: "13pt" }}
                    >
                      Manage Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={handleLogout}
                      style={{ fontSize: "13pt" }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={handleNavigation}
                  style={{ fontSize: "14pt" }}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  onClick={handleNavigation}
                  style={{ fontSize: "14pt" }}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
