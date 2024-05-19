import React from 'react';
import { useSelector } from 'react-redux';

const useAccount = () => {
  const admin = useSelector((state) => state.auth.admin);
  const realAdmin = JSON.parse(admin);
  const account = {
    displayName: realAdmin.name || `name`,
    phone: realAdmin.phone | `phone`,
    // photoURL: `${process.env.REACT_APP_API_URL_IMAGE}${admin.image}`
    photoURL: ``,
  };
  return account;
};

export default useAccount;
