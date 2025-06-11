import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostList from './PostList';
import { FiEdit, FiTrash2, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/profile/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.status === 404) return navigate('/create-profile');
                setProfile(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    navigate('/create-profile');
                } else {
                    setError(err.response?.data?.message || 'Failed to load profile');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your profile?")) return;
        try {
            await axios.delete('http://localhost:8000/api/profile/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert("Profile deleted successfully.");
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            alert("Failed to delete profile.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-backgroundDark text-white">
                <div className="animate-pulse space-y-4 w-72">
                    <div className="h-6 bg-accent rounded w-1/2 mx-auto"></div>
                    <div className="h-6 bg-accent rounded w-2/3 mx-auto"></div>
                    <div className="h-32 bg-accent rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-backgroundDark p-4 text-white">
                <div className="bg-primary p-6 rounded-xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-400">Error Loading Profile</h2>
                    <p className="text-highlight my-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-accent hover:bg-highlight text-white px-4 py-2 rounded transition">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-backgroundDark text-white">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Profile Card */}
                    <div className="bg-primary rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-accent to-highlight h-32" />
                        <div className="px-6 relative -mt-16">
                            <div className="flex justify-center">
                                <div className="h-32 w-32 rounded-full border-4 border-backgroundDark bg-gray-200 overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                                {profile.title && <p className="text-highlight">{profile.title}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={() => navigate('/edit-profile')}
                                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded hover:bg-black transition"
                                >
                                    <FiEdit /> Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="px-6 py-4">
                            <h3 className="font-semibold text-white m-2 text-center">Social</h3>
                            <div className="flex gap-4 justify-center">
                                {profile.socialLinks?.github && (
                                    <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">
                                        <FiGithub className="text-highlight hover:text-white text-xl" />
                                    </a>
                                )}
                                {profile.socialLinks?.linkedin && (
                                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                                        <FiLinkedin className="text-highlight hover:text-white text-xl" />
                                    </a>
                                )}
                                {profile.socialLinks?.twitter && (
                                    <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">
                                        <FiTwitter className="text-highlight hover:text-white text-xl" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="px-6 py-4">
                                <h3 className="font-semibold text-white mb-2">About</h3>
                                <p className="text-gray-300 text-sm whitespace-pre-line">{profile.bio}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {profile.skill && (
                            <div className="px-6 py-4">
                                <h3 className="font-semibold text-white mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skill.split(',').map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Post Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-primary p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Your Posts</h2>
                            <PostList filterByUser={true} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating New Post Button */}
            <button
                onClick={() => navigate('/add-post')}
                className="fixed bottom-6 right-6 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-highlight transition duration-300"
                title="New Post"
            >
                +
            </button>
        </div>
    );
}
