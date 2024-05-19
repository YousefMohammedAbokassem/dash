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
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { logoutUser } from 'src/store/authSlice';

const AddIntervals = ({ open, setOpen, setData }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleAdd = () => {
    setLoading(true);
    const data = new FormData();
    let hour;
    let minute;
    if (from.hour() < 10 && from.hour() >= 0) {
      hour = `0${from.hour()}`;
    } else {
      hour = `${from.hour()}`;
    }
    // minute
    if (from.minute() < 10 && from.minute() >= 0) {
      minute = `0${from.minute()}`;
    } else {
      minute = `${from.minute()}`;
    }
    data.append('from', `${hour}:${minute}:00`);
    // to
    let hourTo;
    let minuteTo;
    if (to.hour() < 10 && to.hour() >= 0) {
      hourTo = `0${to.hour()}`;
    } else {
      hourTo = `${to.hour()}`;
    }
    // minute
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
        setSuccessMessage('Added Success');
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

  // show cities as menu items
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
  const [name, setName] = useState('');
  const [from, setFrom] = useState('00:00:00');
  const [to, setTo] = useState('00:00:00');
  const [price, setPrice] = useState([]);
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
            {/* to */}
            <Grid item sx={{ minWidth: '300px', mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs} color="warning.main">
                <TimePicker
                  sx={{ width: '100%', color: 'warning.main' }}
                  onChange={(newValue) => setFrom(newValue)}
                  label="From"
                  required
                  // value={dayjs(from, 'HH:mm:ss')}
                  color="warning.main"
                  // sx={{ bgcolor: 'warning.main' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item sx={{ minWidth: '300px', mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  sx={{ width: '100%' }}
                  onChange={(newValue) => setTo(newValue)}
                  label="to"
                  required
                  // value={dayjs(to, 'HH:mm:ss')}
                />
              </LocalizationProvider>
            </Grid>
            {/* cities */}
            <Grid item xs={12} md={6} sx={{ minWidth: '300px', mt: 2 }}>
              <TextField
                color="warning"
                fullWidth
                label="City"
                name="city_id"
                select
                required
                // value={city_id.target.value}
                onChange={(newValue) => setCity_Id(newValue)}
              >
                {city.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* price */}
            <Grid item xs={12} md={6} sx={{ minWidth: '300px', mt: 2 }}>
              <TextField
                color="warning"
                fullWidth
                id="standard-number"
                label="Price"
                type="number"
                required
                // value={price.target.value || price}
                onChange={(newValue) => setPrice(newValue)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Disagree
          </Button>
          <LoadingButton onClick={handleAdd} loading={loading} autoFocus color="warning">
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
