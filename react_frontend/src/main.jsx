import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Inscription from './components/Inscription';
import { Login } from './components/Users/Login';
import Page from './components/Page';
import { Register } from './components/Register';
import ProfileComponent from './components/modals/ProfileComponent';
import ListeFormation from './components/liste/ListeFormation';
import ListeEleve from './components/liste/ListeEleve';
import NouvelleInscription from './components/modals/NouvelleInscription';

import { ThemeProvider } from './components/ThemeContext';
import ProtectedRoute from './components/Users/ProtectedRoute';
import { AuthProvider } from './components/Users/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path='/' element={<Inscription />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Routes protégées */}
            <Route path='/profil' element={<ProtectedRoute element={<ProfileComponent />} />} />
            <Route path='/page' element={<ProtectedRoute element={<Page />} />} />
            <Route path='/listeFormation' element={<ProtectedRoute element={<ListeFormation />} />} />
            <Route path='/listeEleve' element={<ProtectedRoute element={<ListeEleve />} />} />
            <Route path='/nouvelleInscription' element={<ProtectedRoute element={<NouvelleInscription />} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
