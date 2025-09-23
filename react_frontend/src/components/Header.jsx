import { Dropdown } from 'bootstrap';
import { FaHome, FaUserGraduate, FaMoneyCheckAlt, FaSun, FaLanguage, FaMoon, FaAdjust } from 'react-icons/fa';
import React, { Component } from 'react';
import fma from '../assets/fma.png';
class Headers extends Component {
    constructor(props){
        super(props);
        this.state = { 
            menuState: false, 
            activeMenu: 'accueil', 
            theme: 'light',
            langue: 'fr',
            dropdownOpen: false
        };
    }
    toggleMenu = () => {
        this.setState(prevMenu => ({ menuState : !prevMenu.menuState }));
    }
    toggleDropdown = () => {
        this.setState((prevDrop) => ({ dropdownOpen : !prevDrop.dropdownOpen }));
    }
    handleclick = (menu) => {
        this.setState(({ activeMenu : menu }));
    }
    handleThemeChange = (theme) => {
        this.setState({ theme, dropdownOpen: false });
        document.body.setAttribute('data-bs-theme', theme);
    }

    render() {
        const { menuState, activeMenu, theme, langue } = this.state;
        
        return (
            <div className="container" style={{ color: theme === "dark" ? "white" : "black" }} >
                
                <div className="col-lg-3">
                    <h5 className="navbar-brand d-flex align-items-center fw-bold mb-0 me-5">
                        <img src={fma} alt="Logo" width={80} height={80} className="me-2"/>
                        <h2 className="text-primary fw-bold">FMA Anjarasoa Ankofafa</h2>
                    </h5>
                </div>
                  
                   
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation"
                        aria-expanded={menuState ? "true" : "false"}  onClick={this.toggleMenu}>
                        {menuState ? (
                            <span style={{ fontSize: "1.5rem", color: "red" }}>&#x2715;</span>
                        ) : (
                            <span className="navbar-toggler-icon"></span>
                        )}
                    </button>

                    <div className={`collapse navbar-collapse ${menuState ? "show" : ""}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-2 text-center fw-bold">
                                <a href="#" className={'nav-link ' + (activeMenu ? 'active fw-bold text-info border-bottom border-3 border-info' : '')}>
                                    <FaHome size={24} className='mx-1' /> Accueil
                                </a>
                            </li>
                            <li className="nav-item dropdown mx-2">
                                <a className="nav-link dropdown-toggle fw-bold" style={{ cursor: "pointer" }}
                                    href="#" id="themeDropdown" onClick={ this.toggleDropdown }
                                    role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaAdjust size={24} className='mx-1'/>Thème
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="themeDropdown">
                                    <li>
                                        <button className={`dropdown-item ${theme === 'light' ? 'active' : ''}`}
                                            onClick={() => this.handleThemeChange('light') + this.setState(() => ({ menuState : false }))}>
                                            <FaSun size={25} className='mx-1' /> Mode Claire
                                        </button>
                                    </li>
                                    <li>
                                        <button className={`dropdown-item ${theme === 'dark' ? 'active' : ''}`}
                                            onClick={() => this.handleThemeChange('dark') + this.setState(() => ({ menuState : false }))}>
                                            <FaMoon size={25} className='mx-1' /> Mode Sombre
                                        </button>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown mx-3">
                                <a href="#" className="nav-link dropdown-toggle fw-bold" style={{ cursor: "pointer"}}
                                    role='button' data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaLanguage size={25} className='mx-1' /> Langues
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className={`dropdown-item ${ langue === 'fr' ? 'active' :''}`}>
                                            Français 🇫🇷
                                        </button>
                                    </li>
                                    <li>
                                        <button className={`dropdown-item ${ langue === 'en' ? 'active' :''}`}>
                                            English 🇬🇧
                                        </button>
                                    </li>
                                    <li>
                                        <button className={`dropdown-item ${ langue === 'mg' ? 'active' :''}`}>
                                            Malagasy 🇲🇬
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
            </div>
        );
    }
}

export default Headers;