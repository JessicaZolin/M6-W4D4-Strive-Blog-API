
import './App.css';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateBlogPost from './pages/CreateBlogPost';
import PostDetails from './pages/PostDetails';
import MyPosts from './pages/MyPosts';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import TiptapEditor from './components/TipTapEditor';

function App() {


  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
        <Navbar />
        <Container className='pt-5'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogPosts/create" element={<CreateBlogPost />} />
            <Route path="/blogPosts/:id" element={<PostDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blogPosts/edit/:id" element={<EditPost />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
        <Footer />
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
