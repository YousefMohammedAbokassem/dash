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
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const UpdateAdmin = ({ open, setOpen, setData, id, handleCloseMenu, element }) => {

  const { token } = useSelector((state) => state.auth);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setValues({
      name: '',
      email: '',
      rule: '',
    });
  };

  const [values, setValues] = useState({
    name: '',
    email: '',
    rule: '',
  });

  useEffect(() => {
    if (element) {
      setValues({
        name: element.name || '',
        email: element.email || '',
        rule: element.rule || '',
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
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    if(e.target.files && e.target.files[0]){
    setSelectFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files[0])
    console.log(URL.createObjectURL(e.target.files[0]))
    console.log(element.image)
  }
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSendApi = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('rule', values.rule);
    formData.append('file', selecteFile);

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/admins/update/${id}`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setOpen(false);
        handleCloseMenu()
        setData((prev) =>
          prev.map((admin) =>
            admin.id === id
              ? {
                  ...admin,
                  name: values.name,
                  email: values.email,
                  rule: values.rule,
                  image: imageUrl,
                }
              : admin
          )
        );
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setErrorMessage("Error")
      });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Admin Info'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" name="name" value={values.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" name="email" value={values.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Rule" name="rule" select value={values.rule} onChange={handleChange}>
                <MenuItem value="super">Super</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <label htmlFor="file">
                <Button variant="contained" onClick={handleOpenFile}>
                  Image
                </Button>
              </label>
              <input id="file" type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleSelectFile} />
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

export default UpdateAdmin;
