import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"
import Inscription from './components/Inscription';
import { Login } from './components/Users/Login';
import Page from './components/Page';
import { Register } from './components/Register';
import ProfileComponent from './components/modals/ProfileComponent';
import ListeFormation from './components/liste/ListeFormation';
import ListeEleve from './components/liste/ListeEleve';
import App from './components/App1';

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Inscription/> } />
          {/* <Route path='/' element={ <App /> } /> */}
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element= { <Register /> } />
          <Route path='/profil' element={ <ProfileComponent /> } />
          <Route path='/page' element={ <Page /> } />
          <Route path='/listeFormation' element={ <ListeFormation/> } />
          <Route path='/listeEleve' element={ <ListeEleve/> } />
        </Routes>
    </BrowserRouter>
  </StrictMode>
)
