import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import FolderManagement from '../components/FolderManagement';
import AdminGallery from '../components/AdminGallery';
import AdminHeader from '../pages/AdminHeader';


function AdminPage() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { folderId } = useParams();

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleNotificationClose = () => {
    setNotification({ show: false, message: '', type: '' });
  };

  return (
    <div  className="min-h-screen bg-gray-100">
        <AdminHeader />
    <div className="min-h-screen bg-gray-100">
      <Header isAdmin={true} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Notification notification={notification} onClose={handleNotificationClose} />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <FolderManagement 
              onFolderChange={setCurrentFolder}
              currentFolder={currentFolder}
              showNotification={showNotification}
              isAdmin={true}
            />
          </div>
          
          <div className="w-full md:w-3/4">
            <AdminGallery 
              currentFolder={currentFolder}
              showNotification={showNotification}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
    </div>
  );
}

export default AdminPage;