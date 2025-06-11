import React from 'react';
import PostList from './PostList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">📝 All Posts</h1>
        <PostList  filterByUser={false}/>
      </div>
    </div>
  );
}
