import React from 'react';

const UniversityCard = ({ university, onClick }) => {
  return (
    <div
      className='bg-white shadow-xl rounded-2xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
      onClick={() => onClick(university)}
    >
      <img
        src={university.image}
        alt={`${university.name} logo`}
        className='w-full h-48 object-cover'
      />
      <div className='p-6'>
        <h3 className='text-3xl font-bold text-gray-800 mb-2'>{university.name}</h3>
        <p className='text-md text-gray-600'>{university.description}</p>
      </div>
    </div>
  );
};

export default UniversityCard;