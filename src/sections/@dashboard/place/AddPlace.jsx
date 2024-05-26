import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import Map from './Map';
import { logoutUser } from 'src/store/authSlice';
import useGeolocation from 'src/components/useLocation';

const rule = ['admin', 'super'];

const AddCategory = ({ open, setOpenAdd, setData, handleCloseMenu }) => {
  const { center, markerPosition, setMarkerPosition, setErrorMessageMap, errorMessageMap, setCenter } =
    useGeolocation();
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     console.log(navigator.geolocation, 'asd');
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
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpenAdd(false);
    handleCloseMenu();
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  // handle file
  const fileInputRef = useRef(null);
  const [selectFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      address: '',
      lon: '',
      lat: '',
      city_id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('address', values.address);
      formData.append('lon', markerPosition.lng);
      formData.append('lat', markerPosition.lat);
      formData.append('category_id', values.city_id);
      if (selectFile !== null) {
        formData.append('image', selectFile);
      }
      // formData.append('image', selecteFile);
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/places`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          setSuccessMessage('Added Success');
          setData((prev) => [...prev, res.data.data]);
          handleClose();
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error, please try again');
          }
          setLoading(false);
        });
    },
  });
  // show cities as menu items
  const [city, setCity] = useState([]);
  const [city_id, setCity_Id] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/categories`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCity(res.data.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  }, []);
  const dispatch = useDispatch();
  // const [markerPosition, setMarkerPosition] = useState({});
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="warning.main">
          {'Add Place'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  color="warning"
                  fullWidth
                  label="Description"
                  name="description"
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  color="warning"
                  fullWidth
                  label="Address"
                  name="address"
                  required
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </Grid>
              {/* cities */}
              <Grid item xs={12} md={6}>
                <TextField
                  color="warning"
                  fullWidth
                  label="categories"
                  name="city_id"
                  select
                  required
                  onChange={formik.handleChange}
                  value={formik.values.city_id}
                >
                  {city.map((element, index) => (
                    <MenuItem key={index} value={element.id}>
                      {element.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sx={{ height: '400px' }}>
                <Map zoom={14} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} center={center} />
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button color="warning" variant="contained" onClick={handleOpenFile} sx={{ color: '#fff' }}>
                    Image
                  </Button>
                </label>
                <input
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleSelectFile}
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

export default AddCategory;
