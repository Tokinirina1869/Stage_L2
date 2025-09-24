import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"
import Inscription from './components/Inscription';
import { Login } from './components/Register';
import Page from './components/Page';
import { Register } from './components/Register';

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
        <Routes>
          <Route path='/' element={ < Inscription/> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element= { <Register /> } />
          <Route path='/page' element={ <Page /> } />
        </Routes>
    </BrowserRouter>
  </StrictMode>
)
