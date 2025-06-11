import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateProfile() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skill: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.socialLinks) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/profile/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundLight flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Create Your <span className="text-accent">DevConnect</span> Profile
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Skills</label>
            <input
              type="text"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB"
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-highlight focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Social Links */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>

            {/* GitHub */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* LinkedIn */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-accent focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Twitter */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-sky-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;
