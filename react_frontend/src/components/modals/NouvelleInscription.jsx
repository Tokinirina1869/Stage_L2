import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const NouvelleInscription = ({ show, handleClose, onSubmit }) => {
    const [inscription, setInscription] = useState('');
    const [date, setDate] = useState('');
    const [annee, setAnnee] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({ inscription, date, annee });
        setInscription(''); setDate(''); setAnnee('');
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <h2 className="jumbotron text-center fw-bold p-4">Nouvelle Inscription</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="inscription" className="form-label">N° Inscription: </label>
                                <input type="text" name="inscription" id="inscription" className="form-control rounded-pill" value={inscription} onChange={e => setInscription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dateInsc" className="form-label"> Date Inscription: </label>
                                <input type="date" name="date" id="date" className="form-control rounded-pill" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="annee" className="form-label">Année Scolaire: </label>
                                <input type="text" name="annee" id="annee" className='form-control rounded-pill' value={annee} onChange={e => setAnnee(e.target.value)} />
                            </div>
                            <div className="justify-content-center mt-5 mb-3 modal-footer">
                                <button type="button" className="btn btn-outline-danger w-25 mx-4 p-2" onClick={handleClose}>Annuler</button>
                                <button type="submit" className="btn btn-outline-primary w-25 p-2 mx-4">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouvelleInscription;
