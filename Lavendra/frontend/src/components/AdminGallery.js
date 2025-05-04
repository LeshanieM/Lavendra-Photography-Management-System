import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Alert, ProgressBar, Modal, Button } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminGallery({ currentFolder, showNotification }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState('');
  const [customFilename, setCustomFilename] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (currentFolder) {
      fetchImages();
    }
  }, [currentFolder]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        showNotification('Please select a valid image file (JPEG, PNG, GIF, WEBP)', 'error');
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        showNotification('File is too large. Maximum size is 10MB', 'error');
        return;
      }
      
      setFile(selectedFile);
      const baseName = selectedFile.name.split('.')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase();
      setCustomFilename(baseName);
    }
  };

  const uploadImage = async () => {
    if (!file) {
      showNotification('Please select an image to upload', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', currentFolder);
      if (tags.trim()) formData.append('tags', tags);
      if (customFilename.trim()) formData.append('customFilename', customFilename);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      
      if (response.ok && data.imageUrl) {
        showNotification('Image uploaded successfully!');
        setFile(null);
        setTags('');
        setCustomFilename('');
        setTimeout(() => {
          fetchImages();
        }, 1000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      showNotification(err.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const confirmDelete = (publicId) => {
    setImageToDelete(publicId);
    setShowDeleteModal(true);
  };

  const deleteImage = async () => {
    if (!imageToDelete) return;
    
    try {
      const id = imageToDelete.split('/').pop();
      const folder = imageToDelete.split('/').slice(0, -1).join('/');
      
      const response = await fetch(`${API_URL}/images/${encodeURIComponent(folder)}/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showNotification('Image deleted successfully');
        setImages(images.filter(img => img.public_id !== imageToDelete));
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      showNotification(err.message || 'Error deleting image', 'error');
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="container-fluid mt-4">
      {/* Upload Section */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h2>Upload New Photo to {currentFolder || 'Gallery'}</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Select Image</label>
            <div className="d-flex align-items-center">
              <label className="btn btn-primary me-3">
                Choose File
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  disabled={uploading}
                />
              </label>
              <span className="text-muted">
                {file ? file.name : 'No file selected'}
              </span>
            </div>
          </div>
          
          {preview && (
            <div className="mb-3">
              <label className="form-label">Preview</label>
              <div className="border p-2 rounded">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="img-fluid d-block mx-auto"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Custom Filename (optional)</label>
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              className="form-control"
              placeholder="Enter custom filename"
              disabled={uploading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tags (optional, comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-control"
              placeholder="e.g. ceremony, family, reception"
              disabled={uploading}
            />
          </div>

          <div className="mb-3">
            <button
              onClick={uploadImage}
              disabled={!file || uploading || !currentFolder}
              className={`btn ${!file || uploading || !currentFolder ? 'btn-secondary' : 'btn-success'}`}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : 'Upload Photo'}
            </button>
          </div>

          {uploadProgress > 0 && (
            <div className="mb-3">
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
              <small className="text-muted">
                {uploadProgress < 100 ? 'Uploading...' : 'Upload complete!'}
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Photos in {currentFolder || 'Gallery'}</h2>
          <button 
            onClick={fetchImages}
            className="btn btn-sm btn-light"
          >
            Refresh
          </button>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading images...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : !currentFolder ? (
            <Alert variant="info" className="text-center">
              Please select a folder to view images.
            </Alert>
          ) : images.length === 0 ? (
            <Alert variant="warning" className="text-center">
              No images found in this folder. Upload some photos!
            </Alert>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {images.map(image => (
                <div key={image.public_id} className="col">
                  <div className="card h-100">
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={`${image.secure_url}?${Date.now()}`}
                        alt={image.public_id.split('/').pop()}
                        className="img-fluid w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                        }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <button 
                          onClick={() => confirmDelete(image.public_id)}
                          className="btn btn-danger btn-sm"
                          title="Delete image"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-2">
                      <small className="text-muted text-truncate d-block">
                        {image.public_id.split('/').pop()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteImage}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminGallery;