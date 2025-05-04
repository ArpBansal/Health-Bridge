import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calendar, User, MessageCircle, ArrowLeft,
  PenSquare, Trash2, Send, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import "./BlogDetail.css"; // Import custom CSS for blog content

interface Post {
  slug: string;
  title: string;
  content: string;
  author: {
    username: string;  // Changed to match Django User object structure
  };
  image: string;
  created_at: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  post: number;
  author: {
    username: string;  // Changed to match Django User object structure
  };
  content: string;
  created_at: string;
}

const API_URL = 'https://health-bridge-mtzy.onrender.com';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();  // Added isAuthenticated check
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      // Including the token in the request
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/blogs/posts/${slug}/`, { headers });
      setPost(response.data);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Could not load this post. Please check if the post exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = () => {
    navigate(`/blog/edit/${slug}`);
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_URL}/blogs/posts/${slug}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate('/blog');
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete post.");
      }
    }
  };

  const handleBackToBlog = () => {
    navigate('/blog');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setCommentError("You must be logged in to comment.");
      return;
    }

    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      await axios.post(
        `${API_URL}/blogs/posts/${slug}/comments/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setNewComment("");
      fetchPost(); // Refresh the post to show the new comment
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`${API_URL}/blogs/posts/${slug}/comments/${commentId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        fetchPost(); // Refresh to show updated comments
      } catch (err) {
        console.error("Error deleting comment:", err);
        setCommentError("Failed to delete comment.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error || "Post not found"}
          </div>
          <Button variant="outline" onClick={handleBackToBlog}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the author username, accounting for possible object structure changes
  const authorName = typeof post.author === 'object' ? post.author.username : post.author;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="w-full h-80 md:h-96 lg:h-[28rem] relative">
          <img 
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  {formatDate(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-5 h-5" />
                  {authorName}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  {post.comments?.length || 0} Comments
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content with Tailwind Typography */}
        <div className="container py-12">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <Button variant="outline" onClick={handleBackToBlog}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
              {isAuthenticated && user && authorName === user.username && (
                <div className="flex gap-2">
                  <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50" onClick={handleEditPost}>
                    <PenSquare className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={handleDeletePost}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Post
                  </Button>
                </div>
              )}
            </div>

            <article className="p-6 md:p-8 lg:p-10">
              {/* Use article tag for semantic markup and enable prose styling */}
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Comments ({post.comments?.length || 0})</h2>
            <div className="bg-white rounded-xl shadow-sm mb-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-4">
                  You must be logged in to comment.
                </div>
              )}
              {commentError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {commentError}
                </div>
              )}
              <form onSubmit={handleSubmitComment}>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  disabled={!isAuthenticated || commentLoading}
                  className="mb-4"
                />
                <Button 
                  type="submit" 
                  disabled={!isAuthenticated || commentLoading} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {commentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Render comments */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map(comment => {
                  // Get comment author's username accounting for possible object structure changes
                  const commentAuthor = typeof comment.author === 'object' ? comment.author.username : comment.author;
                  
                  return (
                    <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {typeof commentAuthor === 'string' ? commentAuthor.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <h4 className="font-semibold">{commentAuthor}</h4>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                        {isAuthenticated && user && commentAuthor === user.username && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No comments yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;




