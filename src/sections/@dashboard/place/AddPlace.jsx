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
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import Map from './Map';

const rule = ['admin', 'super'];
const center = {
  lat: 33.50006,
  lng: 36.2973314,
};

const AddCategory = ({ open, setOpenAdd, setData, handleCloseMenu }) => {
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
      formData.append('image', selectFile);
      // formData.append('image', selecteFile);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/places`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
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
        console.log(error);
      });
  }, []);
  const [markerPosition, setMarkerPosition] = useState(center);
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
                <Map markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} center={center} />
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button color='warning' variant="contained" onClick={handleOpenFile} sx={{ color: '#fff' }}>
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
