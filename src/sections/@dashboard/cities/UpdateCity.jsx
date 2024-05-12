import { LoadingButton } from '@mui/lab';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdateCity = ({ open, setData, setOpen, element, handleCloseMenu, selectedId }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('_method', 'PUT');
      axios
        .post(`${process.env.REACT_APP_API_URL}admin/governorates/${selectedId}`, formData, {
          headers: headerApi(token),
        })
        .then((res) => {
          setSuccessMessage('');
          setErrorMessage('');
          setLoading(false);
          handleCloseMenu();
          setOpen(false);
          setData((prev) =>
            prev.map((admin) =>
              admin.id === selectedId
                ? {
                    ...admin,
                    name: values.name,
                  }
                : admin
            )
          );
        })
        .catch((error) => {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error, please try again');
          }
          console.log(error);
          setLoading(false);
          setSuccessMessage('');
        });
    },
  });

  useEffect(() => {
    if (element) {
      formik.setValues({
        name: element.name || '',
      });
    }
  }, [element, formik.setValues]);
  console.log(errorMessage);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title" color="warning.main">
            {'Update City'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item>
                <TextField
                  color="warning"
                  fullWidth
                  label="Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setSuccessMessage('');
                setErrorMessage('');
                setOpen(false);
              }}
              color="warning"
            >
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

export default UpdateCity;
