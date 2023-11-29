import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth';
import { API_HOST } from './settings';

export const axiosClient = axios.create({
  baseURL: `http://${API_HOST}`,
  // baseURL: "https://cca3-2601-445-680-5790-8403-8f58-184-60b0.ngrok-free.app"
});

axiosClient.interceptors.request.use((config) => {
  let session;
  try{
    session = JSON.parse(localStorage.getItem("session")!);
    config.headers!.Authorization = `Bearer ${session?.token}`;
    // config.headers!["Content-Type"] = "application/json";
  } 
  catch {
    
  }

  return config;
});

ReactDOM.render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>,
  document.getElementById('root')
);