import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const AddAds = ({ open, setOpen, setData }) => {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);

  const [url, setUrl] = useState('');

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
    setUrl('');
    
  };

  //handle file
  const fileInputRef = useRef(null);
  const [selecteFile, setSelectFile] = useState(null);

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleSelectFile = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    formData.append('image', selecteFile);
    formData.append('url', url);

    axios
      .post(`${process.env.REACT_APP_API_URL}admin/ads/create`, formData, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setData((prev) => [...prev, res.data.ad]);
        setOpen(false)
        setErrorMessage(null)
        setSuccessMessage(null)
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Error, please try again');
        }
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
        <form onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title">{'Add Advertise'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
              <Grid item xs={12} md={12}>
                <TextField fullWidth label="Url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={12} sx={{ position: 'relative' }}>
                <label htmlFor="file">
                  <Button variant="contained" onClick={handleOpenFile}>
                    Image
                  </Button>
                </label>
                <input
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleSelectFile}
                />
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

export default AddAds;
