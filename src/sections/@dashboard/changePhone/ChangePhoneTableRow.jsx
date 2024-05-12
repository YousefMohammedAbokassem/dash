import { Avatar, IconButton, Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const CategoryTableRow = ({ category, handleOpenMenu, mainPage }) => {
  // const handleNavigate = (id) => {
  //   if (mainPage) {
  //     navigate(`/dashboard/category/details/${id}`);
  //   }
  // };
  const navigate = useNavigate();
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      sx={{ cursor: mainPage ? 'pointer' : '' }}
      // onClick={() => handleNavigate(category.id)}
    >
      <TableCell component="th" scope="row">
        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
        <Typography variant="subtitle2" noWrap>
          {category?.phone}
        </Typography>
        {/* </Stack> */}
      </TableCell>
      <TableCell align="right">
        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, category, category.id)}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
      </TableCell>
      {/* )} */}
    </TableRow>
  );
};

export default CategoryTableRow;
