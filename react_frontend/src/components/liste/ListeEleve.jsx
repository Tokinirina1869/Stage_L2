import React, { useState } from 'react';
import AffichageEleve from '../Académique/AffichageEleve';
import NouvellePersonne from '../modals/NouvellePersonne';
import NouvelleInscription from '../modals/NouvelleInscription';
import InscriptionAcademique from '../modals/InscriptionAcademique';
import { FaPlus } from 'react-icons/fa';

const ListeEleve = ({onViewDash}) => {
    const [showPersonne, setShowPersonne] = useState(false);
    const [showInscription, setShowInscription] = useState(false);
    const [showAcademique, setshowAcademique] = useState(false);

    const [eleves, setEleves] = useState([]);
    const [currentEleve, setCurrentEleve] = useState(null);

    const openNewPersonne = () => setShowPersonne(true);
    const closeNewPersonne = () => setShowPersonne(false);

    const openNewInscription = () => setShowInscription(true);
    const closeNewInscription = () => setShowInscription(false);

    const openFormation = () => setshowAcademique(true);
    const closeFormation = () => setshowAcademique(false);

    const submitPersonne = (data) => {
        setCurrentEleve(data);
        closeNewPersonne();
        openNewInscription();
    };

    const submitInscription = (data) => {
        setCurrentEleve((prev) => ({ ...prev, ...data }));
        closeNewInscription();
        openFormation();
    };

    const submitFormation = (data) => {
        const eleveComplet = { ...currentEleve, ...data };
        setEleves((prev) => [...prev, eleveComplet]);
        setCurrentEleve(null);
        closeFormation();
    };

    return (
        <>
            <div className="container-fluid mt-2 shadow p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="50" onClick={onViewDash} viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle text-primary fw-bold ">
                        <circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>
                    </svg>
                    <h2 className="fw-bold text-success text-center">Formation Académique</h2>
                    <button onClick={openNewPersonne} className="btn btn-primary rounded-pill responsive-text">
                        <FaPlus size={25} className="mx-1" /> Nouvelle Inscription
                    </button>
                </div>
                <div className="card shadow-sm p-2 rounded-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                        <div className="d-flex flex-wrap d-flex p-2" role="group">
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Tous</button>
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Seconde</button>
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Première L</button>
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Première S</button>
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Terminale A</button>
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Terminale C</button>
                            <button className="btn fw-bold mx-3 btn-outline-primary responsive-text">Terminale D</button>
                        </div>

                        <div className="input-group w-auto mb-2 mb-lg-0">
                            <input type="search" name="search" className="form-control rounded-start-pill" placeholder="Rechercher..."/>
                            <button className="btn btn-primary rounded-end-pill">Rechercher</button>
                        </div>
                    </div>
                    <AffichageEleve data={eleves} />
                </div>

                <NouvellePersonne show={showPersonne} handleClose={closeNewPersonne} onSubmit={submitPersonne} />

                <NouvelleInscription show={showInscription} handleClose={closeNewInscription} onSubmit={submitInscription} />

                <InscriptionAcademique show={showAcademique} handleClose={closeFormation} onSubmit={submitFormation} />
            </div>
        </>
    );
};

export default ListeEleve;
