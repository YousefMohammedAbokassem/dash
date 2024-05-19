import React, { useEffect, useState } from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { BarChart } from '@mui/x-charts/BarChart';
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import { headerApi } from 'src/utils/headerApi';
import { useSelector, useDispatch } from 'react-redux';
import { forEach } from 'lodash';
import { dayjs } from 'dayjs';
import { logoutUser } from 'src/store/authSlice';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SkeletonCharts from './SkeletonCharts';
import moment from 'moment';
const chartSetting = {
  // yAxis: [{ label: 'rainfall (mm)' }],
  height: 300,
};

// const dataset = [
//   {
//     driverCount: 86,
//     userCount: 21,
//     month: 'Jan',
//   },
//   {
//     driverCount: 78,
//     userCount: 28,
//     month: 'Fev',
//   },
//   {
//     driverCount: 106,
//     userCount: 41,
//     month: 'Mar',
//   },
//   {
//     driverCount: 92,
//     userCount: 73,
//     month: 'Apr',
//   },
//   {
//     driverCount: 92,
//     userCount: 99,
//     month: 'May',
//   },
//   {
//     driverCount: 103,
//     userCount: 144,
//     month: 'June',
//   },
//   {
//     driverCount: 105,
//     userCount: 319,
//     month: 'July',
//   },
//   {
//     driverCount: 106,
//     userCount: 249,
//     month: 'Aug',
//   },
//   {
//     driverCount: 95,
//     userCount: 131,
//     month: 'Sept',
//   },
//   {
//     driverCount: 97,
//     userCount: 55,
//     month: 'Oct',
//   },
//   {
//     driverCount: 76,
//     userCount: 48,
//     month: 'Nov',
//   },
//   {
//     driverCount: 103,
//     userCount: 25,
//     month: 'Dec',
//   },
// ];

const valueFormatter = (value) => `${value}`;

export default function GridDemo() {
  const dispatch = useDispatch();

  const [dataSet, setDataSet] = useState([
    {
      driverCount: 0,
      userCount: 0,
      month: 'Jan',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Fev',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Mar',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Apr',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'May',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'June',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'July',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Aug',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Sept',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Oct',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Nov',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Dec',
    },
  ]);
  const [stat, setStat] = useState([
    {
      driverCount: 0,
      userCount: 0,
      month: 'Jan',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Fev',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Mar',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Apr',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'May',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'June',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'July',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Aug',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Sept',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Oct',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Nov',
    },
    {
      driverCount: 0,
      userCount: 0,
      month: 'Dec',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios
        // .get(`${process.env.REACT_APP_API_URL}admin/categories`, {
        .get(`${process.env.REACT_APP_API_URL}admin/statistics/actors?year=${selectedYear}`, {
          headers: headerApi(token),
        });
      setDataSet(res.data);
      // setStat(res.data.statistics);
      const arr = res.data.statistics;

      if (res.data.statistics[0] != undefined) {
        setStat(
          (
            prev //[a,b] [c,d]
          ) =>
            prev.map((ele) => {
              let data = {};
              res.data.statistics.forEach((elementFromFetch) => {
                if (ele?.month === elementFromFetch?.month) {
                  data = elementFromFetch;
                } else {
                  data = ele;
                }
              });
              return data;
            })
        );
        setLoading(false);
      } else {
        setLoading(false);
        setStat([
          {
            driverCount: 0,
            userCount: 0,
            month: 'Jan',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Fev',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Mar',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Apr',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'May',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'June',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'July',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Aug',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Sept',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Oct',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Nov',
          },
          {
            driverCount: 0,
            userCount: 0,
            month: 'Dec',
          },
        ]);
      }
    } catch (err) {
      if (err.response.status === 401) {
        dispatch(logoutUser());

      }
    }
    setSelectedYear('');
  };

  // handle year
  const [selectedYear, setSelectedYear] = useState('');

  const handleYearChange = (date) => {
    setSelectedYear(date.$y);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [showDriver, setShowDriver] = useState(true);
  const [showUser, setShowUser] = useState(true);

  const handleDriverCheckboxChange = () => {
    setShowDriver(!showDriver);
  };

  const handleUserCheckboxChange = () => {
    setShowUser(!showUser);
  };

  const series = [];

  if (showDriver) {
    series.push({ dataKey: 'driverCount', label: 'Driver', valueFormatter, color: '#3f3f3f' });
  }

  if (showUser) {
    series.push({ dataKey: 'userCount', label: 'Users', valueFormatter, color: '#E69005' });
  }
  // const minDate = new Date(2000, 0, 1);

  return (
    <>
      {loading ? (
        <SkeletonCharts />
      ) : (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={showDriver}
                onChange={handleDriverCheckboxChange}
                sx={{
                  color: grey[500],
                  '&.Mui-checked': {
                    color: grey[700],
                  },
                }}
              />
            }
            label="Show Driver"
          />
          <br />
          <FormControlLabel
            control={<Checkbox checked={showUser} onChange={handleUserCheckboxChange} color="warning" />}
            label="Show User"
          />
          <br />
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          {/* <DatePicker
          views={['year']}
          label="Select Year"
          value={selectedYear}
          onChange={handleYearChange}
          renderInput={(params) => <TextField {...params} />}
        /> */}
          <Grid sx={{ display: 'flex', gap: '5px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year']}
                label="Select Year"
                onChange={handleYearChange}
                color="warning"
                sx={{
                  '& .MuiButtonBase-root': {
                    backgroundColor: 'warning.main', // لون خلفية زر الفتح
                    color: '#fff', // لون نص التسمية عند التركيز
                    // الأنماط الأخرى لزر الفتح هنا...
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'warning.main', // لون نص التسمية عند التركيز
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'warning.main', // لون الحدود عند تعيين color="warning"
                  },
                  // الأنماط الأخرى لـ DatePicker هنا...
                }}
              />
            </LocalizationProvider>

            <Grid item>
              <Button
                disabled={selectedYear === '' ? true : false}
                color="warning"
                sx={{ height: '100%' }}
                variant="outlined"
                onClick={() => {
                  fetchData();
                }}
              >
                get year
              </Button>
            </Grid>
          </Grid>
          {/* </LocalizationProvider> */}
          {stat == undefined ? (
            ''
          ) : (
            <BarChart
              dataset={stat}
              xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'month',

                  valueFormatter: (month, context) => `${month}\n${dataSet?.year}`,
                },
              ]}
              series={series}
              grid={{ horizontal: true }}
              bottomAxis={{
                labelStyle: {
                  fontSize: 16,
                  // transform: `translateY(${
                  //   // Hack that should be added in the lib latter.
                  //   5 * Math.abs(Math.sin((Math.PI * props.angle) / 180))
                  // }px)`,
                },
                tickLabelStyle: {
                  angle: 45,
                  textAnchor: 'middle',
                  fontSize: 15,
                },
              }}
              sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                  transform: 'translateX(-10px)',
                },
                [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
              }}
              {...chartSetting}
            />
          )}
        </div>
      )}
    </>
  );
}
