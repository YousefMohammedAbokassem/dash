import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Map from 'src/sections/@dashboard/place/Map';
// const center = {
//   lat: 33.50006,
//   lng: 36.2973314,
// };
const ViewMap = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const [mapUrl, setMapUrl] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ lat: parseFloat(lat), lng: parseFloat(lng) });
  const [showMapPopup, setShowMapPopup] = useState(false);
  const allowShowPosition = () => {
    navigator.permissions.query({ name: 'geolocation' }).then((res) => {
      console.log(res);
      if (res.state === 'granted') {
        setShowMapPopup(true);
        console.log('granted');
      } else if (res.state === 'denied' || res.state === 'prompt') {
        setShowMapPopup(false);
        let message =
            'Location access permission was denied. To enable it, please go to your browser settings and allow location access.',
          instructions =
            'Here’s how to enable location access in your browser:\n\n' +
            '1. Open your browser settings.\n' +
            '2. Go to the Privacy and Security section.\n' +
            '3. Select Site Settings.\n' +
            "4. Under Permissions, choose 'Location' and enable access.";
        alert(message + '\n\n' + instructions);
      }
    });
  };
  useEffect(() => {
    setMarkerPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
  }, [lat, lng]);
  return (
    <>
      {showMapPopup ? (
        <Map
          markerPosition={markerPosition}
          allowShowPosition={allowShowPosition}
          setMarkerPosition={setMarkerPosition}
          center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
          zoom={14}
        />
      ) : (
        <Typography variant="h3" sx={{ color: 'warning.main', textAlign: 'center' }}>
          Please enable the website to show location
        </Typography>
      )}
    </>
  );
};

export default ViewMap;
