import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.DOCUMENTS, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const docs = (res.data?.data || []).map(d => ({
          id: d._id || d.id,
          name: d.name,
          description: d.description || '',
          fileType: d.fileType,
          fileSize: d.fileSize || 0,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt || d.createdAt,
          tags: Array.isArray(d.tags) ? d.tags : []
        }));
        setDocuments(docs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError(error.response?.data?.message || 'Failed to fetch documents. Please try again later.');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        alert(error.response?.data?.message || 'Failed to delete document. Please try again later.');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || doc.fileType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="bg-white shadow rounded-md p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <Link to="/documents/upload" className="btn btn-primary">
          Upload New Document
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="select select-bordered w-full max-w-xs"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option>
            <option value="pptx">PPTX</option>
          </select>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No documents found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <li key={doc.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 text-lg">
                        {doc.fileType === 'pdf' && '📄'}
                        {doc.fileType === 'docx' && '📝'}
                        {doc.fileType === 'xlsx' && '📊'}
                        {doc.fileType === 'pptx' && '📑'}
                      </div>
                      <Link to={`/documents/${doc.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {doc.name}
                      </Link>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <div className="badge badge-outline">
                        {doc.fileType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm text-gray-500">{doc.description}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{formatFileSize(doc.fileSize)} • Updated {formatDate(doc.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag, index) => (
                        <div key={index} className="badge badge-ghost">
                          {tag}
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/documents/${doc.id}/edit`} className="text-sm text-blue-600 hover:text-blue-800">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
