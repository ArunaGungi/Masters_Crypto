// App.js
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminHome from './components/adminHome';

function App() {

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/userscreen" element={<AdminHome />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
