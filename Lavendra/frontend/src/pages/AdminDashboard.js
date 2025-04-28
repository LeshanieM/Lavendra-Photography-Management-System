import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminHeader from './AdminHeader';

//Admin header starts from line 309

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    age: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    mobile: '',
    bio: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers(); // If search is empty, fetch all users
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to search users',
      });
    }
  };

  // Add debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500); // Wait for 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const validateForm = (isEdit = false) => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation (required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (required only for new users)
    if (!isEdit && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Age validation (optional)
    if (
      formData.age &&
      (isNaN(formData.age) || formData.age < 18 || formData.age > 100)
    ) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    // Mobile validation (optional)
    if (formData.mobile && !/^\+?[\d\s-]{10,}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    // Address validation (optional)
    if (formData.address) {
      // Only validate address fields if at least one field is provided
      const hasAddressFields = Object.values(formData.address).some(
        (value) => value && value.trim()
      );

      if (hasAddressFields) {
        if (formData.address.street && !formData.address.street.trim()) {
          newErrors.street = 'Street address cannot be empty';
        }
        if (formData.address.city && !formData.address.city.trim()) {
          newErrors.city = 'City cannot be empty';
        }
        if (formData.address.country && !formData.address.country.trim()) {
          newErrors.country = 'Country cannot be empty';
        }
        if (formData.address.zipCode) {
          if (!formData.address.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code cannot be empty';
          } else if (!/^\d{5,6}$/.test(formData.address.zipCode)) {
            newErrors.zipCode = 'Please enter a valid ZIP code';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!validateForm(false)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User added successfully',
      });
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add user',
      });
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    if (!validateForm(true)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Don't send password if it's empty
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User updated successfully',
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update user',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User deleted successfully',
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete user',
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const generateReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('User Management Report', 14, 15);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Add table
    const tableColumn = ['Name', 'Email', 'Role', 'Age', 'Mobile', 'Location'];
    const tableRows = users.map((user) => [
      user.name,
      user.email,
      user.role,
      user.age || 'N/A',
      user.mobile || 'N/A',
      `${user.address?.city || ''}, ${user.address?.country || ''}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold',
      },
    });

    // Save the PDF
    doc.save('user-management-report.pdf');
  };

  return (
    <div  className="min-h-screen bg-gray-100">
      <AdminHeader />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="mb-6 bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">
                  Welcome, {user.name}!
                </h2>
                <p className="text-gray-600">
                  You are logged in as an administrator. Here you can manage all
                  users in the system.
                </p>
              </div>
              <button
                onClick={generateReport}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                Generate Report
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  role: 'user',
                  age: '',
                  address: {
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                  },
                  mobile: '',
                  bio: '',
                  profileImage: '',
                });
                setShowAddModal(true);
              }}
              className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Add User
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((tableUser) => (
                    <tr key={tableUser._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-lg font-medium">
                                {tableUser.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tableUser.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tableUser.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tableUser.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : tableUser.role === 'photographer'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {tableUser.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tableUser.mobile || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tableUser.age ? `${tableUser.age} years` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tableUser.address?.city || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tableUser.address?.country || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUser(tableUser);
                            setFormData({
                              name: tableUser.name,
                              email: tableUser.email,
                              role: tableUser.role,
                              age: tableUser.age,
                              address: tableUser.address,
                              mobile: tableUser.mobile,
                              bio: tableUser.bio,
                              profileImage: tableUser.profileImage,
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        {tableUser._id !== user._id && (
                          <button
                            onClick={() => handleDeleteUser(tableUser._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New User
                  </h3>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="role"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="user">User</option>
                      <option value="photographer">Photographer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleEditUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Edit User
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-name"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.name ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="edit-email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-password"
                      >
                        Password (leave blank to keep current)
                      </label>
                      <input
                        type="password"
                        id="edit-password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-age"
                      >
                        Age
                      </label>
                      <input
                        type="number"
                        id="edit-age"
                        min="18"
                        max="100"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.age ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.age && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.age}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-mobile"
                      >
                        Mobile
                      </label>
                      <input
                        type="tel"
                        id="edit-mobile"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.mobile ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.mobile && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.mobile}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-role"
                      >
                        Role
                      </label>
                      <select
                        id="edit-role"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={selectedUser._id === user._id}
                      >
                        <option value="user">User</option>
                        <option value="photographer">Photographer</option>
                        <option value="admin">Admin</option>
                      </select>
                      {selectedUser._id === user._id && (
                        <p className="text-sm text-gray-500 mt-1">
                          You cannot change your own role
                        </p>
                      )}
                    </div>
                    <div className="mb-4 col-span-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="edit-bio"
                      >
                        Bio
                      </label>
                      <textarea
                        id="edit-bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                      />
                    </div>
                    <div className="mb-4 col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Street"
                          value={formData.address?.street || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                street: e.target.value,
                              },
                            })
                          }
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.street ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.street && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.street}
                          </p>
                        )}
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.address?.city || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                city: e.target.value,
                              },
                            })
                          }
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.city ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city}
                          </p>
                        )}
                        <input
                          type="text"
                          placeholder="State"
                          value={formData.address?.state || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                state: e.target.value,
                              },
                            })
                          }
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.state ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.state}
                          </p>
                        )}
                        <input
                          type="text"
                          placeholder="Country"
                          value={formData.address?.country || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                country: e.target.value,
                              },
                            })
                          }
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.country ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.country}
                          </p>
                        )}
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={formData.address?.zipCode || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                zipCode: e.target.value,
                              },
                            })
                          }
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.zipCode ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
