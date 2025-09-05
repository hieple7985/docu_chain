import React from 'react';

const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">DocuChain</h2>
            <p className="text-sm text-gray-400">Intelligent Document Management Platform</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <a href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
            <a href="/contact" className="text-sm text-gray-400 hover:text-white">Contact Us</a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} DocuChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
