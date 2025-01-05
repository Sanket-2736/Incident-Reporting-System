import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import ReporterDashBoard from './pages/ResponderDashBoard/ResponderDashBoard';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import IncidentForm from './components/IncidentForm/IncidentForm';

function App() {
  return (
    <>
      <Toaster />
      <Navbar/>
      <Routes>
        <Route path="*" element={<h1>404 : Error Page not found!</h1>}></Route>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Signup/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route> 
        <Route path='/incident-form' element={<IncidentForm/>}></Route>
        <Route path='/responder-dashboard' element={<ReporterDashBoard/>}></Route>
      </Routes>
      <Footer/>
    </>
  )
}

export default App;
