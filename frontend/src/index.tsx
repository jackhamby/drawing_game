import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
});




ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);