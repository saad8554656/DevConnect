import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No authentication token found. Please log in.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log('Decoded Token:', decoded._id);
    } catch (error) {
      console.error('Invalid token:', error);
      setMessage('Invalid authentication token. Please log in again.');
      return;
    }

    if (!title || !content) {
      setMessage('Title and content are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:8000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Post created successfully!');
      setTitle('');
      setContent('');
      setImage(null);

      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to create post.');
    }
  };

  return (
    <div className="min-h-screen bg-backgroundDark flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-2xl bg-primary p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-accent">📝 Create a New Post</h2>

        {message && (
          <div
            className={`mb-4 text-center text-sm px-4 py-2 rounded-md ${
              message.startsWith('✅') ? 'bg-green-600' : 'bg-yellow-600'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block mb-1 font-small text-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your post title"
              className="w-full p-3 rounded-md bg-backgroundDark text-white  focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-1 font-small text-black">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows="6"
              className="w-full p-3 rounded-md bg-backgroundDark text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-small text-black">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent file:text-white hover:file:bg-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-black transition-colors text-white font-semibold py-3 rounded-md text-lg"
          >
            🚀 Publish Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
