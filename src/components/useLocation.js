import React, { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [center, setCenter] = useState({});
  const [markerPosition, setMarkerPosition] = useState({});
  const [errorMessageMap, setErrorMessageMap] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,

            lng: position.coords.longitude,
          };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
          console.log(newCenter);
        },
        (error) => {
          setErrorMessageMap('Error fetching current location');
        }
      );
    } else {
      setErrorMessageMap('Geolocation is not supported by this browser.');
    }
  }, []);

  return { center, markerPosition, setMarkerPosition, setErrorMessageMap, errorMessageMap, setCenter };
};
export default useGeolocation;
