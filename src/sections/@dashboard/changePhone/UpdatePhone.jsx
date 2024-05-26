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
  InputAdornment,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { logoutUser } from 'src/store/authSlice';
import { Formik } from 'formik';
import Iconify from 'src/components/iconify';
const UpdatePhone = ({ open, setOpen, categories, setCategories, handleCloseMenu, element }) => {
  const { token, admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      tel: '',
      password: '',
    });
  };
  const setInfoNumber = (value, country, e, formattedValue) => {
    if (value.indexOf(country.dialCode) !== -1) {
      setValues((prev) => ({
        ...prev,
        tel: `${value.slice(country.dialCode.length)}`,
        country_code: `+${country.dialCode}`,
        // prev.password: e.target.value,
      }));
    }
  };
  const [values, setValues] = useState({
    tel: '',
    password: '',
    confirmPassword: '',
    country_code: '',
  });
  const [surePass, setSurePass] = useState(false);

  useEffect(() => {
    if (element) {
      setValues({
        tel: element.phone || '',
        country_code: element.country_code || '',
        password: '',
        confirmPassword: '',
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
    if (values.password !== values.confirmPassword) {
      console.log('object');
      setSurePass(true);
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append('phone', values.tel);
      formData.append('country_code', values.country_code);
      formData.append('password', values.password);
      formData.append('_method', 'PUT');
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/profile/update`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          setSurePass(false);
          setOpen(false);
          handleCloseMenu();
          localStorage.setItem('admin', JSON.stringify(res.data.data));
          setCategories((prev) =>
            prev.map((admin) =>
              admin.id === element.id
                ? {
                    ...admin,
                    phone: values.tel,
                    country_code: values.country_code,
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          setLoading(false);
          setSurePass(false);

          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error, please try again');
          }
        });
    }
  };
  console.log(surePass, 'surePass');
  // password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfigPassword, setShowConfigPassword] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="warning.main">
          {'Update Admin Number'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12}>
              {/* <TextField fullWidth label="Name" required name="name" value={values.name} onChange={handleChange} /> */}
              {/* <TextField fullWidth label="Tel" required name="tel" value={values.tel} onChange={handleChange} /> */}
              <label htmlFor="tel" className="flex flex-col mb-4 gap-2 capitalize">
                <PhoneInput
                  inputStyle={{ paddingTop: '16.5px ', paddingBottom: '16.5px', height: 'auto', width: '100%' }}
                  country={'sa'}
                  value={`${values.country_code + values.tel}`}
                  // dir="ltr"
                  name="tel"
                  containerClass="direction"
                  inputClass="inputPhone px-2"
                  onChange={(value, country, e, formattedValue) => setInfoNumber(value, country, e, formattedValue)}
                  inputProps={{
                    required: true,
                  }}
                />
              </label>
            </Grid>
            {/* <Grid item xs={12} >
              <TextField fullWidth label="City" select name="city_id" value={values.city_id} onChange={handleChange}>
                {city.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

            <Grid item xs={12}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                required
                name="password"
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  if (surePass) {
                    e.target.value === values.confirmPassword ? setSurePass(false) : setSurePass(true);
                  }
                  // handleChange('password');
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify color="warning.main" icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                color={`${surePass ? 'error' : 'warning'}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: `${surePass ? 'error.main' : ''}`,
                    },
                    '&:hover fieldset': {
                      borderColor: `${surePass ? 'error.main' : ''}`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: `${surePass ? 'error.main' : 'warning.main'}`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: `${surePass ? 'error.main' : ''}`,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ConfirmPassword"
                required
                name="confirmPassword"
                value={values.confirmPassword}
                color={`${surePass ? 'error' : 'warning'}`}
                type={showConfigPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfigPassword(!showConfigPassword)} edge="end">
                        <Iconify color="warning.main" icon={showConfigPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: `${surePass ? 'error.main' : ''}`,
                    },
                    '&:hover fieldset': {
                      borderColor: `${surePass ? 'error.main' : ''}`,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: `${surePass ? 'error.main' : 'warning.main'}`,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: `${surePass ? 'error.main' : ''}`,
                  },
                }}
                onChange={(e) => {
                  handleChange(e);
                  if (surePass) {
                    values.password === e.target.value ? setSurePass(false) : setSurePass(true);
                  }
                  // handleChange('password');
                }}
              />
            </Grid>
            {surePass ? (
              <Grid item xs={12} textAlign={'center'} fontWeight={'bold'} fontSize={'1.1rem'} color={'error.main'}>
                Passwords Do Not Match.
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Disagree
          </Button>
          <LoadingButton
            loading={loading}
            onClick={handleSendApi}
            autoFocus
            color="warning"
            disabled={values.password.length && values.confirmPassword.length ? false : true}
          >
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
