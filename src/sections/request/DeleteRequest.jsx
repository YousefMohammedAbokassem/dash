import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { headerApi } from 'src/utils/headerApi';

const DeleteRequest = ({ open, handleClose, id, setData, handleCloseMenu }) => {
  const { token } = useSelector((state) => state.auth);

  console.log(id)

  const [loading, setLoading] = useState(false);

  const handleDeleteAdmin = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/broadcasts/delete_meet_order/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setData((prev) => prev.filter((el) => el.id !== id));
        handleCloseMenu();
        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
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
        <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete meet order will remove all information related to it
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

export default DeleteRequest;
