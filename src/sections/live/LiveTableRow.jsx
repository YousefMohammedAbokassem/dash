import { Avatar, Button, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const LiveTableRow = ({ element, handleOpenMenu }) => {
  const handleGoLiveClick = () => {
    window.location.href = element.url;
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell align="left">{element.name}</TableCell>
        <TableCell align="left">{element.description}</TableCell>
        <TableCell align="left">{element.date}</TableCell>
        <TableCell align="left">{element.is_locked === 0 ? 'No' : 'Yes'}</TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={element.teacher_name} src={`${process.env.REACT_APP_API_URL_IMAGE}${element.teacher_image}`} />
            <Typography variant="subtitle2" noWrap>
              {element.teacher_name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="left">{element.teacher_specialization}</TableCell>
        <TableCell align="left">
          <Button variant="outlined" onClick={handleGoLiveClick}>
            go live
          </Button>
        </TableCell>
        <TableCell align="right">
          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, element, element.id)}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default LiveTableRow;
