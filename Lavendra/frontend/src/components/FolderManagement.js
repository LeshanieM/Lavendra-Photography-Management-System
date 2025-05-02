import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function FolderManagement({ onFolderChange, currentFolder, showNotification, isAdmin, onEmailVerified }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareFolder, setShareFolder] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [verifiedFolder, setVerifiedFolder] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/folders`);
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      setFolders(data);
    } catch (err) {
      console.error('Error fetching folders:', err);
      showNotification('Failed to load folders: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      showNotification('Please enter a folder name', 'error');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch(`${API_URL}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: newFolderName }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showNotification(`Folder "${data.folderName}" created successfully`);
        setNewFolderName('');
        setShowCreateForm(false);
        fetchFolders();
      } else {
        throw new Error(data.error || 'Failed to create folder');
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      showNotification(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const selectFolder = (folderName) => {
    if (!isAdmin && !emailVerified) {
      showNotification('Please verify your email first', 'error');
      return;
    }
    onFolderChange(folderName);
  };

  const handleShareFolder = (folderName) => {
    setShareFolder(folderName);
  };

  const confirmShare = async (e) => {
    e.preventDefault();
    if (!shareFolder || !shareEmail.trim()) {
      showNotification('Please enter a valid email', 'error');
      return;
    }

    try {
      setSharing(true);
      const response = await fetch(`${API_URL}/folders/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderName: shareFolder,
          email: shareEmail,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification(`Share link sent to ${shareEmail}. User will need to verify this email to access the folder.`);
        setShareEmail('');
        setShareFolder(null);
      } else {
        throw new Error(data.error || 'Failed to share folder');
      }
    } catch (err) {
      console.error('Error sharing folder:', err);
      showNotification(err.message, 'error');
    } finally {
      setSharing(false);
    }
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !currentFolder) {
      showNotification('Please enter your email and select a folder', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/folders/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          folderName: currentFolder,
        }),
      });

      const data = await response.json();
      if (response.ok && data.verified) {
        setEmailVerified(true);
        setVerifiedFolder(data.folderName);
        if (onEmailVerified) onEmailVerified(true, data.folderName);
        showNotification('Email verified successfully!');
      } else {
        throw new Error(data.error || 'Email verification failed');
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      showNotification(err.message, 'error');
    }
  };

  // Only show the verified folder or all folders for admin
  const visibleFolders = isAdmin 
    ? folders 
    : folders.filter(folder => folder.path === verifiedFolder);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Folders</h2>

      {!isAdmin && !emailVerified && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-md">
          <h3 className="font-medium mb-2">Verify Your Email</h3>
          <p className="text-sm mb-3">Please select a folder and enter the email address that was used to share it with you.</p>
          <form onSubmit={verifyEmail} className="space-y-3">
            <select
              value={currentFolder || ''}
              onChange={(e) => onFolderChange(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              required
            >
              <option value="">Select a folder</option>
              {folders.map(folder => (
                <option key={folder.path} value={folder.path}>
                  {folder.name}
                </option>
              ))}
            </select>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your email address"
              className="w-full border px-3 py-2 rounded-md"
              required
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Verify
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading folders...</p>
      ) : (
        visibleFolders.map(folder => (
          <div key={folder.path} className="flex justify-between items-center mb-2">
            <button
              onClick={() => selectFolder(folder.path)}
              className={`flex-1 text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                currentFolder === folder.path ? 'bg-blue-100 text-blue-800' : ''
              }`}
            >
              {folder.name}
            </button>
            {isAdmin && (
              <button
                onClick={() => handleShareFolder(folder.name)}
                className="ml-2 p-1 text-gray-500 hover:text-blue-600"
                title="Share folder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
          </div>
        ))
      )}

      {isAdmin && showCreateForm && (
        <form onSubmit={handleCreateFolder} className="mt-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="border px-2 py-1 mr-2 rounded"
          />
          <button type="submit" disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      {isAdmin && (
        <button onClick={() => setShowCreateForm(prev => !prev)}
                className="mt-4 text-blue-600 hover:underline">
          {showCreateForm ? 'Cancel' : 'New Folder'}
        </button>
      )}

      {shareFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Share "{shareFolder}"</h3>
            <form onSubmit={confirmShare}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShareFolder(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sharing}
                  className={`px-4 py-2 rounded text-white ${
                    sharing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {sharing ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderManagement;