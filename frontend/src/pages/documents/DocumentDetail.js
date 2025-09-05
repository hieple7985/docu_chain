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

  const [showProtect, setShowProtect] = useState(false);
  const [protectPassword, setProtectPassword] = useState('');
  const [showSplit, setShowSplit] = useState(false);
  const [splitPages, setSplitPages] = useState('');
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

  const handleProtect = () => setShowProtect(true);

  const confirmProtect = () => {
    if (!protectPassword) return;
    handleOperation('protect', { password: protectPassword });
    setShowProtect(false);
    setProtectPassword('');
  };

  const handleSplit = () => setShowSplit(true);

  const confirmSplit = () => {
    if (!splitPages) return;
    const pageArray = splitPages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    if (pageArray.length > 0) {
      handleOperation('split', { pages: pageArray });
    }
    setShowSplit(false);
    setSplitPages('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
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
            className="btn btn-ghost"
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
              className="btn btn-primary"
            >
              Optimize PDF
            </button>

            <button
              onClick={() => handleOperation('extract-text')}
              disabled={operationLoading}
              className="btn btn-success"
            >
              Extract Text
            </button>

            <button
              onClick={handleProtect}
              disabled={operationLoading || document.isProtected}
              className="btn btn-warning"
            >
              Protect PDF
            </button>

            <button
              onClick={handleSplit}
              disabled={operationLoading}
              className="btn btn-secondary"
            >
              Split PDF
            </button>
          </div>
        </div>

        {/* Operation Result */}
        {operationResult && (
          <div className="toast toast-end z-10">
            <div className={`${operationResult.success ? 'alert alert-success' : 'alert alert-error'}`}>
              <span>{operationResult.message}</span>
            </div>
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

        {/* Protect Modal */}
        {showProtect && (
          <dialog className="modal" open>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Protect PDF</h3>
              <p className="py-2">Enter a password to protect this document.</p>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={protectPassword}
                onChange={(e) => setProtectPassword(e.target.value)}
              />
              <div className="modal-action">
                <button className="btn" onClick={() => { setShowProtect(false); setProtectPassword(''); }}>Cancel</button>
                <button className="btn btn-warning" onClick={confirmProtect} disabled={operationLoading || !protectPassword}>Protect</button>
              </div>
            </div>
          </dialog>
        )}

        {/* Split Modal */}
        {showSplit && (
          <dialog className="modal" open>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Split PDF</h3>
              <p className="py-2">Enter page numbers to split (e.g., 1,3,5)</p>
              <input
                type="text"
                placeholder="e.g., 1,3,5"
                className="input input-bordered w-full"
                value={splitPages}
                onChange={(e) => setSplitPages(e.target.value)}
              />
              <div className="modal-action">
                <button className="btn" onClick={() => { setShowSplit(false); setSplitPages(''); }}>Cancel</button>
                <button className="btn btn-secondary" onClick={confirmSplit} disabled={operationLoading || !splitPages}>Split</button>
              </div>
            </div>
          </dialog>
        )}

    </div>
  );
};

export default DocumentDetail;
