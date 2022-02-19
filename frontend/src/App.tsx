import { Login } from "./pages/login/login";
import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import React, { createContext, useContext, useEffect, useState } from "react";
import { Home } from "./pages/home/home";
import { RequiresAuth } from "./components/requires-auth";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import useAuth from "./hooks/useAuth";
import { axiosClient } from ".";


function App() {
  const { userSession, logout } = useAuth();
  console.log('rendering app')
  console.log(userSession?.token)

  // useEffect(() => {
  //   console.log('triggering useEffect')
  //   console.log(userSession?.token)
  //   if (userSession?.token){
  //     console.log('setting interceptor')
  //     axiosClient.interceptors.request.use((config) => {
  //       console.log(config)
  //       config.headers!.Authorization = userSession.token!;
  //       console.log("inside req interceptor")
  //       console.log(userSession?.token)
  //       return config;
  //     });

  //     axiosClient.interceptors.response.use((response) => {
  //       console.log(response.status)
  //       // console.log(config)
  //       // config.headers!.Authorization = userSession.token!;
  //       // console.log("inside req interceptor")
  //       // console.log(userSession?.token)
  //       // return config;
  //     });
  //   }
  // }, [userSession]);

  return (  
    <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="/" element={
        <RequiresAuth>
          <Layout/>
       </RequiresAuth>
      }>
        <Route path="" element={<Home/>}/>
        <Route path="test" element={<div> test route</div>}/>
      </Route>
    </Routes>
  );
}

export default App;
