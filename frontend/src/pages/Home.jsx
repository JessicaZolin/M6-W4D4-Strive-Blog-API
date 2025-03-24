import { useState, useEffect } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { useSearch } from "../context/SearchContext";
import axios from "axios";
import PostCard from "../components/PostCard";
import '../color.css';


const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { search } = useSearch();

    // ---------------------------- fetch posts for the current page ----------------------------
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/blogPosts?page=${currentPage}&postPerPage=6`);
                // console.log(response.data.posts);               // ---> controlla se la response è un array.
                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages);
                setError(null);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Error while fetching posts');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    // ---------------------------- filter posts based on search query ----------------------------
    const filteredPosts = posts?.filter(post => 
        post?.title?.toLowerCase().includes(search.toLowerCase() || '') ||
        post?.content?.toLowerCase().includes(search.toLowerCase() || '') ||
        post?.category?.toLowerCase().includes(search.toLowerCase() || '') ||
        post?.author?.firstName?.toLowerCase().includes(search.toLowerCase() || '') ||
        post?.author?.lastName?.toLowerCase().includes(search.toLowerCase() || '')
    ) || [];


    // ---------------------------- render the posts ----------------------------
    return (
        <Container className="container-main my-5">
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <Row>
                {!loading && filteredPosts && filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <Col key={post._id} xs={12} md={6} lg={4} className="mb-4">
                            <PostCard post={post} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>{search ? `No posts found for "${search}"` : 'No posts found'}</p>
                    </Col>
                )}
            </Row>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination className="pb-4">
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                    </Pagination>
                </div>
            )}
        </Container>
    );
};

export default Home;