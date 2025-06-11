import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const USERS_PER_PAGE = 5;
  const POSTS_PER_PAGE = 5;

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/admin/users', { headers });
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/admin/posts', { headers });
      setPosts(res.data);
    } catch {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${userId}/role`,
        { role: newRole },
        { 
          headers 
        }
        
      );
      console.log(handleRoleUpdate);
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      setEditingUserId(null);
      setNewRole('');
    } catch {
      alert('Failed to update role');
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Delete this user and their posts?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, { headers });
      setUsers(users.filter((u) => u._id !== userId));
      setPosts(posts.filter((p) => p.user._id !== userId));
    } catch {
      alert('Failed to delete user');
    }
  };

  const handlePostDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/posts/${postId}`, { headers });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch {
      alert('Failed to delete post');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset pagination when filters change
  useEffect(() => {
    setUserPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setPostPage(1);
  }, [selectedUser]);

  // Pagination logic
  const startUserIndex = (userPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startUserIndex, startUserIndex + USERS_PER_PAGE);

  const filteredPosts = selectedUser
    ? posts.filter((p) => p.user._id === selectedUser._id)
    : posts;
  const startPostIndex = (postPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startPostIndex, startPostIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-gray-800">Admin Panel</h1>
      {/* User Management */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">User Management</h2>
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700 mb-4"
        />
        {paginatedUsers.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-center">Roles</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-700">{user.name}</td>
                    <td className="px-4 py-2 text-gray-700">{user.email}</td>
                    <td className="px-4 py-2 text-gray-700 text-center">{user.role}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      {editingUserId === user._id ? (
                        <>
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-2 py-1 text-sm text-black"
                          >
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Link
                            onClick={() => handleRoleUpdate(user._id)}
                            className="bg-gray-400 text-white px-2 py-1 rounded text-sm        decoration-none"
                          >
                            Save
                          </Link>
                          <Link
                            onClick={() => setEditingUserId(null)}
                            className="bg-gray-400 text-white px-2 py-1 rounded text-sm"
                          >
                            Cancel
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-400 px-3 py-1"
                          >
                            View
                          </Link>
                          <Link
                            onClick={() => handleUserDelete(user._id)}
                            className="text-white px-3 py-1 rounded "
                          >
                            Delete
                          </Link>
                          <Link
                            onClick={() => {
                              setEditingUserId(user._id);
                              setNewRole(user.role);
                            }}
                            className="text-white px-3 py-1 rounded mt-3 hover:text-black"
                          >
                            Edit Role
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* User Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Link
                onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
                disabled={userPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </Link>
              <span className="text-gray-600">
                Page {userPage} of {Math.ceil(filteredUsers.length / USERS_PER_PAGE)}
              </span>
              <Link
                onClick={() =>
                  setUserPage((prev) =>
                    prev < Math.ceil(filteredUsers.length / USERS_PER_PAGE) ? prev + 1 : prev
                  )
                }
                disabled={userPage >= Math.ceil(filteredUsers.length / USERS_PER_PAGE)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Post Management */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          {selectedUser ? `Posts by ${selectedUser.name}` : 'All Posts'}
        </h2>
        {paginatedPosts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <>
            <ul className="space-y-6">
              {paginatedPosts.map((post) => (
                <li key={post._id} className="bg-gray-50 p-5 rounded-md shadow-sm">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title || 'Post Image'}
                      className="mb-4 w-full max-h-64 object-cover rounded-md"
                    />
                  )}
                  <h3 className="font-semibold text-lg text-gray-900">
                    {post.title || 'Untitled Post'}
                  </h3>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                    {post.content || 'No content.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted on: {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handlePostDelete(post._id)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm"
                  >
                    Delete Post
                  </button>
                </li>
              ))}
            </ul>
            {/* Post Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Link
                onClick={() => setPostPage((prev) => Math.max(prev - 1, 1))}
                disabled={postPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </Link>
              <span className="text-gray-600">
                Page {postPage} of {Math.ceil(filteredPosts.length / POSTS_PER_PAGE)}
              </span>
              <Link
                onClick={() =>
                  setPostPage((prev) =>
                    prev < Math.ceil(filteredPosts.length / POSTS_PER_PAGE) ? prev + 1 : prev
                  )
                }
                disabled={postPage >= Math.ceil(filteredPosts.length / POSTS_PER_PAGE)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </Link>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
}
