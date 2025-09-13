import React from 'react';
import bedIcon from '../assets/medical-bed.png';
import { useAuth } from '../context/AuthContext'

const Home = () => {

  const { user } = useAuth();

  return (
    <>
    {user ? (
      <div className="m-2 p-2 font-semibold">
        When the user is logged in
      </div>
    ) : (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <img src={bedIcon} alt="Bed Icon" className="mx-auto h-24 w-auto mb-6" />
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl md:text-7xl">
            <span className="block">Hospital Bed </span>
            <span className="block text-indigo-600 mt-2">Notification System</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            A modern, lightweight system for real-time bed assignment and patient admission notifications.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              Get Started
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-8 py-3 border-2 border-indigo-600 text-base font-medium rounded-md text-indigo-700 bg-transparent hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Home;