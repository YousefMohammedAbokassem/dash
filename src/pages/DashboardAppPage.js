import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
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
import { headerApi } from 'src/utils/headerApi';
import { logoutUser } from 'src/store/authSlice';
import Chart from 'src/components/Chart';
// import Chart from 'src/components/Chart';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
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
          {/* <Grid item xs={12} sm={6} lg={3}>
            <OverviewBudget difference={12} positive sx={{ height: '100%' }} value="$24k" orders={orders} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewTotalCustomers
              orders={ordersOne}
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value="1.6k"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewTasksProgress users={users} sx={{ height: '100%' }} value={75.5} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <OverviewTotalProfit users={usersOne} sx={{ height: '100%' }} value="$15k" />
          </Grid> */}
          <Grid item xs={12}>
            <Chart />
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Container>
    </>
  );
}
