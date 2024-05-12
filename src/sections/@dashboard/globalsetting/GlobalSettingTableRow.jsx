import { Avatar, IconButton, Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const CategoryTableRow = ({ globalSetting, handleOpenMenu, mainPage }) => {
  // const handleNavigate = (id) => {
  //   if (mainPage) {
  //     navigate(`/dashboard/globalSetting/details/${id}`);
  //   }
  // };
  const navigate = useNavigate();
  console.log(globalSetting);
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
          {globalSetting?.key}
        </Typography>
        {/* </Stack> */}
      </TableCell>

      <TableCell align="left">{globalSetting?.value}%</TableCell>

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
