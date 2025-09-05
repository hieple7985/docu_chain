import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';
import PdfViewer from '../../components/PdfViewer';

const DocumentDetail = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationResult, setOperationResult] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const previewUrl = useMemo(() => {
    if (!document?.fileUrl) return '';
    // Ensure absolute path for CRA dev when backend serves /uploads
    if (document.fileUrl.startsWith('http')) return document.fileUrl;
    const base = process.env.REACT_APP_BACKEND_BASE || 'http://localhost:5001';
    return `${base}${document.fileUrl.startsWith('/') ? '' : '/'}${document.fileUrl}`;
  }, [document]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDocument(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleOperation = async (operation, data = {}) => {
    setOperationLoading(true);
    setOperationResult(null);


    try {
      let endpoint;
      let payload = { documentId: id, ...data };

      switch (operation) {
        case 'optimize':
          endpoint = API_ENDPOINTS.DOCUMENT_OPTIMIZE;
          break;
        case 'extract-text':
          endpoint = API_ENDPOINTS.DOCUMENT_EXTRACT_TEXT;
          break;
        case 'protect':
          endpoint = API_ENDPOINTS.DOCUMENT_PROTECT;
          break;
        case 'split':
          endpoint = API_ENDPOINTS.DOCUMENT_SPLIT;
          break;
        default:
          throw new Error('Invalid operation');
      }

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setOperationResult({
        success: true,
        message: response.data.message,
        data: response.data.data
      });
    } catch (err) {
      setOperationResult({
        success: false,
        message: err.response?.data?.message || 'Operation failed'
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleProtect = () => {
    const password = prompt('Enter password to protect document:');
    if (password) {
      handleOperation('protect', { password });
    }
  };

  const handleSplit = () => {
    const pages = prompt('Enter page numbers to split (e.g., 1,3,5):');
    if (pages) {
      const pageArray = pages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
      if (pageArray.length > 0) {
        handleOperation('split', { pages: pageArray });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Document not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{document.name}</h1>
          <button
            onClick={() => navigate('/documents')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Back to Documents
          </button>
        </div>

        {/* Document Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Document Information</h3>
            <div className="space-y-2">
              <div><span className="font-medium">Type:</span> {document.fileType}</div>
              <div><span className="font-medium">Size:</span> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</div>
              <div><span className="font-medium">Protected:</span> {document.isProtected ? 'Yes' : 'No'}</div>
              <div><span className="font-medium">Signed:</span> {document.isSigned ? 'Yes' : 'No'}</div>
              <div><span className="font-medium">Created:</span> {new Date(document.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-600">{document.description || 'No description provided'}</p>
          </div>
        </div>

        {/* Operations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Document Operations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleOperation('optimize')}
              disabled={operationLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Optimize PDF
            </button>

            <button
              onClick={() => handleOperation('extract-text')}
              disabled={operationLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Extract Text
            </button>

            <button
              onClick={handleProtect}
              disabled={operationLoading || document.isProtected}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
            >
              Protect PDF
            </button>

            <button
              onClick={handleSplit}
              disabled={operationLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Split PDF
            </button>
          </div>
        </div>

        {/* Operation Result */}
        {operationResult && (
          <div className={`border rounded-md p-4 ${
            operationResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`font-medium ${
              operationResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {operationResult.success ? 'Success!' : 'Error'}
            </h4>
            <p className={`mt-1 ${
              operationResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {operationResult.message}
            </p>
            {operationResult.data && (
              <pre className="mt-2 text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(operationResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* File Preview */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">File Preview</h3>
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="mb-3 text-sm text-gray-600 break-all">File URL: {document.fileUrl}</div>
            <PdfViewer fileUrl={previewUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
