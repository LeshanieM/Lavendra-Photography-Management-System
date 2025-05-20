import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ overflowX: 'hidden' }}>
      {/* Hero Section - Made more compact */}
      <section
        className="d-flex align-items-center py-4"
        style={{
          minHeight: '40vh', // Reduced from 90vh
          backgroundColor: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
            zIndex: 0,
          }}
        ></div>

        <div className="container position-relative">
          <div className="row align-items-center">
            {/* Text */}
            <div className="col-md-6 mb-3 mb-md-0">
              <h1
                className="fw-bold mb-3" // Added margin bottom
                style={{
                  color: '#6a1b9a',
                  fontSize: '3rem', // Reduced from 4rem
                }}
              >
                Lavendra Photography
              </h1>

              <p
                className="text-muted mb-4" // Reduced margin
                style={{
                  fontSize: '1.4rem', // Reduced from 1.8rem
                }}
              >
                Capturing life's precious moments with elegance and creativity.
              </p>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-primary btn-lg px-3 py-2" // Added padding
                  style={{
                    backgroundColor: '#6a1b9a',
                    borderColor: '#6a1b9a',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                  onClick={() => navigate('/product')}
                >
                  Explore Packages
                </button>
                <button
                  className="btn btn-outline-primary btn-lg px-3 py-2" // Added padding
                  style={{
                    backgroundColor: 'white',
                    color: '#6a1b9a',
                    borderColor: '#6a1b9a',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="col-md-6">
              <div
                style={{
                  position: 'relative',
                  height: '350px', // Reduced from 400px
                  width: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)', // Reduced shadow
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07"
                  alt="Photography"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(to bottom, rgba(106,27,154,0.1) 0%, rgba(106,27,154,0.3) 100%)',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Made more compact */}
      <section className="py-4">
        {' '}
        {/* Reduced padding */}
        <div className="container text-center">
          <h2
            className="fw-bold mb-4"
            style={{ color: '#6a1b9a', fontSize: '2rem' }}
          >
            {' '}
            {/* Reduced size */}
            Our Services
          </h2>
          <div className="row g-3">
            {' '}
            {/* Reduced gutter */}
            {[
              {
                title: 'Wedding Photography',
                description:
                  'Capture your special day with our premium wedding packages.',
                icon: '💒',
              },
              {
                title: 'Portrait Sessions',
                description:
                  'Professional studio or outdoor portrait sessions.',
                icon: '📷',
              },
              {
                title: 'Commercial Photography',
                description: 'High-quality product and business photography.',
                icon: '🏢',
              },
              {
                title: 'Rental Services',
                description: 'Equipment rental options for your photoshoot.',
                icon: '🛍️',
              },
              {
                title: 'Payment Options',
                description: 'Flexible payment solutions for all clients.',
                icon: '💳',
              },
              {
                title: 'Custom Packages',
                description: 'Tailor-made packages to suit your needs.',
                icon: '📦',
              },
            ].map((service, index) => (
              <div className="col-md-4 mb-3" key={index}>
                {' '}
                {/* Reduced margin */}
                <div
                  className="p-3 h-100 shadow rounded-3" // Reduced padding and rounded
                  style={{
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    minHeight: '180px', // Added fixed height
                  }}
                >
                  <div className="mb-2" style={{ fontSize: '2rem' }}>
                    {' '}
                    {/* Reduced size */}
                    {service.icon}
                  </div>
                  <h5
                    className="fw-bold mb-2"
                    style={{ color: '#6a1b9a', fontSize: '1.1rem' }}
                  >
                    {service.title}
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    {' '}
                    {/* Reduced size */}
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Made more compact */}
      <section
        className="py-3" // Reduced padding
        style={{
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          borderRadius: '12px',
          margin: '1rem 0',
        }}
      >
        <div className="container text-center">
          <h3
            className="fw-bold mb-3"
            style={{ color: '#6a1b9a', fontSize: '1.5rem' }}
          >
            Client Testimonials
          </h3>
          <div
            className="bg-white p-3 rounded-3 mx-auto" // Reduced padding
            style={{ maxWidth: '500px' }} // Reduced width
          >
            <p className="fst-italic mb-2" style={{ fontSize: '1rem' }}>
              {' '}
              {/* Reduced size */}
              "Lavendra captured our wedding perfectly. The photos are
              stunning."
            </p>
            <h6
              className="fw-bold mb-0"
              style={{ color: '#6a1b9a', fontSize: '0.9rem' }}
            >
              — Sarah & James
            </h6>
          </div>
        </div>
      </section>

      {/* Call to Action - Made more compact */}
      <section className="py-3 text-center">
        {' '}
        {/* Reduced padding */}
        <div className="container">
          <h3
            className="fw-bold mb-3"
            style={{ color: '#6a1b9a', fontSize: '1.5rem' }}
          >
            Ready to create beautiful memories?
          </h3>
          <button
            className="btn btn-primary px-3 py-2" // Reduced padding
            style={{
              backgroundColor: '#6a1b9a',
              borderColor: '#6a1b9a',
              borderRadius: '8px',
              boxShadow: '0 3px 10px rgba(106, 27, 154, 0.3)', // Reduced shadow
              fontSize: '1rem',
            }}
            onClick={() => navigate('/contact')}
          >
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
