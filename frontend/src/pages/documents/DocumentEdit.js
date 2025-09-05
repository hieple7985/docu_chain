import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

const DocumentEdit = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: ''
  });
  
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const doc = response.data.data;
      setDocument(doc);
      setFormData({
        name: doc.name || '',
        description: doc.description || '',
        tags: doc.tags ? doc.tags.join(', ') : ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await axios.put(`${API_ENDPOINTS.DOCUMENTS}/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Document updated successfully!');
      setDocument(response.data.data);
      
      setTimeout(() => {
        navigate(`/documents/${id}`);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update document');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">Document not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Document</h1>
          <button
            onClick={() => navigate(`/documents/${id}`)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., important, contract, 2025"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/documents/${id}`)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Document Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Document Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Type:</span> {document.fileType}</div>
            <div><span className="font-medium">Size:</span> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</div>
            <div><span className="font-medium">Created:</span> {new Date(document.createdAt).toLocaleDateString()}</div>
            <div><span className="font-medium">Last Updated:</span> {new Date(document.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEdit;
