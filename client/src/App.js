import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Cars from './pages/Cars';
import Flights from './pages/Flights';
import Transport from './pages/Transport';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotel/:id" element={<PrivateRoute><HotelDetails /></PrivateRoute>} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/create-trip" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
              <Route path="/trip/:id" element={<PrivateRoute><TripDetails /></PrivateRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
