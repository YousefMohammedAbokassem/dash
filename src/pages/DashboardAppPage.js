import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button } from '@mui/material';
// components
// import { OverviewBudget } from 'src/sections/@dashboard/overView/overview-budget';
// import { OverviewTotalCustomers } from 'src/sections/@dashboard/overView/overview-total-customers';
// import { OverviewTasksProgress } from 'src/sections/@dashboard/overView/overview-tasks-progress';
// import { OverviewTotalProfit } from 'src/sections/@dashboard/overView/overview-total-profit';
// import { OverviewSales } from 'src/sections/@dashboard/overView/overview-sales';
// import { OverviewTraffic } from 'src/sections/@dashboard/overView/overview-traffic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'src/components/Chart';
import Report from './Report';
// import Chart from 'src/components/Chart';
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';
import { saveAs } from 'file-saver';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const downloadReport = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}admin/trips/report/export`, {
        headers: headerApi(token),
        responseType: 'blob', // تأكد من تحديد نوع الاستجابة كـ 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'report.xlsx');

      handleClose();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        dispatch(logoutUser());
      }
    }
  };
  const downloadTaxesReport = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}admin/trips/texes/report/export`, {
        headers: headerApi(token),
        responseType: 'blob', // تأكد من تحديد نوع الاستجابة كـ 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'taxesReport.xlsx');

      handleClose();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        dispatch(logoutUser());
      }
    }
  };
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} color={'warning.main'}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Chart />
          </Grid>
          <Grid item xs={12}>
            <Report />
          </Grid>
          <Grid item xs={12} justifyContent={'space-between'} display={'flex'}>
            <Button
              id="fade-button"
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="contained"
              color="warning"
              sx={{ color: '#fff' }}
              size={'large'}
            >
              Download
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem
                onClick={() => {
                  downloadReport();
                }}
                color="warning.main"
              >
                Report
              </MenuItem>
              <MenuItem
                onClick={() => {
                  downloadTaxesReport();
                }}
              >
                Taxes Report
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
