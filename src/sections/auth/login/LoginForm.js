import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Typography, Stack, IconButton, InputAdornment, TextField, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { login, changeError } from '../../../store/authSlice';
// components
import Iconify from '../../../components/iconify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// import { clearConfigCache } from 'prettier';
// import {changeError} from "../../../store/authSlice"

// -----------------------------------------------------------------------

export default function LoginForm() {
  // phone
  ////////////////////////
  const setInfoNumber = (value, country, e, formattedValue) => {
    // console.log(`${value}`);
    // console.log(`${country.dialCode}`);
    // console.log(`${formattedValue}`);
    if (value.indexOf(country.dialCode) !== -1) {
      setValues((prev) => ({
        ...prev,
        phone: `${value.slice(country.dialCode.length)}`,
        country_code: `+${country.dialCode}`,
        // prev.password: e.target.value,
      }));
    }
  };
  // end phone
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    phone: '',
    password: '',
    country_code: '',
  });

  const handleChangePass = (e) => {
    setValues((prev) => ({
      ...prev,
      password: e.target.value,
      // prev.password: e.target.value,
    }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(login(values)).then((res) => {
      if (res.payload.message === 'success') {
        setValues({
          phone: '',
          password: '',
          country_code: '',
        });
        navigate('/dashboard', { replace: true });
      } else {
      }
    });
  };

  useEffect(() => {
    dispatch(changeError(''));
  }, [values]);

  return (
    <>
      <form onSubmit={handleClick}>
        <Stack spacing={3}>
          {/* <TextField required name="user_name" label="user_name" value={values.user_name} onChange={handleUser} /> */}

          <label htmlFor="tel" className="flex flex-col mb-4 gap-2 capitalize">
            <PhoneInput
              inputStyle={{ paddingTop: '16.5px ', paddingBottom: '16.5px', height: 'auto', width: '100%' }}
              country={'sa'}
              // value={phone}
              // dir="ltr"
              name="tel"
              containerClass="direction"
              inputClass="inputPhone px-2"
              onChange={(value, country, e, formattedValue) => setInfoNumber(value, country, e, formattedValue)}
              inputProps={{
                required: true,
              }}
            />
          </label>
          {/*  */}
          <TextField
            name="password"
            required
            label="Password"
            value={values.password}
            onChange={handleChangePass}
            type={showPassword ? 'text' : 'password'}
            color="warning"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify color="warning.main" icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="warning"
          sx={{ my: 2, color: '#fff' }}
        >
          {loading ? <CircularProgress sx={{ color: '#fff', padding: '2px' }} /> : 'Login'}
        </LoadingButton>
        {error && (
          <Typography variant="h6" sx={{ color: 'red', padding: '10px 20px', textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </form>
    </>
  );
}
