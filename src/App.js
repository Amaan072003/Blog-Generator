import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styling

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to fetch all blog posts
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/blogs');
      setBlogs(response.data);
    } catch (error) {
      setErrorMessage('Error fetching blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Handle submitting a new blog post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newBlog = { title, content, author };

    try {
      await axios.post('http://localhost:5000/blogs', newBlog);
      setTitle('');
      setContent('');
      setAuthor('');
      fetchBlogs(); // Refresh the blog list after creating a new one
    } catch (error) {
      setErrorMessage('Error creating blog post');
    } finally {
      setLoading(false);
    }
  };

  // Handle generating blog content
  const handleGenerateBlog = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/generate-blog', { keywords });
      setGeneratedContent(response.data.content);
    } catch (error) {
      setErrorMessage('Error generating blog content');
    } finally {
      setLoading(false);
    }
  };

  // Toggle the visibility of the blog list
  const toggleBlogList = () => {
    setShowAllBlogs(!showAllBlogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Blog Post Manager</h1>
        <p>Create a new blog post and view all existing posts.</p>
      </header>

      {/* Blog post creation form */}
      <form onSubmit={handleSubmit} className="blog-form">
        <input 
          type="text" 
          placeholder="Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea 
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input 
          type="text" 
          placeholder="Author" 
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit">Create Blog</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p className="loading">Loading...</p>}

      {/* Button to toggle blog list visibility */}
      <button className="toggle-button" onClick={toggleBlogList}>
        {showAllBlogs ? 'Hide All Blogs' : 'Show All Blogs'}
      </button>

      {/* Display all blog posts */}
      {showAllBlogs && (
        <section className="blog-list">
          <h2>All Blog Posts</h2>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog">
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <p><strong>Author:</strong> {blog.author}</p>
                <p><em>Created At: {new Date(blog.createdAt).toLocaleString()}</em></p>
              </div>
            ))
          ) : (
            <p>No blog posts available.</p>
          )}
        </section>
      )}

      {/* Blog content generation form */}
      <form onSubmit={handleGenerateBlog} className="blog-form">
        <input 
          type="text" 
          placeholder="Enter keywords for blog generation..." 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
        <button type="submit">Generate Blog</button>
      </form>

      {generatedContent && (
        <section className="generated-content">
          <h2>Generated Blog Post</h2>
          <p>{generatedContent}</p>
        </section>
      )}
    </div>
  );
}

export default App;
