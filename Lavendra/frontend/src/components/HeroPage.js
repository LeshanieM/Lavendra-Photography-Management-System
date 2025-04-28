// src/components/Hero.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="d-flex align-items-center min-vh-100 bg-light" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #f9f3ff 100%)' }}>
      <div className="container">
        <div className="row align-items-center">
          
          {/* Image Column - Left */}
          <div className="col-12 col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
            <div className="position-relative w-100" style={{ maxWidth: '500px', height: 'auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(106, 27, 154, 0.2)' }}>
              <img
                src="https://www.nyip.edu/media/zoo/images/top-5-photography-trends-in-2023-for-budding-photographers-1_7ab20070adafbe94d85f51804d9a9bdf.jpg"
                alt="Photography"
                className="img-fluid"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.jpg';
                }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background: 'linear-gradient(to bottom, rgba(106,27,154,0.1) 0%, rgba(106,27,154,0.3) 100%)'
                }}
              ></div>
            </div>
          </div>

          {/* Text Content Column - Right */}
          <div className="col-12 col-md-6">
            <div className="p-4 bg-white bg-opacity-75 rounded shadow-sm">
              <h1 className="fw-bold mb-3 text-center text-md-start" style={{ color: '#6a1b9a', fontSize: '2.5rem' }}>
                Capture Your World
              </h1>
              <p className="lead mb-4 text-center text-md-start" style={{ color: '#5a1084' }}>
                Discover breathtaking photography and share your unique vision with the world.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start">
                <button
                  className="btn"
                  style={{
                    background: 'linear-gradient(45deg, #6a1b9a, #8e44ad)',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  onClick={() => navigate("/home")}
                >
                  Begin Exploring
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;