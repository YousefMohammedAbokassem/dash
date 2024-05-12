import { LoadingButton } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
import dayjs from 'dayjs';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers';

const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');

const AddLive = ({ open, setOpen, setData, teachers }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setErrorMessage('');
    setSuccessMessage('');
  };


  const [date, setDate] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      url: '',
      is_locked: '',
      teacher_id: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('url', values.url);
      formData.append('is_locked', values.is_locked);
      formData.append('teacher_id', values.teacher_id);
      formData.append('date', date);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      axios
        .post(`${process.env.REACT_APP_API_URL}admin/broadcasts/create`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
          setSuccessMessage('Added Success');
          setData((prev) => [...prev, res.data.broadcast]);
          handleClose();
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage('Error, please try again');
          }
          setLoading(false);
        });
    },
  });




  const handleChangeTime = (e) => {

    const formattedDate = dayjs(e).format('YYYY-MM-DD HH:mm');

    console.log(formattedDate); 

    setDate(formattedDate);
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Add broadcasts'}</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{marginTop: "-7px"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DateTimePicker', 'DateRangePicker']}>
                    <DemoItem>
                      <DateTimePicker
                        defaultValue={yesterday}
                        disablePast
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                        onChange={handleChangeTime}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  type="text"
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Url from zoom or google meet"
                  name="url"
                  required
                  value={formik.values.url}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Locked"
                  select
                  name="is_locked"
                  required
                  value={formik.values.is_locked}
                  onChange={formik.handleChange}
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teacher"
                  select
                  name="teacher_id"
                  required
                  value={formik.values.teacher_id}
                  onChange={formik.handleChange}
                >
                  {teachers.map((element, index) => (
                    <MenuItem key={index} value={element.id}>
                      {element.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <LoadingButton type="submit" loading={loading} autoFocus>
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

export default AddLive;
