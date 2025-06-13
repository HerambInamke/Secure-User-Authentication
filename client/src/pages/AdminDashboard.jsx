import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../redux/slices/authSlice';
import { FiUsers, FiUserPlus, FiTrash2, FiEdit2, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setStats(response.data.data);
    } catch (error) {
      setError('Failed to fetch statistics');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchUsers();
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const handleUpdateStatus = async (userId, isActive) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}/status`,
        { isActive },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchUsers();
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
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

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-primary/10">
              <h3 className="text-lg font-medium text-primary">Total Users</h3>
              <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
            </div>
            <div className="card bg-success/10">
              <h3 className="text-lg font-medium text-success">Active Users</h3>
              <p className="text-3xl font-bold text-success">{stats.activeUsers}</p>
            </div>
            <div className="card bg-secondary/10">
              <h3 className="text-lg font-medium text-secondary">HR Users</h3>
              <p className="text-3xl font-bold text-secondary">{stats.hrUsers}</p>
            </div>
            <div className="card bg-accent/10">
              <h3 className="text-lg font-medium text-accent">Recent Registrations</h3>
              <p className="text-3xl font-bold text-accent">{stats.recentRegistrations}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
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
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                          className="input py-1"
                        >
                          <option value="user">User</option>
                          <option value="hr">HR</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleUpdateStatus(user._id, !user.isActive)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-success/10 text-success'
                              : 'bg-error/10 text-error'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-error hover:text-error-dark"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 