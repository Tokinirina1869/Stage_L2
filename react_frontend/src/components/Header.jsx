import React, { useState, useEffect } from 'react';
import { FaHome, FaAdjust, FaSun, FaMoon } from 'react-icons/fa';
import fma from '../assets/fma.png';

// Note: J'ai retiré 'import { Dropdown } from 'bootstrap';' car il n'est plus nécessaire avec Tailwind.
// J'ai aussi nettoyé les icônes non utilisées pour simplifier.
// Le composant est maintenant exporté en fonction.

function Headers(props) {
    // 1. Gestion des états locaux
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('apropos');
    const [theme, setTheme] = useState('light');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // 2. Initialisation du thème au montage (équivalent à componentDidMount pour l'initialisation)
    useEffect(() => {
        // Appliquer le thème initial à la balise body
        document.body.setAttribute('data-bs-theme', theme);
    }, [theme]); // Exécuté au montage et lorsque 'theme' change

    // 3. Fonctions de manipulation de l'état
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const handleMenuClick = (menu, sectionId) => {
        setActiveMenu(menu);
        scrollToSection(sectionId);
        setMenuOpen(false); // Fermer le menu sur mobile après un clic
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setDropdownOpen(false);
    };
    
    // 4. Fonction de défilement vers la section
    const scrollToSection = (id) => {
        const section = document.querySelector(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // La structure est basée sur une navigation Tailwind simple et responsive
    return (
        <div className="container mx-auto flex items-center justify-between flex-wrap">
            {/* Logo et Titre */}
            <div className="flex items-center flex-shrink-0 mr-6">
                <img src={fma} alt="FMA" width={60} className='mr-3 rounded-full shadow-md' />
                <h2 className="font-extrabold text-xl sm:text-2xl text-blue-700">
                    FMA Anjarasoa Ankofafa
                </h2>
            </div>

            {/* Bouton Toggle (Mobile) */}
            <div className="block lg:hidden">
                <button
                    onClick={toggleMenu}
                    className="flex items-center px-3 py-2 border rounded text-blue-500 border-blue-500 hover:text-blue-700 hover:border-blue-700 focus:outline-none"
                >
                    {menuOpen ? (
                        <span className="text-2xl text-red-500">&times;</span>
                    ) : (
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                        </svg>
                    )}
                </button>
            </div>

            {/* Menu de Navigation */}
            <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto transition-all duration-300 ${menuOpen ? 'block' : 'hidden'}`}>
                <nav className="text-sm lg:flex-grow lg:flex lg:justify-end">
                    
                    {/* Lien À Propos */}
                    <button
                        onClick={() => handleMenuClick('apropos', props.propos)}
                        className={`block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-blue-700 mx-4 py-2 font-semibold transition duration-200 focus:outline-none ${activeMenu === 'apropos' ? 'text-blue-700 border-b-2 border-blue-700' : ''}`}
                    >
                        <FaHome size={18} className='inline-block mr-1 align-middle' /> À propos
                    </button>
                    
                    {/* Lien CFP */}
                    <button
                        onClick={() => handleMenuClick('cfp', props.cfp)}
                        className={`block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-blue-700 mx-4 py-2 font-semibold transition duration-200 focus:outline-none ${activeMenu === 'cfp' ? 'text-blue-700 border-b-2 border-blue-700' : ''}`}
                    >
                        CFP
                    </button>

                    {/* Lien Lycée */}
                    <button
                        onClick={() => handleMenuClick('lycee', props.lycee)}
                        className={`block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-blue-700 mx-4 py-2 font-semibold transition duration-200 focus:outline-none ${activeMenu === 'lycee' ? 'text-blue-700 border-b-2 border-blue-700' : ''}`}
                    >
                        Lycée
                    </button>

                    {/* Lien Contact */}
                    <button
                        onClick={() => handleMenuClick('contact', props.contact)}
                        className={`block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-blue-700 mx-4 py-2 font-semibold transition duration-200 focus:outline-none ${activeMenu === 'contact' ? 'text-blue-700 border-b-2 border-blue-700' : ''}`}
                    >
                        Contact
                    </button>

                    {/* Dropdown Thème (Remplacé par un bouton simple et des classes Tailwind) */}
                    <div
                        className={`relative group inline-block text-left mt-4 lg:mt-0 ml-4`}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button
                            className="inline-flex justify-center items-center py-2 px-4 text-gray-700 hover:text-blue-700 font-semibold focus:outline-none"
                            aria-expanded={dropdownOpen ? 'true' : 'false'}
                        >
                            <FaAdjust size={18} className="mr-1" /> Thème
                        </button>

                        {/* Contenu du Dropdown */}
                        <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out ${dropdownOpen ? 'visible opacity-100 transform translate-y-0' : 'invisible opacity-0 transform translate-y-2'}`}
                             role="menu" aria-orientation="vertical" aria-labelledby="themeDropdown">
                            <div className="py-1" role="none">
                                {/* Mode Claire */}
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${theme === 'light' ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
                                    role="menuitem"
                                >
                                    <FaSun size={18} className="mr-2" /> Mode Claire
                                </button>
                                {/* Mode Sombre */}
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${theme === 'dark' ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
                                    role="menuitem"
                                >
                                    <FaMoon size={18} className="mr-2" /> Mode Sombre
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Headers;