import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import {
  AUTH_LOGIN_PROVIDER_PIONIER,
  AUTH_LOGIN_STATE_PROVIDER_KEY,
} from './constants/authPaths.constants.js';
import CounterDemoPage from './pages/CounterDemoPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/login/pionier"
          element={
            <Navigate
              to="/login"
              replace
              state={{ [AUTH_LOGIN_STATE_PROVIDER_KEY]: AUTH_LOGIN_PROVIDER_PIONIER }}
            />
          }
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/demo" element={<CounterDemoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
