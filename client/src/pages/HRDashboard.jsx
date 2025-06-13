import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../redux/slices/authSlice';
import { FiUsers, FiUserPlus, FiEdit2, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const HRDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUsers(response.data.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">HR Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="btn-accent flex items-center space-x-2"
              >
                <FiRefreshCw />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-error/10 text-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dark">User Management</h2>
                <button
                  onClick={fetchUsers}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiRefreshCw />
                  <span>Refresh</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center">
                                <FiUsers className="w-6 h-6 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isActive
                                  ? 'bg-success/10 text-success'
                                  : 'bg-error/10 text-error'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewProfile(user)}
                              className="text-primary hover:text-primary-dark"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-1">
            {selectedUser && (
              <div className="card">
                <h3 className="text-lg font-medium text-dark mb-6">User Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                    <p className="mt-1">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Role</h4>
                    <p className="mt-1">{selectedUser.role}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedUser.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                        }`}
                      >
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                    <p className="mt-1">{selectedUser.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    {selectedUser.address ? (
                      <div className="mt-1 space-y-1">
                        <p>{selectedUser.address.street}</p>
                        <p>
                          {selectedUser.address.city}, {selectedUser.address.state}{' '}
                          {selectedUser.address.zipCode}
                        </p>
                        <p>{selectedUser.address.country}</p>
                      </div>
                    ) : (
                      <p className="mt-1">No address provided</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                    <p className="mt-1">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HRDashboard; 