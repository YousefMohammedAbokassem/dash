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
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdatePhone = ({ open, setOpen, categories, setCategories, handleCloseMenu, element }) => {
  const { token, admin } = useSelector((state) => state.auth);
  console.log(element);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      tel: '',
      password: '',
    });
  };

  const [values, setValues] = useState({
    tel: '',
    password: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        tel: element.phone || '',
        password: '',
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

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  // const handleSelectFile = (e) => {
  //   setSelectFile(e.target.files[0]);
  // };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('phone', values.tel);
    formData.append('password', values.password);
    formData.append('_method', 'PUT');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}admin/profile/update`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        console.log(res.data.data);
        localStorage.setItem('admin', JSON.stringify(res.data.data));
        setCategories((prev) =>
          prev.map((admin) =>
            admin.id === element.id
              ? {
                  ...admin,
                  phone: values.tel,
                }
              : admin
          )
        );
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Error, please try again');
        }
      });
  };
  console.log(admin);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Admin Info'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              {/* <TextField fullWidth label="Name" required name="name" value={values.name} onChange={handleChange} /> */}
              <TextField fullWidth label="Tel" required name="tel" value={values.tel} onChange={handleChange} />
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
                fullWidth
                label="Password"
                required
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <LoadingButton loading={loading} onClick={handleSendApi} autoFocus>
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

export default UpdatePhone;
