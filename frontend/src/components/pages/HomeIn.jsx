import React, { useState } from 'react';
import PostList from './PostList';

export default function HomeIn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const postsPerPage = 5; 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            📝 All Posts
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Discover insights and stories from the developer community.
          </p>
        </div>

        {/* 🔍 Search/Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts by title or skill..."
            className="w-full sm:w-2/3 px-4 py-2 rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-indigo-500"
          />
        </div>

        {/* 🧾 Post List */}
        <div className="space-y-6">
          <PostList
            filterByUser={false}
            searchQuery={searchQuery}
            page={page}
            limit={postsPerPage}
          />
        </div>

        {/* 🔢 Pagination Controls */}
        <div className="mt-10 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => ( // assume max 5 pages for now
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-md ${
                page === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
