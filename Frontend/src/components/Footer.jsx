import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="containermax-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Hospital Bed Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;