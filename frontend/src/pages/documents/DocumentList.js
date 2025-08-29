import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockDocuments = [
          { id: '1', name: 'Business Proposal.pdf', description: 'Q3 business proposal for client XYZ', fileType: 'pdf', fileSize: 2500000, createdAt: '2025-08-25T10:30:00Z', updatedAt: '2025-08-25T10:30:00Z', tags: ['business', 'proposal'] },
          { id: '2', name: 'Financial Report Q2.xlsx', description: 'Quarterly financial report', fileType: 'xlsx', fileSize: 1800000, createdAt: '2025-08-24T14:15:00Z', updatedAt: '2025-08-24T14:15:00Z', tags: ['finance', 'report'] },
          { id: '3', name: 'Project Timeline.docx', description: 'Project timeline and milestones', fileType: 'docx', fileSize: 950000, createdAt: '2025-08-23T09:45:00Z', updatedAt: '2025-08-23T09:45:00Z', tags: ['project', 'timeline'] },
          { id: '4', name: 'Marketing Presentation.pptx', description: 'Marketing strategy presentation', fileType: 'pptx', fileSize: 3200000, createdAt: '2025-08-22T16:20:00Z', updatedAt: '2025-08-22T16:20:00Z', tags: ['marketing', 'presentation'] },
          { id: '5', name: 'Contract Agreement.pdf', description: 'Legal contract for service agreement', fileType: 'pdf', fileSize: 1200000, createdAt: '2025-08-21T11:10:00Z', updatedAt: '2025-08-21T11:10:00Z', tags: ['legal', 'contract'] },
          { id: '6', name: 'Employee Handbook.pdf', description: 'Company employee handbook', fileType: 'pdf', fileSize: 4500000, createdAt: '2025-08-20T13:25:00Z', updatedAt: '2025-08-20T13:25:00Z', tags: ['hr', 'handbook'] },
          { id: '7', name: 'Sales Data.xlsx', description: 'Monthly sales data analysis', fileType: 'xlsx', fileSize: 2100000, createdAt: '2025-08-19T15:40:00Z', updatedAt: '2025-08-19T15:40:00Z', tags: ['sales', 'data'] },
          { id: '8', name: 'Meeting Minutes.docx', description: 'Board meeting minutes', fileType: 'docx', fileSize: 850000, createdAt: '2025-08-18T09:30:00Z', updatedAt: '2025-08-18T09:30:00Z', tags: ['meeting', 'minutes'] },
        ];
        
        setDocuments(mockDocuments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to fetch documents. Please try again later.');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        // In a real application, this would be an API call
        // For now, we'll just update the state
        
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document. Please try again later.');
      }
    }
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
      <div className="page-container flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
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
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="form-input"
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
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doc.fileType.toUpperCase()}
                      </p>
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
                    <div className="flex space-x-1">
                      {doc.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          {tag}
                        </span>
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
