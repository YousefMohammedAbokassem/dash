import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const Map = ({ markerPosition, setMarkerPosition, setCityMap, formik, zoom, center }) => {
  // const [center, setCenter] = useState({ lat: 0, lng: 0 });
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
    map.setZoom(zoom);
    setMap(map);

    const listener = map.addListener('click', (event) => {
      // getProvinceName(event.latLng.lat(), event.latLng.lng());
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
