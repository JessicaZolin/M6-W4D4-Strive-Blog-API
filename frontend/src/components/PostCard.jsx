import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../color.css';

const PostCard = ({ post }) => {

    // format the name of the author
    // const authorName = post.author ? '$(post.author.firstName) $(post.author.lastName)' : 'Unknown';
    const navigate = useNavigate();

    // ---------------------------- Capitalize the first letter of the author's name and last name and save as a variable
    const userFirstName = post.author?.firstName.charAt(0).toUpperCase() + post.author?.firstName.slice(1);
    const userLastName = post.author?.lastName.charAt(0).toUpperCase() + post.author?.lastName.slice(1);
    


    // --------------------------- Render the card ----------------------------
    return (
        <Card className="h-100 shadow mb-3 background-card"
            onClick={() => navigate(`/blogPosts/${post._id}`)} 
            style= {{ cursor: 'pointer', minHeight:"450px"} } >
            <Card.Img variant="top" src={post.cover} style={{ height: '200px', objectFit: 'cover' }} />
            <Card.Body>
                <div className="d-flex justify-content-between mb-4">
                    <Badge className='background-badge-category'>{post.category}</Badge>
                    <small className='text-muted'>{post.readTime.value} {post.readTime.unit}</small>
                </div>
                <Card.Title style={{height:"20%"}}>{post.title}</Card.Title>
                <Card.Text style={{height:"40%"}}>{post.content.substring(0, 160)}...</Card.Text>
                <Badge bg="dark" className='mb-3 background-badge-category'>{post.author ? userFirstName + ' ' + userLastName : 'Unknown'} {post.author && post.author.profileImage && <img src={post.author?.profileImage} className="rounded-circle" alt="profile image" style={{ width: "20px", height: "20px", margin: "5px", objectFit: "cover" }} />}</Badge>
            </Card.Body>
        </Card>
    );
};


export default PostCard;