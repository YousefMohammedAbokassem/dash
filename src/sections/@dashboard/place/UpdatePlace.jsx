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
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import Map from './Map';
const center = {
  lat: 33.50006,
  lng: 36.2973314,
};
const UpdatePos = ({ element, open, handleClose, onUpdateSuccess }) => {
  const { token } = useSelector((state) => state.auth);
  const [markerPosition, setMarkerPosition] = useState(center);
  // const [center, setCenter] = useState(center);
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
      formData.append('image', selectFile);
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
          console.log('asdasdasdasd', selectFile);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrorMessage('Error please try again');
        });
    },
  });

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
        console.log(error);
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
              <Grid item xs={12} sx={{ height: '400px' }}>
                <Map markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} center={markerPosition} />
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
