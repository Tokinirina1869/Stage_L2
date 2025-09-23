import React, { Component } from 'react';
import logo from '../assets/fma.png';
import background from '../FMA/cfp.jpg';
import Page from './Page';
import Accueil from "./Accueil";

class Register extends Component {
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
        this.props.onLoginSuccess();
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
              <button type="button" className="btn btn-primary w-100 rounded-pill mt-3">
                Retour
              </button>
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // e.preventDefault();
    if (this.state.email === 'admin@gmail.com' && this.state.password === '1234') {
      setTimeout(() => {
        this.props.onLoginSuccess();
      }, 1000);
    } 
    else {
      this.setState({ message: 'E-mail ou mot de passe incorrect.' });
    }
  }

  render() {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center "
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="card shadow p-4 bg-white" style={{ width: '100%', maxWidth: "450px", minWidth: '300px' }}>
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
            {this.state.message && (
              <div className={`alert ${this.state.message.includes('réussie') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>
                {this.state.message}
              </div>
            )}
            <div className="d-flex flex-column gap-2">
              <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3">
                Connexion
              </button>
              <button type="button" onClick={this.props.onNavigateToHome} className="btn btn-primary w-100 rounded-pill mt-3">
                Créer Compte
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'login',
    };
  }

  renderPage = () => {
    switch (this.state.currentPage) {
      case 'accueil': 
        return <Accueil OnHomePage={() => this.state.setState({ currentPage: 'accueil'})} />
      case 'register':
        return <Register onLoginSuccess={() => this.setState({ currentPage: 'dashboard' })} onNavigateToLogin={() => this.setState({ currentPage: 'login' })} />;
      case 'login':
        return <Login onLoginSuccess={() => this.setState({ currentPage: 'dashboard' })} onNavigateToHome={() => this.setState({ currentPage: 'register' })} />;
      case 'dashboard':
        return <Page onLogout={() => this.setState({ currentPage: 'accueil' })} />;
      default:
        return <DashboardPage onLogout={() => this.setState({ currentPage: 'accueil' })} />;
    }
  };

  render() {
    return (
      <>
        {this.renderPage()}
      </>
    );
  }
}

export default Account;
