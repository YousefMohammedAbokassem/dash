import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  CircularProgress,
  Container,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateProfile } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';


export const AccountProfileDetails = ({
  values,
  setValues,
  selectedFile,
  successMessage,
  setErrorMessage,
  setSuccessMessage,
  errorMessage,
}) => {
  const { eshoppingadmin, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [values, selectedFile]);

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    },
    [values]
  );

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      firstName: eshoppingadmin.first_name,
      lastName: eshoppingadmin.last_name,
      phone: eshoppingadmin.phone,
    },
    onSubmit: (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('phone', values.phone);
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('file', selectedFile);

      axios
        .post(`${process.env.REACT_APP_API_URL}dashboard/update_my_profile`, formData, {
          headers: headerApi(token)
        })
        .then((res) => {
          setLoading(false);
          dispatch(updateProfile(res.data));
          setSuccessMessage(res.data.msg);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setLoading(false);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Account Info" />
        <CardContent sx={{ padding: '10px 20px' }}>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ marginTop: '30px' }}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone"
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.firstName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.lastName}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Button variant="contained" type="submit">
              Save details
            </Button>
          )}
        </CardActions>
        {successMessage && (
          <Typography variant="h6" sx={{ padding: '10px 20px', color: 'green' }}>
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="h6" sx={{ padding: '10px 20px', color: 'red' }}>
            {errorMessage}
          </Typography>
        )}
      </Card>
    </form>
  );
};
