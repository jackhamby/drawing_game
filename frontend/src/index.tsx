import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth';

export const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
});

axiosClient.interceptors.request.use((config) => {
  let session;
  try{
    session = JSON.parse(localStorage.getItem("session")!);
    config.headers!.Authorization = `Bearer ${session?.token}`
  } 
  catch {
    
  }

  return config;
});

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);