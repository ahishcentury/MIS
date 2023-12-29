
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/login';
import Home from './pages/home';
import { UserRoleContextProvider } from "./pages/user_roles/userRoleContext";
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <div>
        <UserRoleContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/mis_home" element={<Home />} />
              <Route path="/mis_home/:module" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </UserRoleContextProvider>
      </div>
    </div>
  );
}

export default App;
