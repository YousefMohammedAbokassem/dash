import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const Map = ({ markerPosition, setMarkerPosition, center }) => {
  const [showMap, setShowMap] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  //initial google map
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOLEMAP_KEY,
  });

  const [map, setMap] = useState(null);
  const onLoad = useCallback(function callback(map) {
    map.setZoom(7);
    setMap(map);

    const listener = map.addListener('click', (event) => {
      // استدعاء دالة لجلب اسم المحافظة باستخدام الإحداثيات
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

  //add marker to get lat and lng

  const [errorMessage, setErrorMessage] = useState('');
  const errorRef = useRef(null);
  useEffect(() => {
    errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [errorMessage]);

  // دالة لجلب اسم المحافظة باستخدام الإحداثيات
  const getProvinceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&key=${process.env.REACT_APP_GOOLEMAP_KEY}`
      );
      const data = await response.json();
      // const addressComponents = data[0].address_components;
      console.log(data);
      console.log(data.results[0].address_components);
      const addressComponents = data.results[0].address_components;
      const cityComponent = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      );
      // const addressComponents = data.results[0].address_components;
      // const cityComponent = addressComponents.find((component) => {
      //   component.types[0].includes('administrative_area_level_1');
      //   console.log(component.types[0].includes('administrative_area_level_1'));
      // });
      if (cityComponent) {
        console.log(cityComponent.long_name);
      }
      /* 
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {

          if (cityComponent) {
            const cityName = cityComponent.long_name;
            console.log('City Name:', cityName);
          } else {
            console.log('City Name not found');
          }
        } else {
          console.log('Reverse geocoding failed');
        }
      });
      */
      if (data.results[0]) {
        const provinceName = data.results[0].formatted_address; // تستطيع استخدام data.results[0].address_components لتفاصيل أكثر دقة
        console.log('Province Name:', provinceName);
        // هنا يمكنك فعل شيء آخر مثل عرض اسم المحافظة في واجهة المستخدم
      } else {
        setErrorMessage('Province not found');
      }
    } catch (error) {
      console.error('Error fetching province:', error);
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
