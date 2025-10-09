import React, { useState } from "react";
import axios from "axios";

const NouvellePersonne = ({ show, handleClose }) => {
    const today = new Date().toISOString().split("T")[0];

    // ✅ Personne
    const [profileImage, setProfileImage] = useState('https://placehold.co/128x128/FFFFFF/000000?text=Photo');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [naiss, setNaiss] = useState('');
    const [sexe, setSexe] = useState('');
    const [adresse, setAdresse] = useState('');
    const [cin, setCin] = useState('');
    const [nomPere, setNomPere] = useState('');
    const [nomMere, setNomMere] = useState('');
    const [nomTut, setNomTut] = useState('');
    const [adresseParent, setAdresseParent] = useState('');
    const [adresseTut, setAdresseTut] = useState('');
    const [phoneParent, setPhoneParent] = useState('');
    const [phoneTut, setPhoneTut] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // ✅ Inscription
    const [dateinscrit, setDateinscrit] = useState('');
    const [anneesco, setAnneesco] = useState('');

    // ✅ Formation / Parcours
    const [duree, setDuree] = useState('');
    const [type_formation, setType_formation] = useState('Court Terme');
    const [nomformation, setNomformation] = useState('');
    const [datedebut, setDatebut] = useState('');
   
    const handleChoixFormation = (e) => {
        const value = e.target.value;
        if(e.target.checked) {
            setNomformation([...nomformation, value]);
        }

        else {
            setNomformation(nomformation.filter(f => f !== value));
        }
    }

    const generateAnnee = () => {
        const currentAnnee = new Date().getFullYear();
        const schoolYears = [];

        for (let annee = 2010  ; annee <= currentAnnee ; annee++)
        {
            schoolYears.push(`${annee}-${annee + 1}`);
        }
        return schoolYears;
    }

    const [schoolYears, setSchoolYears] = useState(generateAnnee());

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // ✅ Personne
            formData.append("nom", nom);
            formData.append("prenom", prenom);
            formData.append("naiss", naiss);
            formData.append("sexe", sexe);
            formData.append("adresse", adresse);
            formData.append("cin", cin);
            formData.append("nompere", nomPere);
            formData.append("nommere", nomMere);
            formData.append("nomtuteur", nomTut);
            formData.append("adressparent", adresseParent);
            formData.append("adresstuteur", adresseTut);
            formData.append("phoneparent", phoneParent);
            formData.append("phonetuteur", phoneTut);
            if (selectedFile) formData.append("photo", selectedFile);

            // ✅ Inscription
            formData.append("dateinscrit", dateinscrit);
            formData.append("anneesco", anneesco);

            // ✅ Formation / Parcours
            formData.append("duree", duree);
            formData.append("type_formation", type_formation);
            formData.append("datedebut", datedebut);

            if(nomformation.length > 0){
                formData.append('nomformation', nomformation.join(' , '));
            }
            else{
                alert("Veuiller choisir au moins une formation !!!");
                return;
            }

            const res = await axios.post("http://localhost:8000/api/inscriptionComplete", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });


            alert("Inscription complète réussie ✅");
            console.log(res.data);
            handleClose();

        } 
        catch (err) {
            console.error(err.response || err.message);
            alert("Erreur lors de l'inscription ❌");
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title text_center fw-bold">Inscription Complète  au CFP</h3>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleFormSubmit}>
                            {/* --- Image Profil --- */}
                            <div className="text-center mb-4">
                                <img src={profileImage} alt="Profil" className="rounded-circle border border-3 border-primary" style={{ width: '128px', height: '128px', objectFit: 'cover' }} />
                                <div className="mt-2">
                                    <label className="btn btn-sm btn-outline-primary fw-bold">
                                        Sélectionner une photo
                                        <input type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>

                            <div className="row">
                                <h5 className="fw-bold mt-3 text-center fw-bold">Informations Personne</h5>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Nom</label>
                                    <input type="text" className="form-control" value={nom} onChange={e => setNom(e.target.value)} required />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Prénom</label>
                                    <input type="text" className="form-control" value={prenom} onChange={e => setPrenom(e.target.value)} required />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Date Naissance</label>
                                    <input type="date" className="form-control" value={naiss} onChange={e => setNaiss(e.target.value)} max={today} required />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Sexe</label>
                                    <select className="form-select text-center" value={sexe} onChange={e => setSexe(e.target.value)} required>
                                        <option value="">-- Choisir le sexe --</option>
                                        <option value="Masulin">Masulin</option>
                                        <option value="Feminin">Feminin</option>
                                    </select>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Adresse</label>
                                    <input type="text" className="form-control" value={adresse} onChange={e => setAdresse(e.target.value)} />
                                </div>

                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">CIN</label>
                                    <input type="text" className="form-control" value={cin} onChange={e => setCin(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Nom Père</label>
                                    <input type="text" className="form-control" value={nomPere} onChange={e => setNomPere(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Nom Mère</label>
                                    <input type="text" className="form-control" value={nomMere} onChange={e => setNomMere(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Nom Tuteur</label>
                                    <input type="text" className="form-control" value={nomTut} onChange={e => setNomTut(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Adresse Parents</label>
                                    <input type="text" className="form-control" value={adresseParent} onChange={e => setAdresseParent(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Adresse Tuteur</label>
                                    <input type="text" className="form-control" value={adresseTut} onChange={e => setAdresseTut(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Phone Parent</label>
                                    <input type="text" className="form-control" value={phoneParent} onChange={e => setPhoneParent(e.target.value)} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Phone Tuteur</label>
                                    <input type="text" className="form-control" value={phoneTut} onChange={e => setPhoneTut(e.target.value)} />
                                </div>

                                <h5 className="fw-bold mt-3 fw-bold text-center">Nouvelle Inscription</h5>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Date Inscription</label>
                                    <input type="date" className="form-control" value={dateinscrit} onChange={e => setDateinscrit(e.target.value)} max={today} required />
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Année Scolaire</label>
                                    <select className="form-select text-center" value={anneesco} onChange={e => setAnneesco(e.target.value)} required>
                                        <option value="">-- Choisir Année Scolaire --</option>
                                        {schoolYears.map((annee, index) => (
                                            <option key={index} value={annee}>
                                                { annee }
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <h5 className="fw-bold mt-3 text-center fw-bold">Formation / Parcours</h5>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Durée</label>
                                    <input type="number" className="form-control" value={duree} onChange={e => setDuree(e.target.value)} required />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Type Formation</label>
                                    <select className="form-select text-center" value={type_formation} onChange={e => setType_formation(e.target.value)}>
                                        <option value="Court Terme">Court Terme</option>
                                        <option value="Long Terme">Longs Terme</option>
                                    </select>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Date de Début de formation</label>
                                    <input type="date" className="form-control" value={datedebut} onChange={e => setDatebut(e.target.value)} max={today}/>
                                </div>
                                <div className="col-lg-12 text-center mb-3">
                                    <label className="form-label fw-bold">Nouveau Formations (cocher au moins une formation) </label>
                                    <div className="row p-2">
                                        <div className="form-check col-lg-2 col-md-4 col-sm-6 col-6">
                                            <input type="checkbox" value="Informatique" className="form-check-input" onChange={handleChoixFormation} />
                                            <label htmlFor="Informatique" className="form-check-label">Informatique</label>
                                        </div>
                                         <div className="form-check col-lg-2 col-md-4 col-sm-6 col-6">
                                            <input type="checkbox" value="Musique" className="form-check-input" onChange={handleChoixFormation} />
                                            <label htmlFor="Musique" className="form-check-label">Musique</label>
                                        </div>
                                        <div className="form-check col-lg-2 col-md-4 col-sm-6 col-6">
                                            <input type="checkbox" value="Langue" className="form-check-input" onChange={handleChoixFormation} />
                                            <label htmlFor="Langue" className="form-check-label">Langues</label>
                                        </div>
                                        <div className="form-check col-lg-2 col-md-4 col-sm-6 col-6">
                                            <input type="checkbox" value="Coupe" className="form-check-input" onChange={handleChoixFormation} />
                                            <label htmlFor="Coupe" className="form-check-label">Coupe et Coutûre</label>
                                        </div>
                                          <div className="form-check col-lg-2 col-md-4 col-sm-6 col-6">
                                            <input type="checkbox" value="Pâtisserie" className="form-check-input" onChange={handleChoixFormation} />
                                            <label htmlFor="Pâtisserie" className="form-check-label">Pâtisserie</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer justify-content-center mt-4">
                                <button type="button" className="btn btn-outline-danger w-25 mx-2" onClick={handleClose}>Annuler</button>
                                <button type="submit" className="btn btn-outline-primary w-25 mx-2">S'inscrire</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NouvellePersonne;
