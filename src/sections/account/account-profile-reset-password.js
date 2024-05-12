import {
  Box,
  CardActions,
  Button,
  CardContent,
  CardHeader,
  CircularProgress,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';
import * as Yup from 'yup';


const passwordSchema = Yup.object().shape({
  newPassword: Yup.string()
  .min(8, "Too short")
  .max(24, "Too long")
  .required("Required"),
  confirmPassword: Yup.string()
  .oneOf([Yup.ref("newPassword"), null], "Password should match")
  .required("Confirm password is required")

})

const ResetPassword = () => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      setSuccessMessage('');
      setErrorMessage('');
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}dashboard/reset_my_password`,
          {
            old_password: values.oldPassword,
            new_password: values.newPassword,
          },
          {
            headers: headerApi(token)
          }
        )
        .then((res) => {
          setLoading(false);
          setSuccessMessage(res.data.msg);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setErrorMessage(error.response.data.error);
        });
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{ marginTop: '30px' }}>
        <Card>
          <CardHeader title="Account Info" />
          <CardContent>
            <Box>
              <Grid container spacing={3} sx={{ padding: '0 20px' }}>
                <Grid item xs={12} sx={{ marginTop: '30px' }}>
                  <TextField
                    fullWidth
                    required
                    label="Old Password"
                    name="oldPassword"
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.phone}
                    error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '30px' }}>
                  <TextField
                    fullWidth
                    required
                    label="New Password"
                    name="newPassword"
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.firstName}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '30px' }}>
                  <TextField
                    fullWidth
                    required
                    label="Confirm Password"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.lastName}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                {loading ? <CircularProgress size={80} /> : 'Save details'}
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
    </>
  );
};

export default ResetPassword;
