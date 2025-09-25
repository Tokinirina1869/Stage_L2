import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const InscriptionFormation = ({ show, handleClose, onSubmit }) => {
    const [numInsc, setNumInsc] = useState('');
    const [duree, setDuree] = useState('');
    const [type, setType] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({ numInsc, duree, type });
        setNumInsc('');
        setDuree('');
        setType('');
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog"
             style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <h2 className="jumbotron text-center fw-bold p-4">Nouvelle Inscription</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label htmlFor="inscription" className="form-label">N° Inscription:</label>
                                <input type="text" id="inscription" className="form-control rounded-pill"
                                       value={numInsc} onChange={(e) => setNumInsc(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="duree" className="form-label">Durée Formation:</label>
                                <input type="number" id="duree" className="form-control rounded-pill"
                                       value={duree} onChange={(e) => setDuree(e.target.value)} />
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="type" className="form-label">Type Formation:</label>
                                <select id="type" className="form-control text-center pe-5"
                                        style={{ appearance: 'none' }}
                                        value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="court">Court Terme</option>
                                    <option value="long">Long Terme</option>
                                </select>
                                <FaChevronDown style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                    color: '#555'
                                }}/>
                            </div>
                            <div className="modal-footer justify-content-center mt-5 mb-3">
                                <button type="button" className="btn btn-outline-danger w-25 mx-4 p-2"
                                        onClick={handleClose}>Annuler
                                </button>
                                <button type="submit" className="btn btn-outline-primary w-25 mx-4 p-2">Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InscriptionFormation;
