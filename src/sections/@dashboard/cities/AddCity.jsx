import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import Map from '../place/MapAdd';
// const center = {
//   lat: 33.50006,
//   lng: 36.2973314,
// };
const AddCity = ({
  open,
  setOpen,
  setData,
  cityMap,
  setCityMap,
  markerPosition,
  setMarkerPosition,
  center,
  setCenter,
}) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('cityMap', cityMap);
      formData.append('name', values.name);
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/governorates`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          handleClose();
          setData((prev) => [...prev, res.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage(error.response.data.message);
          setSuccessMessage('');
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
        });
    },
  });
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setCenter({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //         setMarkerPosition({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //         console.log({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },

  //       (error) => {
  //         setErrorMessage('Error fetching current location');
  //       }
  //     );
  //   } else {
  //     setErrorMessage('Geolocation is not supported by this browser.');
  //   }
  // }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title" color="warning.main">
            {'Add City'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '0px' }}>
              <Grid item xs={12}>
                <TextField
                  color="warning"
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ height: '400px', width: '200px' }}>
                <Map
                  setCityMap={setCityMap}
                  markerPosition={markerPosition}
                  setMarkerPosition={setMarkerPosition}
                  center={center}
                  formik={formik}
                  zoom={7}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="warning">
              Disagree
            </Button>
            <LoadingButton type="submit" loading={loading} autoFocus color="warning">
              Agree
            </LoadingButton>
          </DialogActions>
        </form>
        {errorMessage && (
          <Typography variant="h6" sx={{ color: 'red', textAlign: 'center', padding: '10px 20px' }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="h6" sx={{ color: 'green', textAlign: 'center', padding: '10px 20px' }}>
            {successMessage}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default AddCity;
