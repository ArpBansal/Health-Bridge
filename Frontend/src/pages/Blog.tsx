import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Search, ArrowRight, Calendar, Clock, User,
  Brain, Heart, Dna, Microscope, Activity, Globe,
  Loader2, PenSquare, Trash2, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context

// Define types for our data
interface Post {
  slug: string;
  title: string;
  content: string;
  author: string;
  image: string;
  created_at: string;
  comments: Comment[];
  tags?: string[]; // Make tags optional
}

interface Comment {
  id: number;
  post: number;
  author: string;
  content: string;
  created_at: string;
}

const API_URL = 'https://health-bridge-mtzy.onrender.com';

const Blog = () => {
  const { t } = useLanguage();
  const { user } = useAuth(); // Assuming your auth context provides user info
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const blogCategories = [
    { name: "AI in Healthcare", icon: Brain, color: "from-purple-500 to-indigo-500" },
    { name: "Medical Research", icon: Microscope, color: "from-blue-500 to-cyan-500" },
    { name: "Patient Care", icon: Heart, color: "from-pink-500 to-rose-500" },
    { name: "Genomics", icon: Dna, color: "from-emerald-500 to-green-500" },
    { name: "Health Tech", icon: Activity, color: "from-orange-500 to-amber-500" },
    { name: "Global Health", icon: Globe, color: "from-blue-500 to-indigo-500" }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/blogs/posts/`);
      const allPosts = response.data;
      
      // Sort posts by date (newest first)
      const sortedPosts = [...allPosts].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setPosts(sortedPosts);
      
      // Get featured posts (first 6)
      setFeaturedPosts(sortedPosts.slice(0, 6));
      
      // Get recent posts (next 3)
      setRecentPosts(sortedPosts.slice(6, 9));
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFeaturedPosts(filtered.slice(0, 6));
    setRecentPosts(filtered.slice(6, 9));
  };

  const handlePostClick = (slug: string) => {
    console.log("Navigating to slug:", slug);
    navigate(`/blog/${slug}`);
  };

  const handleCreatePost = () => {
    navigate('/blog/create');
  };

  const handleEditPost = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    navigate(`/blog/edit/${slug}`);
  };

  const handleDeletePost = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_URL}/blogs/posts/${slug}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchPosts();
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete post. Please try again.");
      }
    }
  };

  // Calculate read time based on content length
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    // Strip HTML tags before counting words
    const plainText = content.replace(/<[^>]*>?/gm, '');
    const wordCount = plainText.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Truncate text for excerpts but preserve HTML structure for rendering
  const createExcerpt = (htmlContent: string, maxLength: number) => {
    // Strip HTML tags for length calculation
    const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
    
    if (plainText.length <= maxLength) {
      return htmlContent; // Return full HTML content if it's shorter than the limit
    }
    
    // For longer content, truncate the HTML safely
    let excerpt = htmlContent;
    const ellipsis = "...";
    
    // Find a reasonable cutting point
    const cutPoint = plainText.lastIndexOf('. ', maxLength);
    const safePoint = cutPoint > maxLength / 2 ? cutPoint + 1 : maxLength;
    
    // This is a simplistic approach - a more robust solution would use an HTML parser
    // For now, we'll try to preserve tags while cutting content
    let charCount = 0;
    let inTag = false;
    let result = "";
    
    for (let i = 0; i < excerpt.length; i++) {
      const char = excerpt[i];
      
      if (char === '<') inTag = true;
      if (!inTag) charCount++;
      if (char === '>') inTag = false;
      
      result += char;
      
      if (charCount >= safePoint && !inTag) {
        result += ellipsis;
        break;
      }
    }
    
    // Ensure we close any open tags
    const openTags = [];
    const tagRegex = /<(\/?[a-zA-Z]+)[^>]*>/g;
    let match;
    
    while ((match = tagRegex.exec(result)) !== null) {
      if (match[1][0] !== '/') {
        // Opening tag
        openTags.push(match[1]);
      } else {
        // Closing tag
        const closingTag = match[1].substring(1);
        if (openTags.length > 0 && openTags[openTags.length - 1] === closingTag) {
          openTags.pop();
        }
      }
    }
    
    // Add closing tags in reverse order
    while (openTags.length > 0) {
      result += `</${openTags.pop()}>`;
    }
    
    return result;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Healthcare Insights
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore the latest breakthroughs and innovations in healthcare technology
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative flex gap-2">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16">
            {blogCategories.map((category) => (
              <div key={category.name} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-xl opacity-20`} />
                <div className="relative bg-white/80 rounded-xl p-4 border border-blue-100/20">
                  <category.icon className="w-8 h-8 mb-2 text-gray-800" />
                  <h3 className="text-gray-800 font-semibold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Create Post Button (for authenticated users) */}
        {/* {user && (
          <div className="container px-4 mb-8">
            <Button 
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <PenSquare className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </div>
        )} */}

        {/* Error Message */}
        {error && (
          <div className="container px-4 mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Featured Posts */}
        <section>
          <div className="container px-4">
            <h2 className="text-4xl font-bold mb-12 text-gray-800">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.length > 0 ? featuredPosts.map((post) => (
                <article 
                  key={post.slug} 
                  className="group relative cursor-pointer"
                  onClick={() => handlePostClick(post.slug)}
                >
                  <div className="relative bg-white/80 rounded-2xl overflow-hidden border border-blue-100/20">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback image if post image fails to load
                          (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {calculateReadTime(post.content)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments?.length || 0}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      {/* Render HTML content safely */}
                      <div 
                        className="text-gray-600 mb-4"
                        dangerouslySetInnerHTML={{
                          __html: createExcerpt(post.content, 150)
                        }}
                      />
                      {/* Display post tags if they exist */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(tag => (
                            <span 
                              key={tag}
                              className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Read More 
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        
                        {/* Edit/Delete buttons (visible only for post author) */}
                        {user && user.username === post.author && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-amber-600 border-amber-600 hover:bg-amber-50"
                              onClick={(e) => handleEditPost(e, post.slug)}
                            >
                              <PenSquare className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={(e) => handleDeletePost(e, post.slug)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No articles found. Be the first to create one!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section className="mt-20">
            <div className="container px-4">
              <h2 className="text-4xl font-bold mb-12 text-gray-800">Recent Posts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <article 
                    key={post.slug} 
                    className="group relative cursor-pointer"
                    onClick={() => handlePostClick(post.slug)}
                  >
                    <div className="relative bg-white/80 rounded-xl overflow-hidden border border-blue-100/20">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback image if post image fails to load
                            (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/8441771/pexels-photo-8441771.jpeg";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {post.title}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          {/* Display first tag if available */}
                          {post.tags && post.tags.length > 0 ? (
                            <span className="text-sm text-blue-600">{post.tags[0]}</span>
                          ) : (
                            <span className="text-sm text-blue-600">Healthcare</span>
                          )}
                          
                          {/* Comment count */}
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;