import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/fma.png';
import background from '../../FMA/cfp.jpg';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

class Logins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
      loading: false,
      showPass: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (email != 'admin@gmail.com' && password != '1234') {
      this.setState({ message: "Email ou Mot de passe incorrect" })
    }

    this.setState({ loading: true, message: '' });

    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === '1234') {
        this.setState({loading: false });
        setTimeout(() => this.props.navigate('/page'), 1000);
      } else {
        this.setState({
          message: 'E-mail ou mot de passe incorrect.',
          loading: false
        });
      }
    }, 1000);
  }

  render() {
     const { email, password, message, loading, showPass } = this.state;
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
            <h2 className="text-success fw-bold p-2">Laura Vicuna</h2>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-info fw-bold">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope color='gray'/> 
                </span>
                <input type="email" className="form-control Loginnn" name="email" value={email} onChange={this.handleChange} />
              </div>
              { message && (
                <span className={`text-danger text-center mt-3`}> { this.state.message } </span>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label text-info fw-bold">Mot de Passe:</label>
              
              <div className='input-group' style={{ position: 'relative' }}>
                <div className="input-group-text">
                  <FaLock  color='gray' />
                </div>
                <input type={showPass ? 'text' : 'password'} className="form-control pe-5" 
                name="password" value={password} onChange={this.handleChange} placeholder="Mot de passe" />

                <span style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', color: 'gray'}}
                  onClick={() => this.setState({ showPass: !showPass })}>
                  {showPass ? <FaEyeSlash size={25} /> : <FaEye  size={25}/>}
                </span>
              </div>
              {message && (
                <span className={`text-danger text-center mt-3`}>
                  {this.state.message}
                </span>
              )}
            </div>
            { message && (
              <div className={`alert ${this.state.message.includes('réussie') ? 'alert-success' : 'alert-danger'} text-center mt-3`}>
                {this.state.message}
              </div>
            )}
            <Link to='/register' className='text-decoration-none'>Mot de passe oublié ?</Link>
            
            <div className="d-flex flex-column gap-2">
              <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Connexion...
                  </>
                ):
                  ( 'Connexion' )
                }
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
}

export function Login() {
  const navigate = useNavigate();
  return <Logins navigate={navigate} />
}