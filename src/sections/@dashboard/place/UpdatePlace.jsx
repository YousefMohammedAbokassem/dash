import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import Map from './Map';
import { logoutUser } from 'src/store/authSlice';
const UpdatePos = ({ element, open, handleClose, onUpdateSuccess, allowShowPosition, showMapPopup }) => {
  const { token } = useSelector((state) => state.auth);
  const [markerPosition, setMarkerPosition] = useState({});
  const [center, setCenter] = useState({});
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
      formData.append('_method', 'PUT');

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/places/${element.id}`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          // setSuccessMessage('Updated Successfuly');
          handleClose();
          onUpdateSuccess(res.data.data);
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage(error.response.data.message);
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
        });
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (element) {
      formik.setValues({
        name: element.name || '',
        description: element.description || '',
        address: element.address || '',
        lat: element.lat || '',
        lng: element.lng || '',
        city_id: element?.category?.id || '',
      });
      setMarkerPosition({
        lat: element?.location?.lat,
        lng: element?.location?.lon,
      });
      setCenter({
        lat: element?.location?.lat,
        lng: element?.location?.lon,
      });
    }
    if (element?.images?.length) {
      // setSelectFile(element?.images?.[0]?.path);
      setSelectFile(null);
    } else {
      setSelectFile(null);
    }
  }, [element, formik.setValues]);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [teachers, setTeachers] = useState([]);

  //handle city

  const [city, setCity] = useState([]);
  const [category, setCategory] = useState([]);

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
  // handle file
  const fileInputRef = useRef(null);
  const [selectFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

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
            {'Update Place'}
          </DialogTitle>
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
              <Grid
                item
                xs={12}
                sx={{
                  height: '400px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Map
                  showMapPopup={showMapPopup}
                  allowShowPosition={allowShowPosition}
                  zoom={14}
                  markerPosition={markerPosition}
                  setMarkerPosition={setMarkerPosition}
                  center={center}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={handleOpenFile} color="warning" sx={{ color: '#fff' }}>
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

export default UpdatePos;
