import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/fma.png';
import background from '../../FMA/cfp.jpg';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", { email, password });

      // Sauvegarde du token selon le choix "souvenir de moi"
      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Utilisation du contexte
      login(res.data.token, res.data.user);

      setLoading(false);
      navigate('/page'); // redirection après login
    } catch(err) {
      setMessage('E-mail ou mot de passe incorrect ❌.');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center"
         style={{
           backgroundImage: `url(${background})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="card shadow p-4 bg-white" style={{ width: '100%', maxWidth: 450 }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo" width={100} />
          <h2 className="text-success fw-bold p-2">Laura Vicuna</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-info fw-bold">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope color='gray' /></span>
              <input type="email" className="form-control"
                     value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-info fw-bold">Mot de Passe</label>
            <div className='input-group' style={{ position: 'relative' }}>
              <div className="input-group-text"><FaLock color='gray' /></div>
              <input type={showPass ? 'text' : 'password'}
                     className="form-control pe-5"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     placeholder="Mot de passe"
                     required />
              <span style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: 'gray'
                    }}
                    onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
              </span>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>
              {message}
            </div>
          )}

          {/* Souvenir de moi / Mot de passe oublié */}
          <div className="d-flex justify-content-between mb-3">
            <Link to='/register' className='text-decoration-none'>Mot de passe oublié ?</Link>
            <label className='text-decoration-none'>
              <input type="checkbox" className='mx-2'
                     checked={rememberMe}
                     onChange={e => setRememberMe(e.target.checked)} /> Souvenir de moi?
            </label>
          </div>

          {/* Boutons */}
          <div className="d-flex flex-column gap-2">
            <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Connexion...
                </>
              ) : 'Connexion'}
            </button>
            <Link to="/register" className="btn btn-outline-primary w-100 rounded-pill">
              Créer Compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Login() {
  return <LoginForm />;
}
