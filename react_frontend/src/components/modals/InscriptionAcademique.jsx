import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const InscriptionAcademique = ({ show, handleClose, onSubmit }) => {

    const [numInsc, setNumInsc] = useState('');
    const [Code, setCode] = useState('');
    const [type, setType] = useState('');
    const handleFormSubmit = (e) => {
        e.preventDefault();

        onSubmit({ numInsc, Code, type }); 
        setNumInsc('');
        setCode('');
        setType('');
    };


    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <h2 className="jumbotron text-center fw-bold p-4">Nouvelle Inscription Académique</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="inscription" className="form-label">N° Inscription: </label>
                                <input type="text" name="inscription" id="inscription" className="form-control rounded-pill" value={numInsc} onChange={(e) => setNumInsc(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="codeInsc" className="form-label"> Code Niveau: </label>
                                <input type="number" name="code" id="code" className="form-control rounded-pill" value={Code} onChange={(e) => setCode(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="annee" className="form-label">Type Inscription: </label>
                                <div className="position-relative">
                                    <select name="type" className="form-control text-center pe-5" style={{ appearance: 'none' }} value={type} onChange={(e) => setType(e.target.value)} >
                                        <option value="inscription">Inscription</option>
                                        <option value="reinscription">Réinscription</option>
                                    </select>
                                    <FaChevronDown style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#555', }} />
                                </div>
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

export default InscriptionAcademique;