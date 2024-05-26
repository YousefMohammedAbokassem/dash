import { LoadingButton } from '@mui/lab';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';
import Map from '../place/MapAdd';
const UpdateCity = ({
  open,
  setData,
  setOpen,
  element,
  handleCloseMenu,
  selectedId,
  cityMap,
  setCityMap,
  markerPosition,
  setMarkerPosition,
  center,
  setCenter,
}) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('cityMap', cityMap);
      formData.append('name', values.name);
      formData.append('_method', 'PUT');
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/governorates/${selectedId}`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setSuccessMessage('');
          setErrorMessage('');
          setLoading(false);
          handleCloseMenu();
          setOpen(false);
          setData((prev) =>
            prev.map((admin) =>
              admin.id === selectedId
                ? {
                    ...admin,
                    name: values.name,
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error, please try again');
          }
          setLoading(false);
          setSuccessMessage('');
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
      });
    }
  }, [element, formik.setValues]);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          // #############################
          setOpen(false);
          formik.resetForm();
          setErrorMessage('');
          setSuccessMessage('');
          handleCloseMenu();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title" color="warning.main">
            {'Update City'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                <TextField
                  color="warning"
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue('name', e.target.value);
                  }}
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
            <Button
              onClick={() => {
                setSuccessMessage('');
                setErrorMessage('');
                setOpen(false);
              }}
              color="warning"
            >
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

export default UpdateCity;
