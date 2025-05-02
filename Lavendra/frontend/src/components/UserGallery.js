// src/components/UserGallery.js
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserGallery({ currentFolder, showNotification, emailVerified }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentFolder && emailVerified) {
      fetchImages();
    }
  }, [currentFolder, emailVerified]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/images?folder=${encodeURIComponent(currentFolder)}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(`Failed to load images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Photos in {currentFolder || 'Gallery'}</h2>
          {emailVerified && (
            <button 
              onClick={fetchImages}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Refresh
            </button>
          )}
        </div>

        {!emailVerified ? (
          <div className="text-center py-8 text-gray-500">
            Please verify your email to view photos in this folder.
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500">Loading images...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : !currentFolder ? (
          <div className="text-center py-8 text-gray-500">
            Please select a folder to view images.
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No images found in this folder.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.public_id} className="relative group">
                <img 
                  src={image.secure_url} 
                  alt={image.public_id.split('/').pop()}
                  className="w-full h-48 object-cover rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserGallery;