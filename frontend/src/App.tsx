import { Login } from "./pages/login/login";
import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import React, { createContext, useContext, useEffect, useState } from "react";
import { LobbyDashboard } from "./pages/lobby-dashboard/lobby-dashboard";
import { RequiresAuth } from "./components/requires-auth";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import useAuth from "./hooks/useAuth";
import { axiosClient } from ".";
import { Lobby } from "./pages/lobby/lobby";
import { SignUp } from "./pages/sign-up/signup";


function App() {
    return (  
    <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="signup" element={<SignUp/>}/>
      <Route path="/" element={
        <RequiresAuth>
          <Layout/>
       </RequiresAuth>
      }>
        <Route path="" element={<LobbyDashboard/>}/>
        <Route path="test/:id" element={<div> test route</div>}/>
        <Route path="test/anotherone" element={<div> another test route</div>}/>

        <Route path="lobby/:id" element={<Lobby />}/>
      </Route>
    </Routes>
  );
}

export default App;
