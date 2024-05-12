import { Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import AddIntervals from 'src/sections/@dashboard/intervals/AddIntervals';
import IntervalsComp from 'src/sections/@dashboard/intervals/IntervalsComp';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';

const Intervals = () => {
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

  // Start intervals logic
  const [addIntervals, setAddIntervals] = useState(false);

  const [selectedIntervals, setSelectedIntervals] = useState({});

  const [intervals, setIntervals] = useState([]);

  const [intervalsLoading, setIntervalsLoading] = useState(false);

  useEffect(() => {
    setIntervalsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/deliveryPrices`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setIntervals(res.data.data);
        setIntervalsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIntervalsLoading(false);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
      });
  }, []);

  useEffect(() => {
    setLoadingCity(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}admin/governorates`, {
        headers: headerApi(token),
      })
      .then((res) => {
        console.log(res);
        setCity(res.data.data);
        setLoadingCity(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingCity(false);
        if (error.response.status === 401) {
          dispatch(logoutUser());
        }
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
        <title> Intervals </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom color={'warning.main'}>
            Intervals
          </Typography>
          <Button
            onClick={() => setAddIntervals(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            color={'warning'}
            sx={{ color: '#fff' }}
          >
            New Intervals
          </Button>
        </Stack>
      </Container>
      <IntervalsComp
        intervalsLoading={intervalsLoading}
        intervals={intervals}
        setIntervals={setIntervals}
        selectedIntervals={selectedIntervals}
        setSelectedIntervals={setSelectedIntervals}
        setSelectedElement={setSelectedElement}
        selectedElement={selectedElement}
        city={city}
      />
      <AddIntervals open={addIntervals} setOpen={setAddIntervals} setData={setIntervals} />

      {/* End intervals */}
    </>
  );
};

export default Intervals;
