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
  useEffect(() => {
    setMarkerPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
  }, [lat, lng]);
  return (
    <>
      <Map
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
        zoom={14}
      />
    </>
  );
};

export default ViewMap;
