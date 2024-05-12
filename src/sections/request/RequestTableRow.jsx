import { Avatar, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';

const RequestTableRow = ({ element, handleOpenMenu }) => {
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={element.teacher_name} src={`${process.env.REACT_APP_API_URL_IMAGE}${element.user_info.image}`} />
            <Typography variant="subtitle2" noWrap>
              {element.user_info.name}
            </Typography>
          </Stack>
        </TableCell>
      <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={element.teacher_name} src={`${process.env.REACT_APP_API_URL_IMAGE}${element.teacher_info.image}`} />
            <Typography variant="subtitle2" noWrap>
              {element.teacher_info.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="left">{element.teacher_info.phone}</TableCell>
        <TableCell align="left">{element.date}</TableCell>

        <TableCell align="right">
          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, element.id)}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RequestTableRow;
