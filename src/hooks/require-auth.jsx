import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.authenticate);
  // const rule = useSelector((state) => state.auth.rule);


  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // if (rule === 'admin' && (window.location.pathname.includes('/user') || window.location.pathname.includes('/admin'))) {
  //   return <Navigate to="/login" />;
  // }

  return children;
};
export default RequireAuth;
