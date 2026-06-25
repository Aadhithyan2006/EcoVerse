// EcoVerse App v2
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { fetchProfile } from './store/slices/authSlice';
import AppRoutes from './routes';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function AppInner() {
  const dispatch = useDispatch();
  const token = useSelector(s => s.auth.token);
  useEffect(() => { if (token) dispatch(fetchProfile()); }, [token, dispatch]);
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer theme="dark" position="bottom-right" />
    </BrowserRouter>
  );
}

function App() {
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    const { GoogleOAuthProvider } = require('@react-oauth/google');
    return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}><AppInner /></GoogleOAuthProvider>;
  }
  return <AppInner />;
}

export default App;
