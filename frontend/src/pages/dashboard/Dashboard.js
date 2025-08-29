import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    recentDocuments: [],
    documentsByType: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, these would be separate API calls
        // For now, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          totalDocuments: 12,
          recentDocuments: [
            { id: '1', name: 'Business Proposal.pdf', fileType: 'pdf', updatedAt: '2025-08-25T10:30:00Z' },
            { id: '2', name: 'Financial Report Q2.xlsx', fileType: 'xlsx', updatedAt: '2025-08-24T14:15:00Z' },
            { id: '3', name: 'Project Timeline.docx', fileType: 'docx', updatedAt: '2025-08-23T09:45:00Z' },
            { id: '4', name: 'Marketing Presentation.pptx', fileType: 'pptx', updatedAt: '2025-08-22T16:20:00Z' },
          ],
          documentsByType: {
            pdf: 5,
            docx: 3,
            xlsx: 2,
            pptx: 2
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name || 'User'}!</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/documents/upload" className="card bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="text-center">
              <div className="text-blue-600 text-2xl mb-2">📄</div>
              <h3 className="font-medium">Upload Document</h3>
            </div>
          </Link>
          <Link to="/documents" className="card bg-green-50 hover:bg-green-100 transition-colors">
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">📚</div>
              <h3 className="font-medium">View All Documents</h3>
            </div>
          </Link>
          <Link to="/documents/convert" className="card bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="text-center">
              <div className="text-purple-600 text-2xl mb-2">🔄</div>
              <h3 className="font-medium">Convert Document</h3>
            </div>
          </Link>
          <Link to="/documents/merge" className="card bg-yellow-50 hover:bg-yellow-100 transition-colors">
            <div className="text-center">
              <div className="text-yellow-600 text-2xl mb-2">🔗</div>
              <h3 className="font-medium">Merge Documents</h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-white">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalDocuments}</div>
              <p className="text-gray-600">Total Documents</p>
            </div>
          </div>
          {Object.entries(stats.documentsByType).map(([type, count]) => (
            <div className="card bg-white" key={type}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{count}</div>
                <p className="text-gray-600">{type.toUpperCase()} Files</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Documents</h2>
          <Link to="/documents" className="text-blue-600 hover:text-blue-800">View all</Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stats.recentDocuments.map((doc) => (
              <li key={doc.id}>
                <Link to={`/documents/${doc.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 text-lg">
                          {doc.fileType === 'pdf' && '📄'}
                          {doc.fileType === 'docx' && '📝'}
                          {doc.fileType === 'xlsx' && '📊'}
                          {doc.fileType === 'pptx' && '📑'}
                        </div>
                        <p className="text-sm font-medium text-blue-600 truncate">{doc.name}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {doc.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Last updated on {formatDate(doc.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
