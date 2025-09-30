import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/fma.png';
import background from '../../FMA/cfp.jpg';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function Logins() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email !== 'admin@gmail.com' || password !== '1234') {
      setMessage("Email ou Mot de passe incorrect");
    }

    setLoading(true);
    setMessage('');

    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === '1234') {
        setLoading(false);
        setMessage("Connexion réussie !");
        setTimeout(() => navigate('/page'), 1000);
      } else {
        setMessage('E-mail ou mot de passe incorrect.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="card shadow p-4 bg-white" style={{ width: '100%', maxWidth: "450px", minWidth: '300px' }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Logo" width={100} />
          <h2 className="text-success fw-bold p-2">Laura Vicuna</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-info fw-bold">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope color='gray' />
              </span>
              <input
                type="email"
                className="form-control Loginnn"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-info fw-bold">Mot de Passe:</label>
            <div className='input-group' style={{ position: 'relative' }}>
              <div className="input-group-text">
                <FaLock color='gray' />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control pe-5"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: 'gray'
                }}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
              </span>
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>
              {message}
            </div>
          )}

          <div className="d-flex justify-content-between mb-3">
            <Link to='/register' className='text-decoration-none'>Mot de passe oublié ?</Link>
            <label className='text-decoration-none'>
              <input type="checkbox" name="souvenir" className='mx-2' /> Souvenir de moi?
            </label>
          </div>

          <div className="d-flex flex-column gap-2">
            <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Connexion...
                </>
              ) : 'Connexion'}
            </button>

            <Link to="/register" className="btn btn-outline-primary w-100 rounded-pill mt-3">
              Créer Compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  return <Logins navigate={navigate} />
}