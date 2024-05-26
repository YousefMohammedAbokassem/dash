import {
  Avatar,
  Button,
  Fade,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const CategoryTableRow = ({ globalSetting, handleOpenMenu, mainPage }) => {
  // const handleNavigate = (id) => {
  //   if (mainPage) {
  //     navigate(`/dashboard/globalSetting/details/${id}`);
  //   }
  // };
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      sx={{ cursor: mainPage ? 'pointer' : '' }}
      // onClick={() => handleNavigate(globalSetting.id)}
    >
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {globalSetting?.email}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {globalSetting?.car_type}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {globalSetting?.plate_number}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {globalSetting?.gender}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell component="th" scope="row">
        <Button
          id="fade-button"
          aria-controls={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          color="warning"
          // sx={{ color: '#fff' }}
          size={'small'}
        >
          Places
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              minWidth: '100px',
            },
          }}
        >
          {globalSetting?.places.map((place) => {
            return (
              <React.Fragment key={place?.id}>
                <MenuItem color="warning.main" sx={{ textAlign: 'center', justifyContent: 'center' }}>
                  {place.name}
                </MenuItem>
              </React.Fragment>
            );
          })}
        </Menu>
      </TableCell>
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {globalSetting?.wallet_balance ?? `wait to accept`}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {globalSetting?.status}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="large"
          color="inherit"
          onClick={(event) => handleOpenMenu(event, globalSetting, globalSetting.id)}
        >
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      </TableCell>
      {/* )} */}
    </TableRow>
  );
};

export default CategoryTableRow;
