import { Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import SkeletonCopm from 'src/components/skeleton-comp';
import SkeletonTable from 'src/components/SkeletonTabel';
import AddPlace from 'src/sections/@dashboard/place/AddPlace';
import DeletePlace from 'src/sections/@dashboard/place/DeletePlace';
import PlaceCard from 'src/sections/@dashboard/place/PlaceCard';
import UpdatePlace from 'src/sections/@dashboard/place/UpdatePlace';
import { logoutUser } from 'src/store/authSlice';
import { headerApi } from 'src/utils/headerApi';

const Place = () => {
  const { token } = useSelector((state) => state.auth);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpenAdd(false);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/places`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setLoading(false);
        setPlaces(res.data.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  }, [token]);
  const dispatch = useDispatch();
  // Handle Add
  const [openAdd, setOpenAdd] = useState(false);

  // Handle close place
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [selectedDelete, setSelectedDelete] = useState('');

  // Handle update
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const [selectedUpdate, setSelectedUpdate] = useState({});

  const handleUpdateSuccess = (updatedElement) => {
    const updatedElements = places.map((el) => {
      if (el.id === updatedElement.id) {
        return updatedElement;
      }
      return el;
    });

    setPlaces(updatedElements);
  };

  return (
    <>
      <Helmet>
        <title> Places </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom color={'warning.main'}>
            Places
          </Typography>
          <Button
            onClick={() => setOpenAdd(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color={'warning'}
            sx={{ color: '#fff' }}
          >
            New Place
          </Button>
        </Stack>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap',
          }}
        >
          {loading ? (
            <SkeletonCopm />
          ) : (
            places.map((element, index) => (
              <PlaceCard
                setOpenDelete={setOpenDelete}
                setDelete={setSelectedDelete}
                key={index}
                element={element}
                setSelectedUpdate={setSelectedUpdate}
                setOpenUpdate={setOpenUpdate}
              />
            ))
          )}
        </div>
      </Container>
      <AddPlace open={openAdd} setOpenAdd={setOpenAdd} setData={setPlaces} handleCloseMenu={handleClose} />
      <DeletePlace open={openDelete} handleClose={handleCloseDelete} id={selectedDelete} setData={setPlaces} />
      <UpdatePlace
        onUpdateSuccess={handleUpdateSuccess}
        open={openUpdate}
        handleClose={handleCloseUpdate}
        element={selectedUpdate}
      />
    </>
  );
};

export default Place;
