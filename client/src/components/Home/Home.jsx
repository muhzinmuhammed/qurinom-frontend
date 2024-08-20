import React from 'react';
import { useGetPostDataQuery } from '../../features/api/postAPI/postApi';

const Home = () => {
  const { data, isLoading, isError } = useGetPostDataQuery();
  console.log(data?.data, "data");
  
 

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5 p-4">
      {data?.data?.map((card) => (
        <div key={card.id} className="max-w-xs rounded overflow-hidden shadow-lg">
              <img className="w-full" src='https://qurinomsolutions.com/wp-content/uploads/2021/03/Group-11.png' alt={card.title} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Title: {card?.title}</div>
            <p className="text-gray-700 text-base">Description: {card?.content}</p>
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default Home;