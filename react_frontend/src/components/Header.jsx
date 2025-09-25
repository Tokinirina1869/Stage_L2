import { Dropdown } from 'bootstrap';
import { FaHome, FaUserGraduate, FaMoneyCheckAlt, FaSun, FaLanguage, FaMoon, FaAdjust } from 'react-icons/fa';
import React, { Component } from 'react';
import "../App.css"
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
    scrollToSection = (id) => {
        const section = document.querySelector(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    render() {
        const { menuState, activeMenu} = this.state;
        
        return (
            <div className="container-fluid">
                <img src={fma} alt="FMA"  width={80} className='me-3'/>
                <h2 className="fw-bold text-primary mb-0">FMA Anjarasoa Ankofafa</h2>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation"
                    aria-expanded={menuState ? "true" : "false"}  onClick={this.toggleMenu}>
                    {menuState ? (
                        <span style={{ fontSize: "2.2rem", color: "red" }}>&#x2715;</span>
                    ) : (
                        <span className="navbar-toggler-icon"></span>
                    )}
                </button>

                <div className={`collapse navbar-collapse ${menuState ? "show" : ""}`} style={{marginLeft: "10%"}} id="navbarNav">
                    <ul className="navbar-nav mx-5 mb-2">
                        <li className="nav-item mx-5 text-center fw-bold">
                            <button className={'nav-link btn btn-link p-0 ' + (activeMenu === 'apropos' ? 'active fw-bold text-info border-bottom border-3 border-info' : '')}
                                onClick={() => { this.setState({activeMenu: 'apropos'});
                                this.scrollToSection(this.props.propos); }}>
                                <FaHome size={24} className='mx-1' /> Apropos
                            </button>
                        </li>
                        <li className="nav-item mx-5 fw-bold">
                             <button className={'nav-link btn btn-link p-0 ' + (activeMenu === 'service' ? 'active fw-bold text-info border-bottom border-3 border-info' : '')}
                                onClick={() => { this.setState({activeMenu: 'service'});
                                this.scrollToSection(this.props.cfp); }}>
                                CFP 
                            </button>
                        </li>
                        <li className="nav-item mx-5 fw-bold">
                             <button className={'nav-link btn btn-link p-0 ' + (activeMenu === 'service' ? 'active fw-bold text-info border-bottom border-3 border-info' : '')}
                                onClick={() => { this.setState({activeMenu: 'service'});
                                this.scrollToSection(this.props.lycee); }}>
                                Lycée 
                            </button>
                        </li>
                        <li className="nav-item mx-5 fw-bold">
                            <button className={'nav-link btn btn-link p-0 ' + (activeMenu === 'contact' ? 'active fw-bold text-info border-bottom border-3 border-info' : '')}
                                onClick={() => { this.setState({activeMenu: 'contact'});
                                this.scrollToSection(this.props.contact); }} >
                                Contact
                            </button>
                        </li>
                       <li className={`nav-item dropdown mx-5 ${this.state.dropdownOpen ? 'show' : ''}`} onMouseEnter={() => this.setState({ dropdownOpen: true })} onMouseLeave={() => this.setState({ dropdownOpen: false })} >
                            <button className="dropdown-toggle fw-bold nav-link btn btn-link p-0" style={{ cursor: 'pointer' }} href="#" id="themeDropdown" role="button" aria-expanded={this.state.dropdownOpen ? 'true' : 'false'}>
                                <FaAdjust size={24} className="mx-1" />Thème
                            </button>

                            <ul className={`dropdown-menu ${this.state.dropdownOpen ? 'show' : ''}`}
                                aria-labelledby="themeDropdown">
                                <li>
                                    <button className={`dropdown-item ${this.state.theme === 'light' ? 'active' : ''}`}
                                        onClick={() => this.handleThemeChange('light')} >
                                        <FaSun size={25} className="mx-1" /> Mode Claire
                                    </button>
                                </li>
                                <li>
                                    <button className={`dropdown-item ${this.state.theme === 'dark' ? 'active' : ''}`} onClick={() => this.handleThemeChange('dark')} >
                                        <FaMoon size={25} className="mx-1" /> Mode Sombre
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