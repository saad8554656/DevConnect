import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    skill: '',
    socialLinks: { github: '', linkedin: '', twitter: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/profile/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError('Unable to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.bio.trim()) {
      alert('Name and Bio are required.');
      return;
    }

    try {
      const updatedProfile = {
        ...profile,
        skill: profile.skill.trim(),
      };

      await axios.put('http://localhost:8000/api/profile/', updatedProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-gray-600">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            name="name"
            id="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            id="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 text-white"
            rows="4"
            required
          />
        </div>

        <div>
          <label htmlFor="skill" className="block text-gray-700 font-medium mb-1">Skills (comma-separated)</label>
          <input
            name="skill"
            id="skill"
            value={profile.skill}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 text-white"
          />
        </div>

        {/* Social Links */}
        {['github', 'linkedin', 'twitter'].map((platform) => (
          <div key={platform}>
            <label htmlFor={platform} className="block text-gray-700 font-medium mb-1">
              {platform.charAt(0).toUpperCase() + platform.slice(1)} URL
            </label>
            <input
              name={`socialLinks.${platform}`}
              id={platform}
              value={profile.socialLinks[platform] || ''}
              onChange={handleChange}
              placeholder={`https://${platform}.com/username`}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 text-white"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition text-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
