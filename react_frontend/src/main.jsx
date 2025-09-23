import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"
import Inscription from './components/Inscription';

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    < Inscription />
  </StrictMode>
)
