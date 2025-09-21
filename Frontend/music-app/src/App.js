import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/login/Login";
import Register from "../src/pages/signup/Signup";
import Home from "../src/pages/home/Home";
import MusicList from "../src/components/MusicList";
import Verify from "./pages/verification/Verify";
import EmailLogin from "./pages/login/EmailLogin";
import PhoneLogin from "./pages/login/PhoneLogin";
import Favorites from "./pages/favorites/Favorites";


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/email-login" element={<EmailLogin />} />
      <Route path="/phone-login" element={<PhoneLogin />} />
      <Route path="/verify-code" element={<Verify />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/favorities" element={<Favorites />} />
      <Route path="/dashboard/:genre" element={<MusicList />} />
    </Routes>
  
  </Router>
);

export default App;
