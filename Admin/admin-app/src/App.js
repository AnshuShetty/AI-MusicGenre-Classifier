import AdminLogin from "../src/pages/adminlogin/AdminLogin";
import AdminRegister from "../src/pages/adminRegister/AdminRegister";
import AdminDashboard from "../src/pages/admindashboard/AdminDashboard";
import AdminDashboardI from "../src/pages/admindashboard/AdminDashboardI";
import MusicList from "../src/components/MusicList";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SelectGenre from "./components/SelectGenre";

const App = () => (
  <Router>
    {/* <Navbar /> */}
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboardI" element={<AdminDashboardI/>} />
      <Route path="/dashboard/:genre" element={<MusicList />} />
      <Route path="/admin/selectGenre" element={<SelectGenre/>} />
    </Routes>
  
  </Router>
);

export default App;
