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
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const UpdateTeacher = ({ open, setOpen, globalSettings, setGlobalSettings, handleCloseMenu, element }) => {
  const { token } = useSelector((state) => state.auth);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
      description: '',
      image: '',
    });
  };
 const dispatch = useDispatch();
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        name: element.name || '',
        description: element.description || '',
        image: element?.images?.[0]?.path || '',
      });
    }
  }, [element]);
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fileInputRef = useRef(null);

  const [selecteFile, setSelectFile] = useState({});
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  // const handleSelectFile = (e) => {
  //   setSelectFile(e.target.files[0]);
  // };
  const handleSelectFile = (e) => {
    // if (e.target.files && e.target.files[0]) {
    setSelectFile(e.target.files[0]);
    const selectedImage = e.target.files[0];
    const reader = new FileReader();
    // }
    if (selectedImage) {
      reader.onload = function (e) {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('image', selecteFile);
    formData.append('id', element.id);
    formData.append('_method', 'PUT');
    axios
      .post(`${process.env.REACT_APP_API_URL}admin/settings/${element.id}`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        setGlobalSettings((prev) =>
          prev.map((admin) =>
            admin.id === element.id
              ? {
                  ...admin,
                  name: values.name,
                  description: values.description,
                  // images: [...admin.images, { image: imageUrl }],
                  images: [
                    {
                      ...admin.images,
                      path: imageUrl,
                    },
                  ],
                }
              : admin
          )
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Error, please try again');
        }
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
      });
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="warning.main">
          {'Update Admin Info'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              {/* <TextField fullWidth label="Name" required name="name" value={values.name} onChange={handleChange} /> */}
              <TextField
                color="warning"
                fullWidth
                label="Name"
                required
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField fullWidth label="City" select name="city_id" value={values.city_id} onChange={handleChange}>
                {city.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

            <Grid item xs={12} md={6}>
              <TextField
                color="warning"
                fullWidth
                label="Description"
                required
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <label htmlFor="file">
                <Button variant="contained" onClick={handleOpenFile} sx={{ bgcolor: 'warning.main' }}>
                  Image
                </Button>
              </label>
              <input id="file" type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleSelectFile} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Disagree
          </Button>
          <LoadingButton loading={loading} onClick={handleSendApi} autoFocus color="warning">
            Agree
          </LoadingButton>
        </DialogActions>
        {errorMessage && (
          <Typography variant="h6" sx={{ color: 'red', padding: '10px 20px', textAlign: 'center' }}>
            {errorMessage}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default UpdateTeacher;
