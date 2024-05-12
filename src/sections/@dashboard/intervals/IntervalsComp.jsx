import {
  Card,
  CircularProgress,
  Container,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import USERLIST from '../../../_mock/user';
import SkeletonTable from 'src/components/SkeletonTabel';
import IntervalsTableRow from './IntervalsTableRow';
import DeleteIntervals from './DeleteIntervals';
import UpdateIntervals from './UpdateIntervals';

const IntervalsComp = ({
  intervalsLoading,
  intervals,
  setIntervals,
  setSelectedElement,
  selectedElement,
  selectedIntervals,
  setSelectedIntervals,
  city,
}) => {
  //handle pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event, id, element) => {
    setAnchorEl(event.currentTarget);
    setSelectedIntervals(id);
    setSelectedElement(element);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //handle delete

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const handleClose = () => {
    setOpenDelete(false);
  };

  //handle update
  const [openUpdate, setOpenUpdate] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState({});

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setAnchorEl(null);
  };
  return (
    <>
      <Container>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>price</TableCell>
                    <TableCell>from</TableCell>
                    <TableCell>to</TableCell>
                    <TableCell>city</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {intervalsLoading ? (
                    <SkeletonTable number={4} />
                  ) : (
                    intervals
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((element, index) => (
                        <IntervalsTableRow
                          key={index}
                          element={element}
                          handleOpenMenu={handleOpenMenu}
                          setSelectedUpdate={setSelectedUpdate}
                        />
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={intervals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 'auto',
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => setOpenUpdate(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Update Interval
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDelete(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
        </MenuItem>
      </Popover>
      <DeleteIntervals
        open={openDelete}
        handleClose={handleClose}
        setData={setIntervals}
        id={selectedIntervals}
        setAnchorEl={setAnchorEl}
      />
      <UpdateIntervals
        open={openUpdate}
        handleClose={handleCloseUpdate}
        setData={setIntervals}
        element={selectedElement}
      />
    </>
  );
};

export default IntervalsComp;
