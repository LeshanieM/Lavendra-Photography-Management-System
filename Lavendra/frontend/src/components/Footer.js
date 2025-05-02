import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white mt-8 py-4 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>Photo Gallery © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;