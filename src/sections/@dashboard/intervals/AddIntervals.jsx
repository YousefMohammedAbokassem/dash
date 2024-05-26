import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { logoutUser } from 'src/store/authSlice';

const AddIntervals = ({ open, setOpen, setData }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timeError, setTimeError] = useState(false);
  const [timeErrorMessage, setTimeErrorMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
    setTimeError(false);
  };

  const handleAdd = () => {
    if (timeError) {
      setErrorMessage(timeErrorMessage);
      return;
    }
    setLoading(true);
    const data = new FormData();
    let hour, minute;
    if (from.hour() < 10 && from.hour() >= 0) {
      hour = `0${from.hour()}`;
    } else {
      hour = `${from.hour()}`;
    }
    if (from.minute() < 10 && from.minute() >= 0) {
      minute = `0${from.minute()}`;
    } else {
      minute = `${from.minute()}`;
    }
    data.append('from', `${hour}:${minute}:00`);

    let hourTo, minuteTo;
    if (to.hour() < 10 && to.hour() >= 0) {
      hourTo = `0${to.hour()}`;
    } else {
      hourTo = `${to.hour()}`;
    }
    if (to.minute() < 10 && to.minute() >= 0) {
      minuteTo = `0${to.minute()}`;
    } else {
      minuteTo = `${to.minute()}`;
    }
    data.append('to', `${hourTo}:${minuteTo}:00`);
    data.append('governorate_id', city_id?.target?.value);
    data.append('price', price?.target?.value);

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/deliveryPrices`, data, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setSuccessMessage('Added Successfully');
        setData((prev) => [...prev, res.data.data]);
        handleClose();
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setLoading(false);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  };

  const dispatch = useDispatch();
  const [city, setCity] = useState([]);
  const [city_id, setCity_Id] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/governorates`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCity(res.data.data);
      })
      .catch((error) => {});
  }, []);

  const [from, setFrom] = useState(dayjs('12:00:00', 'HH:mm:ss'));
  const [to, setTo] = useState(dayjs('13:00:00', 'HH:mm:ss'));
  const [price, setPrice] = useState([]);

  const handleFromChange = (newValue) => {
    setFrom(newValue);
    const diffHours = to.diff(newValue, 'hour');
    if (to && newValue.isAfter(to)) {
      setTimeError(true);
      setTimeErrorMessage('"To" time cannot be earlier than "From" time.');
    } else if (diffHours < 1) {
      setTimeError(true);
      setTimeErrorMessage('"To" time must be at least one hour after "From" time.');
    } else {
      setTimeError(false);
      setTimeErrorMessage('');
    }
  };

  const handleToChange = (newValue) => {
    setTo(newValue);
    const diffHours = newValue.diff(from, 'hour');
    if (from && newValue.isBefore(from)) {
      setTimeError(true);
      setTimeErrorMessage('"To" time cannot be earlier than "From" time.');
    } else if (diffHours < 1) {
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
        <DialogTitle id="alert-dialog-title" color="warning.main">
          {'Add interval'}
        </DialogTitle>
        <DialogContent>
          <Grid sx={{ minWidth: '300px', mt: 2 }}>
            <Grid item sx={{ minWidth: '300px', mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  sx={{ width: '100%', color: 'warning.main' }}
                  onChange={handleFromChange}
                  label="From"
                  required
                  value={from}
                  color="warning.main"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item sx={{ minWidth: '300px', mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  sx={{ width: '100%' }}
                  onChange={handleToChange}
                  label="To"
                  required
                  value={to}
                  minTime={from} // This will prevent selecting a time earlier than 'From'
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
                name="city_id"
                select
                required
                onChange={(newValue) => setCity_Id(newValue)}
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
                type="number"
                required
                onChange={(newValue) => setPrice(newValue)}
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
            onClick={handleAdd}
            loading={loading}
            autoFocus
            color="warning"
          >
            Agree
          </LoadingButton>
        </DialogActions>
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

export default AddIntervals;
