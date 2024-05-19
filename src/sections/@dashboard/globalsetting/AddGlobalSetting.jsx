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
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const rule = ['admin', 'super'];

const AddCategory = ({ open, setOpen, setData, handleCloseMenu }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  // handle file
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      key: '',
      value: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('key', values.key);
      formData.append('value', values.value);

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/settings`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          setSuccessMessage('Added Success');
          let none = false;
          setData((prev) => {
            return prev.map((admin) => {
              if (admin.id === res.data.data.id) {
                none = true;
                return {
                  ...admin,
                  key: values.key,
                  value: values.value,
                  // images: [...admin.images, { image: imageUrl }],
                };
              } else {
                return admin;
              }
            });
          });
          if (!none) {
            setData((prev) => [...prev, res.data.data]);
          }
          handleClose();
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error, please try again');
          }
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
          setLoading(false);
        });
    },
  });
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="warning.main">
          {'Add Setting'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px', minWidth: '400px' }}>
              <Grid item xs={12} md={6}>
                <TextField
                  color="warning"
                  fullWidth
                  label="Key"
                  name="key"
                  select
                  required
                  onChange={formik.handleChange}
                  value={formik.values.key}
                >
                  {['tax', 'commission', 'kmPrice'].map((element, index) => (
                    <MenuItem key={index} value={element}>
                      {element}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  color="warning"
                  fullWidth
                  label="Value"
                  name="value"
                  required
                  type="number"
                  value={formik.values.value}
                  onChange={formik.handleChange}
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
