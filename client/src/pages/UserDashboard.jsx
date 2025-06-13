import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout, updateProfile, changePassword } from '../redux/slices/authSlice';
import { FiUser, FiSettings, FiLogOut, FiEdit, FiLock } from 'react-icons/fi';
import { validatePhoneNumber, validateAddress, validationMessages } from '../utils/validation';

const UserDashboard = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber || '',
    address: user.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Reset form errors when switching between edit modes
    setFormErrors({});
  }, [isEditing, isChangingPassword]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const validateProfileData = () => {
    const errors = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = validationMessages.required;
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = validationMessages.required;
    }

    if (profileData.phoneNumber && !validatePhoneNumber(profileData.phoneNumber)) {
      errors.phoneNumber = validationMessages.phone;
    }

    if (isEditing && !validateAddress(profileData.address)) {
      errors.address = validationMessages.address;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = validationMessages.required;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = validationMessages.required;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = validationMessages.required;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = validationMessages.passwordMatch;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileData()) {
      return;
    }

    const result = await dispatch(updateProfile(profileData));
    if (!result.error) {
      setIsEditing(false);
      setFormErrors({});
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }

    const { confirmPassword, ...data } = passwordData;
    const result = await dispatch(changePassword(data));
    if (!result.error) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setFormErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">User Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary flex items-center space-x-2"
              >
                <FiEdit />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="btn-primary flex items-center space-x-2"
              >
                <FiLock />
                <span>Change Password</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn-accent flex items-center space-x-2"
              >
                <FiLogOut />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-6 sm:px-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="card">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiSettings className="w-5 h-5" />
                    <span>Role: {user.role}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiUser className="w-5 h-5" />
                    <span>Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              {isChangingPassword ? (
                <div className="card">
                  <h3 className="text-lg font-medium text-dark mb-6">
                    Change Password
                  </h3>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`input mt-1 ${formErrors.currentPassword ? 'border-error' : ''}`}
                        required
                      />
                      {formErrors.currentPassword && (
                        <p className="mt-1 text-sm text-error">{formErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`input mt-1 ${formErrors.newPassword ? 'border-error' : ''}`}
                        required
                      />
                      {formErrors.newPassword && (
                        <p className="mt-1 text-sm text-error">{formErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`input mt-1 ${formErrors.confirmPassword ? 'border-error' : ''}`}
                        required
                      />
                      {formErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-error">{formErrors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="card">
                  <h3 className="text-lg font-medium text-dark mb-6">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </h3>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleChange}
                            className={`input mt-1 ${formErrors.firstName ? 'border-error' : ''}`}
                            required
                          />
                          {formErrors.firstName && (
                            <p className="mt-1 text-sm text-error">{formErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleChange}
                            className={`input mt-1 ${formErrors.lastName ? 'border-error' : ''}`}
                            required
                          />
                          {formErrors.lastName && (
                            <p className="mt-1 text-sm text-error">{formErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleChange}
                          className={`input mt-1 ${formErrors.phoneNumber ? 'border-error' : ''}`}
                          placeholder="+1234567890"
                        />
                        {formErrors.phoneNumber && (
                          <p className="mt-1 text-sm text-error">{formErrors.phoneNumber}</p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700">Address</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Street
                          </label>
                          <input
                            type="text"
                            name="address.street"
                            value={profileData.address.street}
                            onChange={handleChange}
                            className={`input mt-1 ${formErrors.address ? 'border-error' : ''}`}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={profileData.address.city}
                              onChange={handleChange}
                              className={`input mt-1 ${formErrors.address ? 'border-error' : ''}`}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              State
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={profileData.address.state}
                              onChange={handleChange}
                              className={`input mt-1 ${formErrors.address ? 'border-error' : ''}`}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={profileData.address.zipCode}
                              onChange={handleChange}
                              className={`input mt-1 ${formErrors.address ? 'border-error' : ''}`}
                              placeholder="12345"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Country
                            </label>
                            <input
                              type="text"
                              name="address.country"
                              value={profileData.address.country}
                              onChange={handleChange}
                              className={`input mt-1 ${formErrors.address ? 'border-error' : ''}`}
                              required
                            />
                          </div>
                        </div>
                        {formErrors.address && (
                          <p className="mt-1 text-sm text-error">{formErrors.address}</p>
                        )}
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                          <p className="mt-1">{user.firstName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                          <p className="mt-1">{user.lastName}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                        <p className="mt-1">{user.phoneNumber || 'Not provided'}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Address</h4>
                        {user.address ? (
                          <div className="mt-1 space-y-1">
                            <p>{user.address.street}</p>
                            <p>
                              {user.address.city}, {user.address.state} {user.address.zipCode}
                            </p>
                            <p>{user.address.country}</p>
                          </div>
                        ) : (
                          <p className="mt-1">No address provided</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard; 