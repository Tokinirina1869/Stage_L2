import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cfp from '../FMA/cfp.jpg';
import lycee from '../FMA/lycee.jpg';
import coupe from "../FMA/Form/Coupe.jpg";
import langue from "../FMA/Form/couture.jpg"
import info from "../FMA/Form/infor.jpg";
import music from "../FMA/Music.jpg";
import patisserie from "../FMA/Form/Patisserie.jpg";
import { FaCheck, FaPen } from 'react-icons/fa';
import Headers from './Header';

function Accueil() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); 

    return (
        <div>
            <header className={`py-4 px-6 shadow-lg transition-all duration-300 ease-in-out ${
                isSticky ? 'fixed top-0 left-0 right-0 z-50 bg-white' : 'bg-transparent'
            }`}>
                <Headers propos="#propos" service="#service" contact="#contact" cfp="#cfp" lycee="#lycee" />

            </header>
            
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-16 lg:mt-0 shadow-xl' id='cfp'>
                <h2 className="text-center text-blue-600 text-3xl lg:text-4xl font-extrabold relative mb-12 pt-8">
                    Centre de Formation Professionnelle (CFP) Laura Vicuna Anjarasoa Ankofafa Fianarantsoa
                    <span className="block w-56 h-1 bg-blue-600 mx-auto mt-2"></span>
                </h2>
                
                <div className="flex flex-wrap items-center bg-gray-50 p-6 lg:p-10 rounded-xl shadow-lg mb-12">
                    <div className="w-full lg:w-8/12 mb-6 lg:mb-0 lg:pr-10" id='propos'>
                        <h3 className="text-center text-blue-600 text-2xl font-bold border-b-4 border-blue-600 pb-2 mb-6 inline-block">
                            À propos
                        </h3>
                        <p className='mt-5 text-lg text-gray-700 leading-relaxed text-justify'>
                            Un centre de formation Professionelle qui favorise l'intégration socio-économique et socio-
                            professionnelle des jeunes et de femmes vulnérables au niveau zonal en leur offrant une formation
                            professionnelle de qualité, en les accompagnant dans l'entrepreneuriat durable et en mettant en 
                            place un mécanisme d'auto-financement pérenne. 
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed mt-4 text-justify">
                            Centre de Formation Professionnelle (CFP) Laura Vicuna Madagascar, Province de Fianarantsoa, District de Fianarantsoa,
                            Arrondissement Manolafaka ANJARASOA ANKOFAFA. 
                        </p>
                        <div className="text-center mt-8">
                            <Link to="/login">
                                <button className="px-8 py-3 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
                                    Se Connecter
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full lg:w-4/12">
                        <img src={cfp} alt="CFP Laura Vicuna" className="w-full h-auto rounded-xl shadow-2xl" />
                    </div>
                </div>
                
                <h2 className="text-blue-600 text-3xl font-extrabold text-center mt-16 mb-8">
                    Formation de trois mois (ou Formation à court terme) pour tout le monde
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Carte Informatique */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-[1.02]">
                            <div className="text-center mb-5">
                                <img src={info} alt="Informatique" className="rounded-full w-48 h-48 object-cover mx-auto ring-4 ring-blue-600/50" />
                                <h3 className='text-2xl font-bold text-green-600 mt-4'>Informatique</h3>
                            </div>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>Traitement de texte **WORD**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>Tableur **EXCEL**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>Présentation **POWERPOINT**</span>
                                </li>
                            </ul>
                            <p className="text-center mt-6 pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-700 block">Droit: <span className="text-3xl font-extrabold text-green-600">10 000Ar</span></span>
                                <span className="font-bold text-gray-700 block mt-2">Ecolage: <span className="text-3xl font-extrabold text-green-600">15 000Ar</span></span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Carte Langue */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-[1.02]">
                            <div className="text-center mb-5">
                                <img src={coupe} alt="Langues" className='rounded-full w-48 h-48 object-cover mx-auto ring-4 ring-blue-600/50' />
                                <h3 className="text-2xl font-bold text-green-600 mt-4">Langue</h3>
                            </div>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>Langue **FRANÇAISE**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>Langue **ANGLAISE**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>Langue **ITALIENNE**</span>
                                </li>
                            </ul>
                            <p className="text-center mt-6 pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-700 block">Droit: <span className="text-3xl font-extrabold text-green-600">10 000Ar</span></span>
                                <span className="font-bold text-gray-700 block mt-2">Ecolage: <span className="text-3xl font-extrabold text-green-600">10 000Ar</span></span>
                            </p>
                        </div>
                    </div>

                    {/* Carte Pâtisserie */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-[1.02]">
                            <div className="text-center mb-5">
                                <img src={patisserie} alt="Pâtisserie" className='rounded-full w-48 h-48 object-cover mx-auto ring-4 ring-blue-600/50' />
                                <h3 className="text-2xl font-bold text-green-600 mt-4">Pâtisserie</h3>
                            </div>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**PETIT FOUR**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**FAST FOOD**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**GÂTEAU**</span>
                                </li>
                            </ul>
                            <p className="text-center mt-6 pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-700 block">Droit: <span className="text-3xl font-extrabold text-green-600">10 000Ar</span></span>
                                <span className="font-bold text-gray-700 block mt-2">Ecolage: <span className="text-3xl font-extrabold text-green-600">15 000Ar</span></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Formations (Long Terme) --- */}
                <h2 className="text-blue-600 text-3xl font-extrabold text-center mt-16 mb-8">
                    Formation de 2 ans (ou Formation à long terme) + Cours de Perfectionnement ciblé pour l'âge de 15 à 25 ans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Carte Musique */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-[1.02]">
                            <div className="text-center mb-5">
                                <img src={music} alt="Musique" className="rounded-full w-48 h-48 object-cover mx-auto ring-4 ring-blue-600/50" />
                                <h3 className="text-2xl font-bold text-green-600 mt-4">Musique</h3>
                            </div>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**PIANO-CLAVIER**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**GUITARE-DANSE**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**FLÛTE-BATTERIE**</span>
                                </li>
                            </ul>
                            <p className="text-center mt-6 pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-700 block">Droit: <span className="text-3xl font-extrabold text-green-600">10 000Ar</span></span>
                                <span className="font-bold text-gray-700 block mt-2">Ecolage: <span className="text-3xl font-extrabold text-green-600">15 000Ar</span></span>
                            </p>
                        </div>
                    </div>

                    {/* Carte Coupe et Couture 1 */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-[1.02]">
                            <div className="text-center mb-5">
                                <img src={langue} alt="Coupe et Couture" className="rounded-full w-48 h-48 object-cover mx-auto ring-4 ring-blue-600/50" />
                                <h3 className="text-2xl font-bold text-green-600 mt-4">Coupe et Couture</h3>
                            </div>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**PANTALON-CHEMISE**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**VESTE-BLOUSE**</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between'>
                                    <FaCheck size={20} className='text-green-600 mr-2' />
                                    <span className='w-full text-left'>**ROBE - COSTARD ...**</span>
                                </li>
                            </ul>
                            <p className="text-center mt-6 pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-700 block">Droit: <span className="text-3xl font-extrabold text-green-600">10 000Ar</span></span>
                                <span className="font-bold text-gray-700 block mt-2">Ecolage: <span className="text-3xl font-extrabold text-green-600">15 000Ar</span></span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Carte Coupe et Couture 2 (Duplication - laissé tel quel) */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-blue-300 transition duration-300 transform hover:scale-[1.02] h-full flex flex-col justify-center">
                            <div className="text-center mb-5">
                                <img src={langue} alt="Coupe et Couture" className="rounded-full w-48 h-48 object-cover mx-auto ring-4 ring-blue-600/50" />
                                <h3 className="text-2xl font-bold text-green-600 mt-4">Coupe et Couture</h3>
                            </div>
                            <p className="text-gray-500 text-center text-lg mt-4">
                                Le CFP Laura Vicuña s'est progressivement structuré à côté de la
                                communauté, devenant un pilier de l'éducation professionnelle dans la région.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Section Lycée --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12 shadow-xl bg-blue-50" id='lycee'>
                <h2 className="text-blue-800 text-3xl lg:text-4xl font-extrabold text-center relative mb-12">
                    Lycée Catholique Laura Vicuna Anjarasoa
                    <span className="block w-64 h-1 bg-blue-800 mx-auto mt-2"></span>
                </h2>
                
                <div className="flex flex-wrap items-center mb-10">
                    <div className="w-full lg:w-4/12 mb-6 lg:mb-0">
                        <img src={lycee} alt="Lycée Laura Vicuna" className="w-full h-auto rounded-xl shadow-2xl" />
                    </div>
                    <div className="w-full lg:w-8/12 lg:pl-10">
                        <p className='mt-5 text-lg text-gray-700 leading-relaxed p-4 bg-white rounded-lg shadow-md text-justify'>
                        Au Lycee Laura Vicuna, le lycée se divise en trois niveaux. D'abord, il y a la classe de **seconde (2<sup>nde</sup>)**,
                        qui marque l'entrée au lycée après le collège. C'est une année de transition et de détermination du parcours. Ensuite, on passe en **première (1<sup>ère</sup> L et S)**. 
                        C'est une année cruciale où les élèves choisissent des spécialités et commencent à préparer le baccalauréat. Finalement, la classe de **terminale (T<sup>le</sup> A, D et C)**
                        est la dernière année du lycée, consacrée à l'obtention du diplôme du baccalauréat, qui ouvre les portes de l'enseignement supérieur.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Carte Seconde */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-500">
                            <h3 className="text-blue-600 text-2xl font-bold text-center mb-6 flex items-center justify-center">
                                <FaPen size={24} className='mr-2 text-red-500' /> Classe de Seconde (2<sup>nde</sup>)
                            </h3>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Droit d'Inscription: <span className='font-extrabold text-2xl text-green-600'>15 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Frais Scolaires: <span className='font-extrabold text-2xl text-green-600'>74 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> VRM: <span className='font-extrabold text-2xl text-green-600'>6 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between pt-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Ecolage par mois: <span className='font-extrabold text-2xl text-green-600'>28 500Ar</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Carte Première */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-500">
                            <h3 className="text-blue-600 text-2xl font-bold text-center mb-6 flex items-center justify-center">
                                <FaPen size={24} className='mr-2 text-red-500' /> Classe de Première (1<sup>ère</sup>)
                            </h3>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Droit d'Inscription: <span className='font-extrabold text-2xl text-green-600'>15 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Frais Scolaires: <span className='font-extrabold text-2xl text-green-600'>74 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> VRM: <span className='font-extrabold text-2xl text-green-600'>6 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between pt-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Ecolage par mois: <span className='font-extrabold text-2xl text-green-600'>29 000Ar</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Carte Terminale */}
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-500">
                            <h3 className="text-blue-600 text-2xl font-bold text-center mb-6 flex items-center justify-center">
                                <FaPen size={24} className='mr-2 text-red-500' /> Classe de Terminale (T<sup>le</sup>)
                            </h3>
                            <ul className='list-none space-y-4 px-4'>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Droit d'Inscription: <span className='font-extrabold text-2xl text-green-600'>15 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Frais Scolaires: <span className='font-extrabold text-2xl text-green-600'>74 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between border-b pb-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> VRM: <span className='font-extrabold text-2xl text-green-600'>6 000Ar</span>
                                </li>
                                <li className='font-semibold flex items-center justify-between pt-2'>
                                    <FaCheck size={20} className='text-yellow-500 mr-2' /> Ecolage par mois: <span className='font-extrabold text-2xl text-green-600'>30 000Ar</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accueil;