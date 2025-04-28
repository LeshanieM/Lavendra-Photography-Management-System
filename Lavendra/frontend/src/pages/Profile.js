import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    mobile: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          age: userData.age || '',
          mobile: userData.mobile || '',
          address: userData.address || {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          },
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch user data',
        });
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToUpdate = {
        name: formData.name,
        bio: formData.bio,
        age: formData.age ? parseInt(formData.age) : undefined,
        mobile: formData.mobile,
        address: formData.address,
      };

      // Remove undefined or empty values
      Object.keys(dataToUpdate).forEach((key) => {
        if (dataToUpdate[key] === undefined || dataToUpdate[key] === '') {
          delete dataToUpdate[key];
        }
      });

      // Clean up address object
      if (dataToUpdate.address) {
        Object.keys(dataToUpdate.address).forEach((key) => {
          if (!dataToUpdate.address[key]) {
            delete dataToUpdate.address[key];
          }
        });
        // Remove address if all fields are empty
        if (Object.keys(dataToUpdate.address).length === 0) {
          delete dataToUpdate.address;
        }
      }

      await updateProfile(dataToUpdate);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  switch (user?.role) {
                    case 'admin':
                      navigate('/admin');
                      break;
                    case 'photographer':
                      navigate('/photographer');
                      break;
                    case 'user':
                      navigate('/user');
                      break;
                    default:
                      navigate('/signin');
                  }
                }}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition-colors duration-200 shadow-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-8 bg-gradient-to-r from-yellow-600 to-yellow-700">
              <h3 className="text-2xl font-bold text-white">
                Profile Information
              </h3>
              <p className="mt-2 text-yellow-100">
                Update your profile details
              </p>
            </div>
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      id="age"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
                        errors.age ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
                        errors.mobile ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Address Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        id="street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
                          errors.street ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.street}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          id="city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
                            errors.city ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          id="state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
                            errors.state ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          name="address.country"
                          id="country"
                          value={formData.address.country}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
                            errors.country ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="address.zipCode"
                          id="zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 ${
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

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={user?.role}
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-500"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition-colors duration-200 shadow-sm"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
