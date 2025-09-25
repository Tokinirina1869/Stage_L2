import React, { useState } from 'react';
import AffichageEleve from '../Académique/AffichageEleve';
import NouvellePersonne from '../modals/NouvellePersonne';
import NouvelleInscription from '../modals/NouvelleInscription';
import InscriptionAcademique from '../modals/InscriptionAcademique';
import { FaPlus } from 'react-icons/fa';

const ListeEleve = () => {
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
        <div className="container-fluid mt-5 p-4">
            <div className="card shadow-sm p-4 rounded-3">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h3 className="card-title h5 mb-0 fw-bold responsive-title">Formation Générale</h3>
                <div className="d-flex flex-wrap gap-5 d-flex" role="group">
                    <button className="btn fw-bold btn-outline-primary responsive-text">Tous</button>
                    <button className="btn fw-bold btn-outline-primary responsive-text">Seconde</button>
                    <button className="btn fw-bold btn-outline-primary responsive-text">Première</button>
                    <button className="btn fw-bold btn-outline-primary responsive-text">Terminale</button>
                </div>

                <div className="input-group w-auto mb-2 mb-lg-0">
                    <input type="search" name="search" className="form-control rounded-start-pill" placeholder="Rechercher..."/>
                    <button className="btn btn-primary rounded-end-pill">Rechercher</button>
                </div>
                <button onClick={openNewPersonne} className="btn btn-primary rounded-pill responsive-text">
                    <FaPlus size={25} className="mx-1" /> Nouvelle Inscription
                </button>
                </div>
                <AffichageEleve data={eleves} />
            </div>

            <NouvellePersonne show={showPersonne} handleClose={closeNewPersonne} onSubmit={submitPersonne} />

            <NouvelleInscription show={showInscription} handleClose={closeNewInscription} onSubmit={submitInscription} />

            <InscriptionAcademique show={showAcademique} handleClose={closeFormation} onSubmit={submitFormation} />
        </div>
    );
};

export default ListeEleve;
