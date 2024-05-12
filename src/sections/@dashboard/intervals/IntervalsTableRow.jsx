import { IconButton, TableCell, TableRow } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/iconify';
import moment from 'moment';
const IntervalsTableRow = ({ element, handleOpenMenu }) => {
  // const time = '12:00:00';
  // const formattedTime = moment(time, 'HH:mm:ss').format('hh:mm:ss a');
  // console.log(formattedTime); // ستظهر النتيجة بالشكل المناسب مثل '12:00:00 ص'
  return (
    <>
      <TableRow sx={{ position: 'relative' }}>
        <TableCell>{element.price}</TableCell>
        <TableCell>{moment(element.from, 'HH:mm:ss').format('hh:mm:ss a')}</TableCell>
        <TableCell> {moment(element.to, 'HH:mm:ss').format('hh:mm:ss a')}</TableCell>
        <TableCell>{element.governorate.name}</TableCell>
        <TableCell sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, element.id, element)}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default IntervalsTableRow;
