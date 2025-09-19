import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GoBack = ({ to = '/dashboard' }) => {
  return (
    <Link
      to={to}
      className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md w-max"
    >
      <ArrowLeft size={20} className="mr-2" />
      <span className="text-lg font-medium">Go back</span>
    </Link>
  );
};

export default GoBack;