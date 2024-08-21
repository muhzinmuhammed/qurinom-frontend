import React, { useState } from 'react';
import { useGetPostDataQuery } from '../../features/api/postAPI/postApi';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8; // Number of posts per page

  const { data, isLoading, isError } = useGetPostDataQuery({ page, limit, search: searchTerm });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts.</p>;

  const totalPages = data?.totalPages || 1;

  return (
    <>
      <form onSubmit={handleSearch} className="flex justify-center mt-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts..."
          className="px-4 py-2 border rounded-lg"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Search
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-4 mt-5 p-4">
        {data?.data?.map((card) => (
          <div key={card.id} className="max-w-xs rounded overflow-hidden shadow-lg">
            <img className="w-full" src='https://qurinomsolutions.com/wp-content/uploads/2021/03/Group-11.png' alt={card.title} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Title: {card?.title}</div>
              <p className="text-gray-700 text-base">Description: {card?.content}</p>
              <p className="text-gray-700 text-base">Author: {card?.userId?.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 border rounded-lg ${
              page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Home;
