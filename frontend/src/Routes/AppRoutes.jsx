import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";

function AppRoutes  ()  {
  return(
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Signup/>}/>
        
      </Routes>
    </Router>
    </>
  )
  };
  
  export default AppRoutes;