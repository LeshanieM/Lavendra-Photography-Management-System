import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import FolderManagement from '../components/FolderManagement';
import UserGallery from '../components/UserGallery';

function UserPage() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedFolder, setVerifiedFolder] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/folders/validate-token/${token}`);
      const data = await response.json();
      
      if (data.valid) {
        setCurrentFolder(data.folderName);
        setVerifiedFolder(data.folderName);
        setEmailVerified(true);
        showNotification(`Access granted to folder: ${data.folderName}`);
      } else {
        showNotification(data.error || 'Invalid or expired token', 'error');
      }
    } catch (err) {
      console.error('Error validating token:', err);
      showNotification('Failed to validate token', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleNotificationClose = () => {
    setNotification({ show: false, message: '', type: '' });
  };

  const handleEmailVerified = (verified, folderName) => {
    setEmailVerified(verified);
    if (folderName) {
      setVerifiedFolder(folderName);
      setCurrentFolder(folderName);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isAdmin={false} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Notification notification={notification} onClose={handleNotificationClose} />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <FolderManagement 
              onFolderChange={setCurrentFolder}
              currentFolder={currentFolder}
              showNotification={showNotification}
              isAdmin={false}
              onEmailVerified={handleEmailVerified}
            />
          </div>
          
          <div className="w-full md:w-3/4">
            <UserGallery 
              currentFolder={currentFolder}
              showNotification={showNotification}
              emailVerified={emailVerified}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserPage;