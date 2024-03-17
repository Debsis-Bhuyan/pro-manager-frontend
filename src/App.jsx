import React from 'react';
import './App.css';
import { Route, Routes, Navigate, useNavigate,  BrowserRouter } from "react-router-dom";
import LoginSignup from './pages/LoginSignup/LoginSignUp';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Setting from './pages/Setting';
import { isAuthenticated } from "./constants/auth";
import CardPublish from './components/CardPublish/CardPublish';

function PrivateRoute({ element, redirectTo }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("userToken");

  if (!isAuthenticated) {
    navigate(redirectTo || "/");
    return null;
  }
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/dashboard" element={
            <PrivateRoute element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          } />
          <Route path="/analytics" element={
            <PrivateRoute element={isAuthenticated ? <Analytics /> : <Navigate to="/" />} />
          } />
          <Route path="/setting" element={
            <PrivateRoute element={isAuthenticated ? <Setting /> : <Navigate to="/" />} />
          } />
          <Route path="/task/:id" element={<CardPublish />} />

        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
