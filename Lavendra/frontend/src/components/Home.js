import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- make sure this is imported

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center"
        style={{
          minHeight: '90vh',
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
            <div className="col-md-6 mb-4 mb-md-0">
              <h1
                className="fw-bold"
                style={{
                  color: '#6a1b9a',
                  fontSize: '4rem', // bigger heading
                }}
              >
                Lavendra Photography
              </h1>

              <p
                className="lead text-muted mb-6"
                style={{
                  fontSize: '1.8rem', // bigger paragraph
                }}
              >
                Capturing life's precious moments with elegance and creativity.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-primary btn-lg"
                  style={{
                    backgroundColor: '#6a1b9a',
                    borderColor: '#6a1b9a',
                    borderRadius: '8px',
                  }}
                  onClick={() => navigate('/product')}
                >
                  Explore Packages
                </button>
                <button
                  className="btn btn-outline-primary btn-lg"
                  style={{
                    backgroundColor: 'white',
                    color: '#6a1b9a',
                    borderColor: '#6a1b9a',
                    borderRadius: '8px',
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
                  height: '400px',
                  width: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 30px rgba(106, 27, 154, 0.2)',
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

      {/* Services Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5" style={{ color: '#6a1b9a' }}>
            Our Services
          </h2>
          <div className="row">
            {[
              {
                title: 'Wedding Photography',
                description:
                  'Capture your special day with our premium wedding packages including pre-wedding shoots.',
                icon: '💒',
              },
              {
                title: 'Portrait Sessions',
                description:
                  'Professional studio or outdoor portrait sessions for individuals and families.',
                icon: '📷',
              },
              {
                title: 'Commercial Photography',
                description:
                  'High-quality product and business photography for brands and e-commerce.',
                icon: '🏢',
              },
              {
                title: 'Rental Services',
                description:
                  'Equipment rental options to make your photoshoot perfect.',
                icon: '🛍️',
              },
              {
                title: 'Better Payment Options',
                description: 'Flexible payment solutions for all clients.',
                icon: '💳',
              },
              {
                title: 'Customized Packages',
                description: 'Tailor-made packages to suit your special needs.',
                icon: '📦',
              },
            ].map((service, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div
                  className="p-4 h-100 shadow rounded-4"
                  style={{
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                >
                  <div className="mb-3" style={{ fontSize: '2.5rem' }}>
                    {service.icon}
                  </div>
                  <h5 className="fw-bold" style={{ color: '#6a1b9a' }}>
                    {service.title}
                  </h5>
                  <p className="text-muted">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          padding: '4rem 0',
          borderRadius: '16px',
        }}
      >
        <div className="container text-center">
          <h3 className="fw-bold mb-4 text-white">Client Testimonials</h3>
          <div
            className="bg-white p-4 rounded-4 mx-auto"
            style={{ maxWidth: '600px' }}
          >
            <p className="fst-italic mb-3" style={{ fontSize: '1.2rem' }}>
              "Lavendra captured our wedding perfectly. The photos are
              absolutely stunning and will help us remember this day forever."
            </p>
            <h6 className="fw-bold" style={{ color: '#6a1b9a' }}>
              — Lavendra
            </h6>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 text-center">
        <div className="container">
          <h3 className="fw-bold mb-4" style={{ color: '#6a1b9a' }}>
            Ready to create beautiful memories?
          </h3>
          <button
            className="btn btn-primary btn-lg"
            style={{
              backgroundColor: '#6a1b9a',
              borderColor: '#6a1b9a',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(106, 27, 154, 0.3)',
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