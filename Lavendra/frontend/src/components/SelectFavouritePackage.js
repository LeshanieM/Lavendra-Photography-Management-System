import React, { useState } from 'react';

function FavoriteItemSelector() {
  const [favorite, setFavorite] = useState('');

  const handleSelect = (e) => {
    setFavorite(e.target.value);
  };

  // Event descriptions and package details
  const eventDetails = {
    Wedding: {
      description:
        'A wedding is a perfect time for making lasting memories, but did you consider our already available wedding package?',
      package: {
        editedPhotos: 100,
        locations: 3,
        price: '$2000',
      },
    },
    Birthday: {
      description:
        'Birthdays are all about fun, but did you consider our already available Birthdays package?',
      package: {
        editedPhotos: 50,
        locations: 2,
        price: '$800',
      },
    },
    Graduation: {
      description:
        'Graduation is a milestone, but did you consider our already available Graduation package?',
      package: {
        editedPhotos: 80,
        locations: 4,
        price: '$1500',
      },
    },
    Party: {
      description:
        'Planning a party? , but did you consider our already available party package?',
      package: {
        editedPhotos: 60,
        locations: 2,
        price: '$600',
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Choose Your Favorite Event</h2>
      <select
        onChange={handleSelect}
        className="form-control mb-3"
        aria-label="Select an event"
      >
        <option value="">Select your favorite event</option>
        <option value="Wedding">Wedding</option>
        <option value="Birthday">Birthday</option>
        <option value="Graduation">Graduation</option>
        <option value="Party">Party</option>
      </select>

      {favorite && (
        <div className="alert alert-info">
          <p className="font-weight-bold">Your favorite event is: {favorite}</p>
          <p>{eventDetails[favorite].description}</p>
          <h5>Package Details:</h5>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Number of Edited Photos:</strong>{' '}
              {eventDetails[favorite].package.editedPhotos}
            </li>
            <li className="list-group-item">
              <strong>Number of Locations:</strong>{' '}
              {eventDetails[favorite].package.locations}
            </li>
            <li className="list-group-item">
              <strong>Price:</strong> {eventDetails[favorite].package.price}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default FavoriteItemSelector;
