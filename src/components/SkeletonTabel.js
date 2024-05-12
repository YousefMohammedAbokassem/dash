// number of tabel cell depend on number props


import { Skeleton, Stack, TableCell, TableRow } from '@mui/material';
import React from 'react';

const SkeletonTable = ({ number }) => {
  const renderTableCells = () => {
    const cells = [];
    for (let i = 0; i < number; i++) {
      cells.push(
        <TableCell key={i} align="left">
          <Skeleton variant="rectangular" width={100} height={30} />
        </TableCell>
      );
    }
    return cells;
  };

  return (
    <>
      {[1, 2, 3].map((element, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row" padding="none">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="circular" sx={{marginLeft: "10px"}} width={40} height={40} />
              <Skeleton variant="rectangular" width={100} height={30} />
            </Stack>
          </TableCell>
          {renderTableCells()}
        </TableRow>
      ))}
    </>
  );
};

export default SkeletonTable;