import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Typography, MenuItem, Avatar, IconButton, Popover, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout, changeError } from '../../../store/authSlice';
// mocks_
import useAccount from '../../../_mock/account';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const { loading, error } = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.auth.admin);
  const [account, setAccount] = useState(JSON.parse(localStorage.getItem('admin')));

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    dispatch(changeError(''));
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account?.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate('/dashboard/ChangePhone')} sx={{ m: 1 }}>
          {JSON.parse(localStorage.getItem('admin'))?.phone}
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          {loading ? <CircularProgress size={20} /> : 'Logout'}
        </MenuItem>
        {error && (
          <Typography variant="h6" sx={{ color: 'red', padding: '5px 10px', textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Popover>
    </>
  );
}
