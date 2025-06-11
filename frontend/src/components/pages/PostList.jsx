import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = ({ filterByUser = false }) => {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            const token = localStorage.getItem('token');
            let currentUserId = null;

            try {
                if (token) {
                    // Get logged-in user info
                    const userRes = await axios.get('http://localhost:8000/api/profile/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    currentUserId = userRes.data.userId._id;
                    setUserId(currentUserId);
                    setIsLoggedIn(true);
                }

                // Fetch all posts (no matter what)
                const postsRes = await axios.get('http://localhost:8000/api/posts', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const allPosts = postsRes.data;

                const filtered = filterByUser && currentUserId
                    ? allPosts.filter((post) => String(post.user._id) === String(currentUserId))
                    : allPosts;

                setPosts(filtered);
            } catch (err) {
                console.error('Error fetching posts or user:', err);
                setPosts([]);
                setIsLoggedIn(false);
            }
        };

        fetchUserAndPosts();
    }, [filterByUser]);

    const refreshPosts = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:8000/api/posts', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const allPosts = res.data;
            const filtered = filterByUser && userId
                ? allPosts.filter((post) => String(post.user._id) === String(userId))
                : allPosts;

            setPosts(filtered);
        } catch (err) {
            console.error('Error refreshing posts:', err);
        }
    };

    if (posts.length === 0) {
        return <div className="text-center text-gray-400 mt-8">No posts found.</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    userId={userId}
                    isLoggedIn={isLoggedIn}
                    refreshPosts={refreshPosts}
                />
            ))}
        </div>
    );
};

export default PostList;
