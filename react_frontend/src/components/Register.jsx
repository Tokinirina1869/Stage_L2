import React, { Component,useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/fma.png';
import background from '../FMA/cfp.jpg';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
function Registers({ navigate }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password != confirmPassword) {
      setMessage('Erreur lors de la création de mot de passe');
      return;
    }
    try{
      await axios.post("http://127.0.0.1:8000/api/register", {
        name: nom,
        email,
        password,
        password_confirmation: confirmPassword
      });

      // setMessage("Compte créé avec succès !");
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
    catch(err) {
      setMessage("Erreur lors de la création du compte! ");
      console.error(err);
    }
  }
  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light" style={{ backgroundImage: `url(${background})`,backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="card shadow p-5 bg-white" style={{ width: '100%', maxWidth: "450px", minWidth: '300px' }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo" width={100} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nom" className="form-label text-info fw-bold">Nom: </label>
            <div className="input-group">
              <div className="input-group-text">
                <span><FaUser size={24} /></span>
              </div>
              <input type="text" name="nom" className="form-control pe-4" value={nom}  onChange={(e) => setNom(e.target.value)} required/>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-info fw-bold">Email</label>
            <div className="input-group">
              <div className="input-group-text">
                <span><FaEnvelope size={24}/></span>
              </div>
              <input type="email" className="form-control pe-4" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-info fw-bold">Password</label>
            <div className="input-group">
              <div className="input-group-text">
                <span><FaLock size={25}/></span>
              </div>
              <input type={showPass ? "text" : "password"} className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span style={{position: "absolute",top: "50%", right: "10px", transform: "translateY(-50%)", cursor: 'pointer', color: 'gray'}} onClick={() => setShowPass(!showPass)}>  
                { showPass ? <FaEye size={25} /> : <FaEyeSlash size={25} /> }
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-info fw-bold">Confirm Password</label>
            <div className="input-group">
              <div className="input-group-text">
                <span><FaLock size={25}/></span>
              </div>
              <input type={showPass ? "text" : "password"} className="form-control" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <span style={{position: "absolute", top : "50%", right: "10px", transform: 'translateY(-50%)', cursor: 'pointer', color: 'gray'}} onClick={() => setShowPass(!showPass)}>
                { showPass ? <FaEye size={25} /> : <FaEyeSlash size={25} /> }
              </span>
            </div>
          </div>
          {message && (
            <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>
              {message}
            </div>
          )}
          <div className="d-flex flex-column gap-2">
            <Link to='/login'> Retour </Link>
            <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3" disabled={loading}>
              {loading ? (
                <>
                  <span className='spinner-border  spinner-border-sm me-2'></span> Création Compte
                </>
              ): "Créer Compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  return <Registers navigate={navigate} />
}
