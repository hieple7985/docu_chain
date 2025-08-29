import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Intelligent Document Management
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Transform how you create, process, and manage documents with DocuChain
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/register"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="ml-4 px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for document management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              DocuChain provides a comprehensive set of tools for all your document needs
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Document Creation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create documents from templates or from scratch with our intuitive editor
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">PDF Conversion</h3>
                <p className="mt-2 text-base text-gray-500">
                  Convert documents to and from PDF format with high fidelity
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Document Merging</h3>
                <p className="mt-2 text-base text-gray-500">
                  Combine multiple documents into a single file with ease
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Text Extraction</h3>
                <p className="mt-2 text-base text-gray-500">
                  Extract text from documents for analysis or processing
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Electronic Signatures</h3>
                <p className="mt-2 text-base text-gray-500">
                  Sign documents electronically with legal validity
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Password Protection</h3>
                <p className="mt-2 text-base text-gray-500">
                  Secure your documents with password protection and encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Create your account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
