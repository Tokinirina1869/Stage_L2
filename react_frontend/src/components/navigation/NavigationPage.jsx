import React, { useState } from 'react';
import fma from "../../assets/fma.png"
const NavigationPage = ({ handleMenuChange, onLogout, onProfil }) => {
  const [menuState, setMenuState] = useState(false);
  const [theme, setTheme] = useState('light');
  const toggleMenu = () => setMenuState(!menuState);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.body.setAttribute('data-bs-theme', newTheme);
  };

  const menus = [
    { type: 'link', name: 'dashboard', icon: <i className="fa-solid fa-home mx-1"></i> },
    {
      type: 'dropdown', name: 'inscription', icon: <i className="fa-solid fa-user-plus mx-1"></i>, items: [
        { name: "Académique", value: "academique" },
        { name: "Professionnelle", value: "professionnelle" },
      ]
    },
    { type: 'link', name: 'paiement', icon: <i className="fa-solid fa-money-check-alt mx-1"></i> }
  ];

  return (
    <header className="navbar navbar-expand-md bg-default shadow py-3 px-4">
      <div className="container-fluid">
        <img src={fma} alt="FMA" width={80} className='me-3' />
        <h2 className="fw-bold text-primary mb-0">FMA Anjarasoa Ankofafa</h2>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation"
          aria-expanded={menuState ? "true" : "false"} onClick={toggleMenu}>
          {menuState ? (
            <span style={{ fontSize: "2.2rem", color: "red" }}>&#x2715;</span>
          ) : (
            <span className="navbar-toggler-icon"></span>
          )}
        </button>

        <div className={`collapse navbar-collapse ${menuState ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {menus.map(menuObj => (
              menuObj.type === 'link'
                ? (
                  <li key={menuObj.name} className="nav-item mx-2 text-center fw-bold">
                    <a href="#" className={`nav-link fw-bold`}
                      onClick={() => handleMenuChange(menuObj.name)}>
                      <span className="me-1">{menuObj.icon}</span>{menuObj.name.charAt(0).toUpperCase() + menuObj.name.slice(1)}
                    </a>
                  </li>
                ) : (
                  <li key={menuObj.name} className="nav-item dropdown mx-2">
                    <a className={`nav-link dropdown-toggle fw-bold mx-3`}
                      href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="me-1">{menuObj.icon}</span>{menuObj.name.charAt(0).toUpperCase() + menuObj.name.slice(1)}
                    </a>
                    <ul className="dropdown-menu">
                      {menuObj.items.map(item => (
                        <li key={item.value}>
                          <button className="dropdown-item" onClick={() => handleMenuChange(item.value)}>
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
            ))}
            <li className="nav-item dropdown mx-2">
              <a className="nav-link dropdown-toggle fw-bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span className='me-1'>⚙️</span>Thème
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button className={`dropdown-item ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>
                    <span className='me-1'>☀️</span> Mode Claire
                  </button>
                </li>
                <li>
                  <button className={`dropdown-item ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>
                    <span className='me-1'>🌙</span> Mode Sombre
                  </button>
                </li>
              </ul>
            </li>
          </ul>

            <div className="nav-item dropdown ms-3">
            <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 p-0"
                href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                <span className="fw-bold">Tokinrina</span>
                <img src={fma} alt="Profil" className="rounded-circle border" width="40" height="40" />
            </a>

            <ul className="dropdown-menu dropdown-menu-end shadow vh-auto">
                <li className="dropdown-header text-center">
                    <img src={fma} alt="Profil" className="rounded-circle mb-2" width="60" height="60" />
                    <div className="fw-bold">Tokinirina</div>
                    <small className="text-muted">admin@gmail.com</small>
                </li>
                <li><hr className="dropdown-divider" /></li>

                <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={onProfil}>
                        <i className="fa-solid fa-user me-2 text-primary"></i>
                        Voir le profil
                    </button>
                </li>
                <li>
                    <button className="dropdown-item d-flex align-items-center text-danger mb-4" onClick={onLogout}>
                        <i className="fa-solid fa-sign-out-alt me-2"></i>
                        Se Déconnecter
                    </button>
                </li>
            </ul>
            </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationPage;
