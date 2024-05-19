import { Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import AddCity from 'src/sections/@dashboard/cities/AddCity';
import UpdateCity from 'src/sections/@dashboard/cities/UpdateCity';
import ItemsComp from 'src/sections/@dashboard/items/ItemsComp';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';

const City = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Handle city
  const [loadingCity, setLoadingCity] = useState(false);
  const [city, setCity] = useState([]);

  const [openAddCity, setOpenAddCity] = useState(false);

  const [selectedId, setSelectedId] = useState('');
  const [selectedElement, setSelectedElement] = useState({});

  // Handle update city
  const [openUpdate, setOpenUpdate] = useState(false);
  useEffect(() => {
    setLoadingCity(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/governorates`, {
        headers: headerApi(token),
      })
      .then((res) => {
        setCity(res.data.data);
        setLoadingCity(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
        setLoadingCity(false);
      });
  }, []);
  // }, [token]);

  // Handle popover
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Helmet>
        <title> Cities </title>
      </Helmet>
      <Container>
        {/* Start city */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom color={'warning.main'}>
            Cities
          </Typography>
          <Button
            onClick={() => setOpenAddCity(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color={'warning'}
            sx={{ color: '#fff' }}
          >
            New City
          </Button>
        </Stack>
        <ItemsComp
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setOpenUpdate={setOpenUpdate}
          setSelectedElement={setSelectedElement}
          loadingCity={loadingCity}
          city={city}
          setCity={setCity}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      </Container>
      <AddCity open={openAddCity} setOpen={setOpenAddCity} setData={setCity} />
      <UpdateCity
        open={openUpdate}
        setOpen={setOpenUpdate}
        element={selectedElement}
        selectedId={selectedId}
        setData={setCity}
        handleCloseMenu={handleCloseMenu}
      />
      {/* End city */}
    </>
  );
};

export default City;
