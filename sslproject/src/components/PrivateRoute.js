// PrivateRoute.js
import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';

const PrivateRoute = ({ element, token, ...rest }) => {
  console.log("token===========",token);
  if (!token) {
    // Redirect to login and replace the current entry in the history
    return <Navigate to="/login" replace state={{ from: rest.location }} />;
  }

  return (
    <Routes>
      <Route {...rest} element={element} />
    </Routes>
  )
};

export default PrivateRoute;
