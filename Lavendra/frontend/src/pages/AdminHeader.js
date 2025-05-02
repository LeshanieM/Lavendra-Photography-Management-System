import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your logout logic
    navigate('/signin'); // example redirect after logout
  };

  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/Admin1')}>Admin Dashboard</button>

            <button onClick={() => navigate('/inquiryDashboard')}>
              Inquiry
            </button>

            <button onClick={() => navigate('/admingallery')}>Gallery</button>

  
            <button onClick={() => navigate('/addnotice')}>
            Add notice
            </button>
       

            <button onClick={() => navigate('/adminpaymentview')}>
              Payments
            </button>

            <button onClick={() => navigate('/create-package')}>
              Add-package
            </button>

            

            <button onClick={() => navigate('/deliveries')}>Delivery</button>

            <button onClick={() => navigate('/manage-blogs')}>Blogs</button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
