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
          {category?.total_price}
        </Typography>
        {/* </Stack> */}
      </TableCell>

      <TableCell align="left">{category.commission}</TableCell>
      <TableCell align="left">{category.tax}</TableCell>
      <TableCell align="left">{category.driverFee}</TableCell>
      {/* )} */}
    </TableRow>
  );
};

export default CategoryTableRow;
