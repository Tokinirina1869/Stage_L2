import React, { useState } from 'react';
import { FaEdit, FaFilePdf, FaMoneyCheckAlt, FaTimes, FaTrash } from 'react-icons/fa';

const ecolage = [
  { id: 1, mois: "Janvier" }, { id: 2, mois: "Février" },
  { id: 3, mois: "Mars" }, { id: 4, mois: "Avril" },
  { id: 5, mois: "Mai" }, { id: 6, mois: "Juin" },
  { id: 7, mois: "Juillet" }, { id: 8, mois: "Août" },
  { id: 9, mois: "Septembre" }, { id: 10, mois: "Octobre" },
  { id: 11, mois: "Novembre" }, { id: 12, mois: "Décembre" }
];

const droitPaie = [
  { id: 1, droit: "Droit d'inscription" },
  { id: 2, droit: "Frais Scolaire" },
  { id: 3, droit: "VRM" },
  { id: 4, droit: "Cantine" },
  { id: 5, droit: "Blouse" },
  { id: 6, droit: "Tenue de Fête" },
  { id: 7, droit: "Tenue de Sport" },
];

function PaymentPage() {
  const [selectedMois, setSelectedMois] = useState([]);
  const [selectedDroits, setSelectedDroits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);

  // Récupérer les valeurs sélectionnées
  const handleMoisChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedMois(values);
  };

  const handleDroitsChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedDroits(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mois choisis :", selectedMois);
    console.log("Droits choisis :", selectedDroits);
    alert(`Mois: ${selectedMois.join(", ")} \nDroits: ${selectedDroits.join(", ")}`);
  };

  return (
    <div className="container-fluid py-5 mt-5">
      <div className="card shadow p-5">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <h2 className="p-3 fw-bold text-success text-center mb-3">
                Liste de Paiement de droit d'inscription
            </h2>
            <button className="btn btn-outline-primary responsive-text" onClick={() => setShowForm( !showForm )}>
                { 
                    showForm ? <><FaTimes size={25} className='mx-1' /> Fermer</> :<><FaMoneyCheckAlt size={25} className="mx-1" /> Nouveau Paiement</> 
                }
            </button>
        </div>

        {showForm && (
            <form onSubmit={handleSubmit}>
                <div className="row g-3 align-items-end">
                    <div className="col-md-4 mb-4">
                    <label htmlFor="matricule" className="form-label">N° Matricule</label>
                    <input type="text" name="matricule" id="matricule"
                        className="form-control rounded-pill" placeholder="Matricule..." />
                    </div>

                    <div className="col-md-4 mb-4">
                    <label htmlFor="ecolage" className="form-label">N° Frais Scolaire</label>
                    <input type="text" name="ecolage" id="ecolage"
                        className="form-control rounded-pill" placeholder="Inscription..." />
                    </div>

                    <div className="col-md-4 mb-4">
                    <label htmlFor="datePaiement" className="form-label">Date de paiement</label>
                    <input type="date" name="datePaiement" id="datePaiement"
                        className="form-control rounded-pill" />
                    </div>

                    <div className="col-md-6 mb-4">
                    <label className="form-label text-center">Sélectionner quel mois doit à payer---</label>
                    <select multiple name="mois" id="mois"
                        className="form-select text-center" onChange={handleMoisChange}>
                        {ecolage.map((item) => (
                        <option key={item.id} value={item.mois}>{item.mois}</option>
                        ))}
                    </select>
                    </div>

                    <div className="col-md-6 mb-4">
                    <label className="form-label">Sélectionner quel mont doit à payer:</label>
                    <select multiple name="droit" id="droit"
                        className="form-select text-center" onChange={handleDroitsChange}>
                        {droitPaie.map((item) => (
                        <option key={item.id} value={item.droit}>{item.droit}</option>
                        ))}
                    </select>
                    </div>

                    <div className="d-flex justify-content-center pb-3 mb-4">
                        <button type="submit" className="mx-2 col-lg-2 btn btn-outline-primary rounded-pill mt-2">
                            Payer
                        </button> 
                        <button type="button" className="mx-2 col-lg-2 btn btn-outline-secondary rounded-pill mt-2" onClick={() => setShowForm(false)}>
                            Annuler
                        </button>
                    </div>
                </div>
            </form>
        )}
        {showForm1 && (
            <form onSubmit={handleSubmit}>
                <div className="row g-3 align-items-end container">
                    <div className="col-md-4 mb-4">
                    <label htmlFor="matricule" className="form-label">N° Matricule</label>
                    <input type="text" name="matricule" id="matricule"
                        className="form-control rounded-pill" placeholder="Matricule..." />
                    </div>

                    <div className="col-md-4 mb-4">
                    <label htmlFor="ecolage" className="form-label">N° Frais Scolaire</label>
                    <input type="text" name="ecolage" id="ecolage"
                        className="form-control rounded-pill" placeholder="Inscription..." />
                    </div>

                    <div className="col-md-4 mb-4">
                    <label htmlFor="datePaiement" className="form-label">Date de paiement</label>
                    <input type="date" name="datePaiement" id="datePaiement"
                        className="form-control rounded-pill" />
                    </div>

                    <div className="col-md-6 mb-4">
                    <label className="form-label text-center">Sélectionner quel mois doit à payer---</label>
                    <select multiple name="mois" id="mois"
                        className="form-select text-center" onChange={handleMoisChange}>
                        {ecolage.map((item) => (
                        <option key={item.id} value={item.mois}>{item.mois}</option>
                        ))}
                    </select>
                    </div>

                    <div className="col-md-6 mb-4">
                    <label className="form-label">Sélectionner quel mont doit à payer:</label>
                    <select multiple name="droit" id="droit"
                        className="form-select text-center" onChange={handleDroitsChange}>
                        {droitPaie.map((item) => (
                        <option key={item.id} value={item.droit}>{item.droit}</option>
                        ))}
                    </select>
                    </div>

                    <div className="d-flex justify-content-center pb-3 mb-4">
                        <button type="submit" className="mx-2 col-lg-2 btn btn-outline-primary rounded-pill mt-2">
                            Modifier
                        </button> 
                        <button type="button" className="mx-2 col-lg-2 btn btn-outline-secondary rounded-pill mt-2" onClick={() => setShowForm1(false)}>
                            Annuler
                        </button>
                    </div>
                </div>
            </form>
        )}

{/* 
        <hr />
        <h5>Mois sélectionnés : {selectedMois.join(", ") || "Aucun"}</h5>
        <h5>Droits sélectionnés : {selectedDroits.join(", ") || "Aucun"}</h5> */}

        {/* Tableau exemple */}
        <section className="table-responsive mt-5">
          <table className="table table-striped table-hover align-middle text-center">
            <thead>
              <tr>
                <th>N° Paiement</th>
                <th>N° Inscription</th>
                <th>Nom et Prénom</th>
                <th>Date de Paiement</th>
                <th>Montant</th>
                <th>Reste</th>
                <th>Ecolage et frais Payé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PE0002</td>
                <td>1869H-F</td>
                <td>Tokinirina Jean Robert</td>
                <td>26/09/2025</td>
                <td>74 000ar</td>
                <td>0ar</td>
                <td>Septembre, Octobre</td>
                <td>
                  <button type="button" className="btn btn-sm btn-outline-primary mx-2" onClick={() => setShowForm1(!showForm)}>
                    <FaEdit size={18} /> Modifer
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-danger mx-2">
                    <FaTrash size={18} /> Supprimer
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-success mx-2">
                    <FaFilePdf size={18} /> Exporter PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default PaymentPage;
