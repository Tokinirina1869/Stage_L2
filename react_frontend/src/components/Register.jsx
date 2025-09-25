import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/fma.png';
import background from '../FMA/cfp.jpg';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

class Registers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.password != this.state.confirmPassword) {
      this.setState({ message: 'Erreur lors de la création de mot de passe' });
    } 
    else {
      setTimeout(() => {
        this.props.navigate('/login');
      }, 1000);

    }
  }

  render() {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center bg-light" style={{ backgroundImage: `url(${background})`,backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="card shadow p-5 bg-white" style={{ width: '100%', maxWidth: "450px", minWidth: '300px' }}>
          <div className="text-center mb-3">
            <img src={logo} alt="Logo" width={100} />
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-info fw-bold">Email</label>
              <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label text-info fw-bold">Password</label>
              <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label text-info fw-bold">Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} required />
            </div>
            {this.state.message && (
              <div className={`alert ${this.state.message.includes('réussie') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>
                {this.state.message}
              </div>
            )}
            <div className="d-flex flex-column gap-2">
              <Link to='/login'> Retour </Link>
              <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3">
                Créer Compte
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export function Register() {
  const navigate = useNavigate();
  return <Registers navigate={navigate} />
}
