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
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { logoutUser } from 'src/store/authSlice';

const UpdateIntervals = ({ open, handleClose, setData, element }) => {
  const { token } = useSelector((state) => state.auth);
  const [city, setCity] = useState([]);
  const [city_id, setCity_Id] = useState([]);
  const dispatch = useDispatch();

  const [timeError, setTimeError] = useState(false);
  const [timeErrorMessage, setTimeErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/governorates`, {
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

  const formik = useFormik({
    initialValues: {
      price: '',
      from: '',
      to: '',
      id: '',
      governorate_id: '',
      governorateName: '',
    },
    onSubmit: (values) => {
      if (timeError) {
        setErrorMessage(timeErrorMessage);
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('from', values.from);
      formData.append('to', values.to);
      formData.append('_method', 'PUT');
      formData.append('price', values.price);
      formData.append('governorate_id', values.governorate_id);
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/deliveryPrices/${element.id}`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          handleClose();
          setData((prev) =>
            prev.map((admin) =>
              admin.id === element.id
                ? {
                    ...admin,
                    price: values.price,
                    governorate: {
                      id: values.governorate_id,
                      name: values.governorateName,
                    },
                    to: values.to,
                    from: values.from,
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          setLoading(false);
          setErrorMessage('Error please try again');
          if (error.response.status === 401) {
            dispatch(logoutUser());
          }
        });
    },
  });

  useEffect(() => {
    if (element) {
      formik.setValues({
        price: element.price || '',
        id: element.id || '',
        from: element.from || '',
        to: element.to || '',
        governorate_id: element.governorate?.id || '',
        governorateName: element.governorate?.name || '',
      });
    }
  }, [element, formik.setValues]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFromChange = (value) => {
    const fromTime = dayjs(value.$d).format('HH:mm:ss');
    formik.setFieldValue('from', fromTime);
    const toTime = dayjs(formik.values.to, 'HH:mm:ss');

    if (toTime.isBefore(dayjs(value.$d))) {
      setTimeError(true);
      setTimeErrorMessage('"To" time cannot be earlier than "From" time.');
    } else if (toTime.diff(dayjs(value.$d), 'hour') < 1) {
      setTimeError(true);
      setTimeErrorMessage('"To" time must be at least one hour after "From" time.');
    } else {
      setTimeError(false);
      setTimeErrorMessage('');
    }
  };

  const handleToChange = (value) => {
    const toTime = dayjs(value.$d).format('HH:mm:ss');
    formik.setFieldValue('to', toTime);
    const fromTime = dayjs(formik.values.from, 'HH:mm:ss');

    if (dayjs(value.$d).isBefore(fromTime)) {
      setTimeError(true);
      setTimeErrorMessage('"To" time cannot be earlier than "From" time.');
    } else if (dayjs(value.$d).diff(fromTime, 'hour') < 1) {
      setTimeError(true);
      setTimeErrorMessage('"To" time must be at least one hour after "From" time.');
    } else {
      setTimeError(false);
      setTimeErrorMessage('');
    }
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
            {'Update interval'}
          </DialogTitle>
          <DialogContent>
            <Grid sx={{ minWidth: '300px', mt: 2 }}>
              <Grid item sx={{ minWidth: '300px', mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(formik.values.from, 'HH:mm:ss')}
                    sx={{ width: '100%' }}
                    label="From"
                    name="from"
                    required
                    onChange={handleFromChange}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item sx={{ minWidth: '300px', mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(formik.values.to, 'HH:mm:ss')}
                    name="to"
                    minTime={dayjs(formik.values.from, 'HH:mm:ss')}
                    sx={{ width: '100%' }}
                    onChange={handleToChange}
                    label="To"
                    required
                  />
                </LocalizationProvider>
              </Grid>
              {timeError && (
                <Typography variant="h6" sx={{ color: 'red', textAlign: 'center', padding: '10px 20px' }}>
                  {timeErrorMessage}
                </Typography>
              )}
              <Grid item xs={12} md={6} sx={{ minWidth: '300px', mt: 2 }}>
                <TextField
                  color="warning"
                  fullWidth
                  label="City"
                  name="governorate_id"
                  select
                  required
                  value={formik.values.governorate_id}
                  onChange={(e) => {
                    const selectedGovernorate = city.find((gov) => gov.id === e.target.value);
                    formik.setFieldValue('governorate_id', e.target.value);
                    formik.setFieldValue('governorateName', selectedGovernorate.name);
                  }}
                >
                  {city.map((element, index) => (
                    <MenuItem key={index} value={element.id}>
                      {element.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6} sx={{ minWidth: '300px', mt: 2 }}>
                <TextField
                  color="warning"
                  fullWidth
                  id="standard-number"
                  label="Price"
                  name="price"
                  type="number"
                  required
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="warning">
              Disagree
            </Button>
            <LoadingButton
              disabled={timeError ? true : false}
              type="submit"
              loading={loading}
              autoFocus
              color="warning"
            >
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

export default UpdateIntervals;
