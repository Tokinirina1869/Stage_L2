import React, { Component, useState } from 'react';
import fma from "../assets/fma.png";
import FormulaireInscription from './Formation/FormulaireInscription';
import Affichage from './Formation/Affichage';
import DashboardPage from './DashboadPage';
import AffichageEleve from './Académique/AffichageEleve';

import App from './Accueil';

import { FaHome, FaMoneyCheckAlt, FaPlus, FaSignOutAlt, FaTimes, FaUserPlus } from 'react-icons/fa';

const LogoutModal = ({ show, handleClose, handleConfirm }) => {
    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Déconnexion</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className="text-center">Voulez-vous vraiment vous déconnecter ?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary btn-light" onClick={handleClose}> <FaTimes size={24} className='mx-1 me-2' /> Annuler</button>
                        <button type="button" className="btn btn-outline-danger" onClick={ handleConfirm }> <FaSignOutAlt size={24} className='mx-2' /> Se déconnecter</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NouvelleInscription = ({ show, handleClose }) => {
    return (
        <div className={`modal fade w-100 ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered w-90" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold text-center">Ajouter une nouvelle personne</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form >
                            <FormulaireInscription />
                            <div className="modal-footer text-center mb-2">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Annuler</button>
                                <button type="button" className="btn btn-primary">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ListeFormation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="container-fluid p-4 mt-5">
            <div className="card shadow-sm p-4 rounded-3">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <h3 className="card-title h5 mb-0 fw-bold">Formation professionnelle</h3>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary rounded-pill">
                       <FaPlus size={25} className='mx-1' /> Nouvelle Inscription
                    </button>
                </div>
                <Affichage />
            </div>
            <NouvelleInscription show={isModalOpen} handleClose={() => setIsModalOpen(false)} />
        </div>
    );
};
const ListeEleve = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="container-fluid mt-5 p-4">
            <div className="card shadow-sm p-4 rounded-3">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <h3 className="card-title h5 mb-0 fw-bold">Formation Générale</h3>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary rounded-pill">
                       <FaPlus size={25} className='mx-1' /> Nouvelle Inscription
                    </button>
                </div>
                <AffichageEleve />
            </div>
            <NouvelleInscription show={isModalOpen} handleClose={() => setIsModalOpen(false)} />
        </div>
    );
};
const PaymentPage = () => (
    <div className="container mt-5">
        <div className="card shadow p-5 text-center">
            <h1 className="display-4">Page de Paiement</h1>
            <p className="lead">Cette section est en cours de développement.</p>
        </div>
    </div>
);

const NavigationPage = ({ currentPage, handleMenuChange, onLogout }) => {
    const [menuState, setMenuState] = useState(false);
    const [theme, setTheme] = useState('light');

    const toggleMenu = () => setMenuState(!menuState);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.body.setAttribute('data-bs-theme', newTheme);
    };

    const menus = [
        { type: 'link', name: 'dashboard', icon: <FaHome size={25} className='mx-1'/>},
        { type: 'dropdown', name: 'inscription', icon: <FaUserPlus size={24} className='mx-1' />, items: [
                { name: "Académique", value: "academique" },
                { name: "Professionnelle", value: "professionnelle" },
            ]
        },
        { type: 'link', name: 'paiement', icon: <FaMoneyCheckAlt size={24} className='mx-1' />}
    ];

    return (
        <header className="navbar navbar-expand-md bg-default shadow py-3 px-4">
            <div className="container-fluid">
                <img src={fma} alt="FMA"  width={80} className='me-3'/>
                <h2 className="fw-bold text-primary mb-0">FMA Anjarasoa Ankofafa</h2>
                <button className="navbar-toggler" type="button"
                    onClick={toggleMenu} aria-controls="navbarNav" aria-expanded={menuState} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${menuState ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {menus.map(menuObj => (
                            menuObj.type === 'link'
                                ? (
                                    <li key={menuObj.name} className="nav-item mx-2 text-center fw-bold">
                                        <a href="#" className={`nav-link ${currentPage === menuObj.name ? 'active fw-bold text-primary border-bottom border-3 border-primary' : ''}`}
                                            onClick={() => handleMenuChange(menuObj.name)}>
                                            <span className="me-1">{menuObj.icon}</span>{menuObj.name.charAt(0).toUpperCase() + menuObj.name.slice(1)}
                                        </a>
                                    </li>
                                ) : (
                                    <li key={menuObj.name} className="nav-item dropdown mx-2">
                                        <a className={`nav-link dropdown-toggle fw-bold mx-3 ${currentPage.startsWith(menuObj.name) ? 'active fw-bold text-primary border-bottom border-3 border-primary' : ''}`}
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

                    <button onClick={onLogout} className="btn btn-danger rounded-pill ms-3">
                        <FaSignOutAlt size={24} className='mx-1' /> Déconnexion
                    </button>
                </div>
            </div>
        </header>
    );
};

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'dashboard',
            showLogoutModal: false,
        };
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLogoutConfirm = this.handleLogoutConfirm.bind(this);
        this.handleLogoutClose = this.handleLogoutClose.bind(this);
    }

    handleMenuChange(menu) {
        this.setState({ currentPage: menu });
    }

    handleLogoutClick() {
        this.setState({ showLogoutModal: true });
    }

    handleLogoutClose() {
        this.setState({ showLogoutModal: false });
    }

    handleLogoutConfirm() {
        this.setState({ currentPage: 'accueil', showLogoutModal: false });
        console.log("Déconnexion réussie !");
    }

    render() {
        const { currentPage, showLogoutModal } = this.state;
        
        let content;
        if (currentPage === 'dashboard') {
            content = <DashboardPage />;
        } 
        else if (currentPage === 'professionnelle' ) {
            content = <ListeFormation />;
        } 
        else if (currentPage === 'academique') {
            content = <ListeEleve />
        }
        else if (currentPage === 'paiement') {
            content = <PaymentPage />;
        }
        else if (currentPage === 'accueil') {
            content = <App />
        }

        return (
            <div>
                <NavigationPage currentPage={currentPage} handleMenuChange={this.handleMenuChange} onLogout={this.handleLogoutClick} />

                <main> {content} </main>
                
                <LogoutModal show={showLogoutModal} handleClose={this.handleLogoutClose} handleConfirm={this.handleLogoutConfirm} />
            </div>
        );
    }
}

export default Page;
