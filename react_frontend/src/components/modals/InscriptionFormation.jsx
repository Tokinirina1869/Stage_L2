import React, { useState, useEffect } from "react";
import axios from "axios";

const InscriptionFormation = ({ show, handleClose, onSubmit, currentEleve }) => {
    const [no_inscrit, setNo_inscrit] = useState('');
    const [duree, setDuree] = useState('');
    const [type_formation, setType_formation] = useState('Court Terme');
    const [parcoursList, setParcoursList] = useState([]);
    const [id_parcours, setId_parcours] = useState('');

    // ⚡ Mettre à jour no_inscrit si currentEleve change
    useEffect(() => {
        if (currentEleve?.no_inscrit) {
            setNo_inscrit(currentEleve.no_inscrit);
        }
    }, [currentEleve]);

    // Charger la liste des parcours
    useEffect(() => {
        axios.get("http://localhost:8000/api/parcours")
            .then((res) => {
                setParcoursList(res.data);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des parcours:", err);
            });
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!no_inscrit) {
            alert("Erreur : aucun no_inscrit trouvé !");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("no_inscrit", no_inscrit);
            formData.append("duree", duree);
            formData.append("type_formation", type_formation);
            formData.append("id_parcours", id_parcours); // ✅ ajout du parcours

            await axios.post("http://localhost:8000/api/formation", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Insertion réussie ✅");
            onSubmit({ no_inscrit, duree, type_formation, id_parcours });
        } catch {
            alert("Erreur lors de l'ajout");
        }
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
                                <label className="form-label">N° Inscription:</label>
                                <input type="number" className="form-control rounded-pill"
                                    value={no_inscrit} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Durée Formation:</label>
                                <input type="number" className="form-control rounded-pill"
                                    value={duree} onChange={(e) => setDuree(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type Formation:</label>
                                <select className="form-select text-center"
                                    value={type_formation} onChange={(e) => setType_formation(e.target.value)}>
                                    <option value="Court Terme">Court Terme</option>
                                    <option value="Long Terme">Long Terme</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Choisir Parcours:</label>
                                <select className="form-select text-center"
                                    value={id_parcours} onChange={(e) => setId_parcours(e.target.value)}>
                                    <option value="">-- Sélectionner une formation --</option>
                                    {parcoursList.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nom_formation}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer justify-content-center mt-5 mb-3">
                                <button type="button" className="btn btn-outline-danger w-25 mx-4 p-2" onClick={handleClose}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-outline-primary w-25 mx-4 p-2">
                                    S'inscrire
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
