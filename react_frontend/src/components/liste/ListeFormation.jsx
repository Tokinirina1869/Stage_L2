import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AffichageFormation from "../Formation/AffichageFormation";
import NouvellePersonne from "../modals/NouvellePersonne";
import NouvelleInscription from "../modals/NouvelleInscription";
import InscriptionFormation from "../modals/InscriptionFormation";

const ListeFormation = ({onViewDashPro}) => {
    const [showPersonne, setShowPersonne] = useState(false);
    const [showInscription, setShowInscription] = useState(false);
    const [showFormation, setShowFormation] = useState(false);

    const [eleves, setEleves] = useState([]);
    const [currentEleve, setCurrentEleve] = useState(null);

    const openNewPersonne = () => setShowPersonne(true);
    const closeNewPersonne = () => setShowPersonne(false);

    const openNewInscription = () => setShowInscription(true);
    const closeNewInscription = () => setShowInscription(false);

    const openFormation = () => setShowFormation(true);
    const closeFormation = () => setShowFormation(false);

    const submitPersonne = (data) => {
        setCurrentEleve(data);  // Garde les inofs
        closeNewPersonne();     // Ferme le popup personne
        openNewInscription();   // Ouvre inscription
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="50" onClick={onViewDashPro} viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle text-primary fw-bold ">
                    <circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
                    <h2 className="fw-bold text-success text-center">Formation Professionnelle</h2>
                     <button onClick={openNewPersonne} className="btn btn-primary rounded-pill responsive-text">
                        <FaPlus size={25} className="mx-1" /> Nouvelle Inscription
                    </button>
                </div>
                <div className="card shadow-sm p-4 rounded-3">
                    <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
                        <div className="d-flex flex-wrap gap-2" role="group">
                            <button className="btn fw-bold btn-outline-primary mx-3 responsive-text">Tous</button>
                            <button className="btn fw-bold btn-outline-primary mx-3 responsive-text">Informatique</button>
                            <button className="btn fw-bold btn-outline-primary mx-3 responsive-text">Langue</button>
                            <button className="btn fw-bold btn-outline-primary mx-3 responsive-text">Musique</button>
                            <button className="btn fw-bold btn-outline-primary mx-3 responsive-text">Coupe et Couture</button>
                            <button className="btn fw-bold btn-outline-primary mx-3 responsive-text">Pâtisserie</button>
                        </div>

                        <div className="input-group w-auto mb-2 mb-lg-0">
                            <input type="search" name="search" className="form-control rounded-start-pill"  placeholder="Rechercher..."/>
                            <button className="btn btn-primary rounded-end-pill responsive-text">
                                Rechercher
                            </button>
                        </div>
                        
                    </div>
                    <AffichageFormation data={eleves} />
                </div>


                <NouvellePersonne show={showPersonne} handleClose={closeNewPersonne} onSubmit={submitPersonne} />

                <NouvelleInscription show={showInscription} handleClose={closeNewInscription} onSubmit={submitInscription} currentEleve={currentEleve} />

                <InscriptionFormation show={showFormation} handleClose={closeFormation} onSubmit={submitFormation} currentEleve={currentEleve} />
            </div>
        </>
    );
};

export default ListeFormation;