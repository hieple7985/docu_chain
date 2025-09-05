import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);

      await axios.post(API_ENDPOINTS.DOCUMENT_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Document uploaded successfully!');
      setTimeout(() => {
        navigate('/documents');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h1>
        
        {error && (
          <div role="alert" className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div role="alert" className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.pptx,.txt,.jpg,.png"
              className="file-input file-input-bordered w-full"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: PDF, DOCX, XLSX, PPTX, TXT, JPG, PNG
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter document name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="textarea textarea-bordered w-full"
              placeholder="Enter document description (optional)"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
            <button type="button" onClick={() => navigate('/documents')} className="btn btn-ghost flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
