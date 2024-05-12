import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const DeleteAds = ({open, handleClose, selectedElement, setData}) => {

    const {token} = useSelector((state) => state.auth);


    const [loading, setLoading] = useState(false)

    const handleDeleteAdmin = () => {
        setLoading(true)
        axios.get(`${process.env.REACT_APP_API_URL}admin/ads/delete/${selectedElement.id}`, {
            headers: headerApi(token)
        })
        .then(res => {
            setData(prev => prev.filter(item => item.id!== selectedElement.id))
            handleClose()
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete advertise will remove all information related to it
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <LoadingButton loading={loading} onClick={handleDeleteAdmin} autoFocus>
            Agree
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAds;
