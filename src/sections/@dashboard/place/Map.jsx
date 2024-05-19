import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const Map = ({ markerPosition, setMarkerPosition }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [showMap, setShowMap] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorRef = useRef(null);

  // Initialize Google Map
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOLEMAP_KEY,
  });

  const [map, setMap] = useState(null);
  const onLoad = useCallback(function callback(map) {
    map.setZoom(14);
    setMap(map);

    const listener = map.addListener('click', (event) => {
      getProvinceName(event.latLng.lat(), event.latLng.lng());
      setMarkerPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [errorMessage]);

  // Function to get the current location
  useEffect(() => {
    if (navigator.geolocation) {
      console.log(navigator.geolocation, 'asd');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude, 'latitude');
          console.log(position.latitude, 'latitude');
          console.log(position.coords, 'latitude');
          console.log(position.coords.longitude, 'longitude');
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage('Error fetching current location');
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser.');
    }
  }, []);

  const getProvinceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&key=${process.env.REACT_APP_GOOLEMAP_KEY}`
      );
      const data = await response.json();
      const addressComponents = data.results[0].address_components;
      const cityComponent = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      );
      if (cityComponent) {
        console.log(cityComponent.long_name);
      }
      if (data.results[0]) {
        const provinceName = data.results[0].formatted_address;
      } else {
        setErrorMessage('Province not found');
      }
    } catch (error) {
      setErrorMessage('Error fetching province');
    }
  };

  return isLoaded ? (
    <>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={0} onLoad={onLoad} onUnmount={onUnmount}>
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
      {errorMessage && (
        <Typography ref={errorRef} variant="h6" sx={{ color: 'red', textAlign: 'center', padding: '10px 20px' }}>
          {errorMessage}
        </Typography>
      )}
    </>
  ) : (
    <></>
  );
};

export default Map;
