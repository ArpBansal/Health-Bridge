import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Upload, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  created_at: string;
  comments: Comment[];
}

const API_URL = 'http://localhost:8000';

const BlogForm = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only run auth check once isAuthenticated has been determined
    if (authChecked) return;
    
    // If we definitely know the user is not authenticated, redirect
    if (!isAuthenticated && localStorage.getItem('accessToken') === null) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Mark auth as checked so we don't keep trying to redirect
    setAuthChecked(true);
    
    // Fetch post data if editing and we've confirmed auth
    if (isEditing && isAuthenticated) {
      fetchPost();
    }
  }, [isAuthenticated, authChecked, id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/posts/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const post = response.data;
      
      // Check if current user is the author
      if (user?.username !== post.author) {
        setError("You don't have permission to edit this post.");
        return;
      }
      
      setTitle(post.title);
      setContent(post.content);
      setImagePreview(post.image);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Could not load post data. Please try again.");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    
    if (!isEditing && !image) {
      setError("Please upload an image for your post");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    
    if (image) {
      formData.append("image", image);
    }
    
    try {
      if (isEditing) {
        // Update existing post
        await axios.put(`${API_URL}/blogs/posts/${id}/`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        // Create new post
        await axios.post(`${API_URL}/blogs/posts/`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }
      
      // Redirect to blog listing after successful submission
      navigate('/blog');
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blog');
    }
  };

  if (loadingPost) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h1>
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <Label htmlFor="title" className="block mb-2 text-sm font-medium">
                  Post Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="content" className="block mb-2 text-sm font-medium">
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  rows={15}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can use HTML for rich text formatting. If you're familiar with CKEditor, the content will render properly.
                </p>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="image" className="block mb-2 text-sm font-medium">
                  Featured Image
                </Label>
                
                {imagePreview && (
                  <div className="mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-60 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="mt-2">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                      <p className="text-sm font-medium text-gray-700">
                        {isEditing ? "Change image" : "Upload an image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? "Updating..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Post" : "Publish Post"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogForm;