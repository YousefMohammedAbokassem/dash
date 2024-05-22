import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const DeleteIntervals = ({ open, handleClose, setData, id, setAnchorEl }) => {
  const { token } = useSelector((state) => state.auth);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    axios
      .delete(`${process.env.REACT_APP_API_URL}admin/deliveryPrices/${id}`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setDeleteLoading(false);
        setData((prev) => prev.filter((el) => el.id !== id));
        setAnchorEl(null);
        handleClose();
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  };
  const dispatch = useDispatch();
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="warning.main">
          {'Delete Interval'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you need to delete this interval
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="warning">
            Disagree
          </Button>
          <LoadingButton onClick={handleDelete} loading={deleteLoading} autoFocus color="warning">
            Agree
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteIntervals;
