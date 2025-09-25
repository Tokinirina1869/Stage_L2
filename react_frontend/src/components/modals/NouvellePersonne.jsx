import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const NouvellePersonne = ({ show, handleClose, onSubmit }) => {
    const [profileImage, setProfileImage] = useState('https://placehold.co/128x128/FFFFFF/000000?text=Photo');
    const [mat, setMat] = useState(''); const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState(''); const [date, setDate] = useState('');
    const [sexe, setSexe] = useState(''); const [adresse, setAdresse] = useState('');
    const [cin, setCin] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({ mat, nom, prenom, date, sexe, adresse, cin });
        setMat(''); setNom(''); setPrenom(''); setDate(''); setSexe(''); setAdresse(''); setCin('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <h2 className="jumbotron text-center fw-bold p-4">Ajouter une nouvelle Personne</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="text-center mb-4">
                                <img src={profileImage} alt="Profil" className="rounded-circle border border-primary" style={{ width: '128px', height: '128px', objectFit: 'cover' }} />
                                <div className="mt-2">
                                    <label className="btn btn-sm btn-outline-primary cursor-pointer fw-bold">
                                        Sélectionner une photo
                                        <input type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Numéro Matricule:</label>
                                    <input type="text" className="form-control text-center" value={mat} onChange={e=>setMat(e.target.value)} placeholder="Numéro matricule...."/>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Nom:</label>
                                    <input type="text" className="form-control text-center" value={nom} onChange={e=>setNom(e.target.value)} placeholder="Nom...."/>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Prénom:</label>
                                    <input type="text" className="form-control text-center" value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Prénom...."/>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Date de naissance:</label>
                                    <input type="date" className="form-control text-center" value={date} onChange={e=>setDate(e.target.value)} />
                                </div>
                                <div className="col-lg-6 mb-3 position-relative">
                                    <label className="form-label">Sexe:</label>
                                    <select className="form-control text-center pe-5" style={{appearance:'none'}} value={sexe} onChange={e=>setSexe(e.target.value)}>
                                        <option value="homme">Homme</option>
                                        <option value="femme">Femme</option>
                                    </select>
                                    <FaChevronDown style={{ position:'absolute', right:'15px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#555'}}/>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Adresse:</label>
                                    <input type="text" className="form-control text-center" value={adresse} onChange={e=>setAdresse(e.target.value)} placeholder="Adresse actuelle...."/>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">CIN:</label>
                                    <input type="text" className="form-control text-center" value={cin} onChange={e=>setCin(e.target.value)} placeholder="Numéro CIN...."/>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center mt-5 mb-3">
                                <button type="button" className="btn btn-outline-danger w-25 mx-4 p-2" onClick={handleClose}>Annuler</button>
                                <button type="submit" className="btn btn-outline-primary w-25 mx-4 p-2">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouvellePersonne;
