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
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';

const UpdateIntervals = ({ open, handleClose, setData, element }) => {
  const { token } = useSelector((state) => state.auth);

  console.log(element, 'ele');
  const [city, setCity] = useState([]);
  const [city_id, setCity_Id] = useState([]);
  // const eleFrom = moment(element.from, 'HH:mm:ss').format('hh:mm:ss a');
  // const eleTo = moment(element.to, 'HH:mm:ss').format('hh:mm:ss a');
  // console.log(eleFrom); // ستظهر النتيجة بالشكل المناسب مثل '12:00:00 ص'
  // console.log(eleTo); // ستظهر النتيجة بالشكل المناسب مثل '12:00:00 ص'
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/governorates`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setCity(res.data.data);
      })
      .catch((error) => {
        console.log(error);
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
      // eleFrom: '',
      // eleTo: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('from', values.from);
      formData.append('to', values.to);
      // ###########
      formData.append('_method', 'PUT');
      formData.append('price', values.price);
      formData.append('governorate_id', values.governorate_id);
      console.log(element.id,"id");
      console.log(values.governorate_id, 'governorate_id');
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/deliveryPrices/${element.id}`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          // console.log(res);
          setLoading(false);
          // setSuccessMessage('Updated Successfuly');
          handleClose();
          setData((prev) =>
            prev.map((admin) =>
              admin.id === element.id
                ? {
                    ...admin,
                    price: values.price,
                    id: values.governorate_id,
                    to: values.to,
                    from: values.from,
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrorMessage('Error please try again');
        });
    },
  });
  // const currentDate = dayjs().set('hour', 14).set('minute', 10);
  // const formattedDateTime = currentDate.format('YYYY-MM-DDTHH:mm');

  // console.log(formattedDateTime); // سيتم طباعة التاريخ والوقت الحالي بالساعة 2:10 بالنظام المطلوب
  // console.log(from, 'fromfromfromfromfromfrom');

  useEffect(() => {
    if (element) {
      formik.setValues({
        price: element.price || '',
        id: element.id || '',
        from: element.from || '',
        to: element.to || '',
        governorate_id: element.governorate?.id || '',
        governorateName: element.governorate?.name || '',
        // eleFrom: eleFrom || '',
        // change date from 04:00:00 to 2024-05-08T04:00
        // because timePicker does not accept else this system YYYY-MM-DDTHH:mm
        // eleFrom: dayjs(element.from, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm') || '',
        // eleTo: dayjs(element.to, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm') || '',
      });
    }
  }, [element, formik.setValues]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  console.log(formik.values.from);
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
              {/* to */}
              <Grid item sx={{ minWidth: '300px', mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(formik.values.from, 'HH,mm,ss')}
                    sx={{ width: '100%' }}
                    label="From"
                    name="from"
                    required
                    // onChange={formik.handleChange}
                    onChange={(value) => {
                      console.log(dayjs(value.$d).format('HH:mm:ss'));
                      formik.setFieldValue('from', dayjs(value.$d).format('HH:mm:ss'));
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item sx={{ minWidth: '300px', mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={dayjs(formik.values.to, 'HH,mm,ss')}
                    // value={dayjs(formik.values.to, 'HH:mm:ss')}
                    // value={formik.values.to}
                    name="to"
                    sx={{ width: '100%' }}
                    // onChange={formik.handleChange}
                    onChange={(value) => {
                      console.log(dayjs(value.$d).format('HH:mm:ss'));
                      formik.setFieldValue('to', dayjs(value.$d).format('HH:mm:ss'));
                    }}
                    label="to"
                    required
                  />
                </LocalizationProvider>
              </Grid>
              {/* cities */}
              <Grid item xs={12} md={6} sx={{ minWidth: '300px', mt: 2 }}>
                <TextField
                  color="warning"
                  fullWidth
                  label="City"
                  name="governorate_id"
                  select
                  required
                  value={formik.values.governorate_id}
                  onChange={formik.handleChange}
                  // value={city_id.target.value}
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
                  name="price"
                  type="number"
                  required
                  // value={price.target.value || price}
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

export default UpdateIntervals;
