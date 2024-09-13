require('dotenv').config(); // Add this line to load environment variables

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors'); // Import CORS
const Blog = require('./models/Blog'); // Import the Blog model

const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog-generator')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Home route for testing
app.get('/', (req, res) => {
  res.send('Hello, Blog Generator!');
});

// Save a new blog post (POST /blogs)
app.post('/blogs', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const blog = new Blog({ title, content, author });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error saving blog post', error });
  }
});

// Get all blog posts (GET /blogs)
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog posts', error });
  }
});

// Get a specific blog post by ID (GET /blogs/:id)
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog post', error });
  }
});

// OpenAI API Key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to generate blog content based on keywords
app.post('/generate-blog', async (req, res) => {
  const { keywords } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003', // Or any other model you want to use
      prompt: `Write a detailed blog post about: ${keywords}`,
      max_tokens: 500, // Adjust based on your needs
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    res.json({ content: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error generating blog content:', error.message);
    res.status(500).json({ message: 'Error generating blog content', error: error.message });
  }
});

// Start the server on port 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
