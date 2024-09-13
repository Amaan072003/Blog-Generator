// src/components/BlogDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogDetail = ({ match }) => {
  const [blog, setBlog] = useState(null);
  const { id } = match.params;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div>
      {blog ? (
        <div>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          <p><strong>Author:</strong> {blog.author}</p>
        </div>
      ) : (
        <p>Loading blog post...</p>
      )}
    </div>
  );
};

export default BlogDetail;
