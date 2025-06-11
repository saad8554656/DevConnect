import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiMessageSquare,
  FiSend,
} from 'react-icons/fi';

const PostCard = ({ post, userId, isLoggedIn, refreshPosts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [commentText, setCommentText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      document.getElementById(`edit-title-${post._id}`)?.focus();
    }
  }, [isEditing, post._id]);

  const tokenHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const handleLike = async () => {
    if (!isLoggedIn || isProcessing) return alert('Login required');
    setIsProcessing(true);
    try {
      await axios.post(`http://localhost:8000/api/posts/${post._id}/like`, {}, tokenHeader);
      refreshPosts();
    } catch (err) {
      console.error('Like Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !isLoggedIn) return;
    try {
      await axios.post(`http://localhost:8000/api/posts/${post._id}/comment`, { text: commentText }, tokenHeader);
      setCommentText('');
      refreshPosts();
    } catch (err) {
      console.error('Comment Error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${post._id}`, tokenHeader);
      refreshPosts();
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/posts/${post._id}`,
        { title: editTitle, content: editContent },
        tokenHeader
      );
      setIsEditing(false);
      refreshPosts();
    } catch (err) {
      console.error('Update Error:', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-gray-800 font-semibold">{post.user?.name || 'Unknown'}</h4>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {post.user?._id === userId && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} title="Edit">
              <FiEdit2 className="text-gray-500 hover:text-indigo-600" />
            </button>
            <button onClick={handleDelete} title="Delete">
              <FiTrash2 className="text-gray-500 hover:text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <>
            <input
              id={`edit-title-${post._id}`}
              className="w-full border p-2 mb-2 rounded"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="w-full border p-2 rounded"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              placeholder="Content"
            />
            <div className="mt-3 flex gap-2">
              <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700">
                Update
              </button>
              <button onClick={() => setIsEditing(false)} className="border px-4 py-1 rounded hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="mt-4 w-full rounded-lg object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-gray-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${post.likes?.includes(userId) ? 'text-pink-600' : 'hover:text-pink-600'}`}
        >
          <FiHeart className={post.likes?.includes(userId) ? 'fill-current' : ''} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <div className="flex items-center gap-1">
          <FiMessageSquare />
          <span>{post.comments?.length || 0} comments</span>
        </div>
      </div>

      {/* Comment Box */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            className="flex-1 border p-2 rounded"
            placeholder="Write a comment..."
          />
          <button onClick={handleComment} className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
            <FiSend />
          </button>
        </div>

        {/* Comment List */}
        <div className="space-y-2">
          {post.comments?.map((comment, idx) => (
            <div key={idx} className="bg-gray-50 p-2 rounded">
              <div className="flex justify-between text-sm text-gray-700">
                <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="mt-1 ml-4 text-gray-800">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
