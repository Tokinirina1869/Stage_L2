import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NouvelleInscription = ({ show, handleClose, onSubmit, currentEleve }) => {
    const [matricule, setMatricule] = useState('');
    const [dateinscrit, setDateinscrit] = useState('');
    const [anneesco, setAnneesco] = useState('');
    const dateToday = new Date().toISOString().split("T")[0];

    // ⚡ Mettre à jour matricule si currentEleve change
    useEffect(() => {
        if (currentEleve?.matricule) {
            setMatricule(currentEleve.matricule);
        }
    }, [currentEleve]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("matricule", matricule);
            formData.append("dateinscrit", dateinscrit);
            formData.append("anneesco", anneesco);

            const res = await axios.post("http://localhost:8000/api/inscription", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Insertion réussie ✅");
            onSubmit(res.data);

        } catch (error) {
            alert("Erreur lors de l'ajout ❌");
            console.error(error);
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" 
             style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <h2 className="jumbotron text-center fw-bold p-4">Nouvelle Inscription</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label className="form-label">N° Matricule:</label>
                                <input type="text" className="form-control" value={matricule} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date Inscription:</label>
                                <input type="date" className="form-control" value={dateinscrit} onChange={e => setDateinscrit(e.target.value)} max={dateToday} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Année Scolaire:</label>
                                <select name="anneesco" className="form-select form-control text-center" value={anneesco} onChange={(e) => setAnneesco(e.target.value)}>
                                    <option >---- Année Scolaire ----</option>
                                    <option value="2017-2018">2017-2018</option>
                                    <option value="2018-2019">2018-2019</option>
                                    <option value="2019-2020">2019-2020</option>
                                    <option value="2020-2021">2020-2021</option>
                                    <option value="2022-2023">2022-2023</option>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                    <option value="2028-2029">2028-2029</option>
                                    <option value="2029-2030">2029-2030</option>
                                </select>
                            </div>
                            <div className="modal-footer justify-content-center mt-5 mb-3">
                                <button type="button" className="btn btn-outline-danger w-25 mx-4" onClick={handleClose}>Annuler</button>
                                <button type="submit" className="btn btn-outline-primary w-25 mx-4">Suivant</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouvelleInscription;
