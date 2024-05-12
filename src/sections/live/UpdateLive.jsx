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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const yesterday = dayjs().subtract(1, 'day');

const UpdateLive = ({ open, setOpen, setData, id, handleCloseMenu, element, teachers }) => {

  const { token } = useSelector((state) => state.auth);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
  };

  const [values, setValues] = useState({
    name: '',
    teacher_id: '',
    description: '',
    url: '',
    date: '',
    is_locked: '',
  });



  useEffect(() => {
    if (element) {

        const isLockedValue = element.is_locked === 0 ? "0" : element.is_locked; 

      setValues({
        name: element.name || '',
        teacher_id: element.teacher_id || '',
        description: element.description || '',
        url: element.url || '',
        date: element.date || '',
        is_locked: isLockedValue || '',
      });
    }
  }, [element]);

  const handleChange = (e) => {

    const value = e.target.name === 'is_locked' ? parseInt(e.target.value) : e.target.value;

    setValues((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('teacher_id', values.teacher_id);
    formData.append('description', values.description);
    formData.append('url', values.url);
    formData.append('date', values.date);
    formData.append('is_locked', values.is_locked);
    formData.append('id', id);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/broadcasts/update`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setOpen(false);
        handleCloseMenu();
        setData((prev) =>
          prev.map((live) =>
            live.id === id
              ? {
                  ...live,
                  name: values.name,
                  teacher_id: values.teacher_id,
                  description: values.description,
                  url: values.url,
                  date: values.date,
                  is_locked: values.is_locked,
                }
              : live
          )
        );
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrorMessage('Error');
      });
  };

  const handleChangeTime = (e) => {
    const formattedDate = dayjs(e).format('YYYY-MM-DD HH:mm');

    console.log(formattedDate);

    setValues((prev) => ({
      ...prev,
      date: formattedDate,
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Live Info'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Name" name="name" value={values.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ marginTop: '-7px' }}>
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
                required
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Teacher" name="teacher_id" select value={values.teacher_id} onChange={handleChange}>
                {teachers.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Url from zoom or google meet"
                name="url"
                value={values.url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Locked"
                name="is_locked"
                select
                value={values.is_locked}
                onChange={handleChange}
              >
                <MenuItem value="0">No</MenuItem>
                <MenuItem value="1">Yes</MenuItem>
              </TextField>
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

export default UpdateLive;
