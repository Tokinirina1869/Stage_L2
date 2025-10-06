import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModificationInscription from '../modals/ModificationInscription';

function AffichageFormation({refresh}) {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalModification, setModalModification] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);

  const openModal = (personne) => {
    setSelectedPersonne(personne);
    setModalModification(true);
  };
  const closeModal = () => {
    setModalModification(false);
    setSelectedPersonne(null);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/personnes")
      .then((res) => {
        setPersonnes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API: ", err);
        setLoading(false);
      });
  }, [refresh]);

  if (loading) {
    return <p className="text-center mt-3">Chargement...</p>;
  }

  const handleDelete = async (matricule) => {
      if (window.confirm( "Voulez-vous vraiement supprimer cette personne ?" ))
      {
          try{
              await axios.delete(`http://localhost:8000/api/inscriptionComplete/${matricule}`);
              setPersonnes(personnes.filter(p => p.matricule !== matricule));
              alert ("Suppression réussie ✅");
          }
          catch(err) {
            console.err(err);
            alert("Erreur lors de la suppression ❌");
          }
      }
  }
  return (
    <div className="table-responsive mt-3" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <table className="table table-striped table-hover">
        <thead className="table-primary text-center">
          <tr>
            <th>N° Matricule</th>
            <th>N° Inscription</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Naissance</th>
            <th>Sexe</th>
            <th>Adresse</th>
            <th>Photo</th>
            <th>CIN</th>
            <th>NomPère</th>
            <th>NomMère</th>
            <th>NomTuteur</th>
            <th>PhoneParent</th>
            <th>PhoneTuteur</th>
            <th>AdresseParent</th>
            <th>AdresseTuteur</th>
            <th>Date Inscription</th>
            <th>Année Scolaire</th>
            <th>Type Formation</th>
            <th>Nom Formation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personnes && personnes.length > 0 ? (
            personnes.map((liste) => (
              <tr key={liste.no_inscrit}>
                <td>{liste.matricule}</td>
                <td>{liste.no_inscrit}</td>
                <td>{liste.personne?.nom || "---"}</td>
                <td>{liste.personne?.prenom || "---"}</td>
                <td>{liste.personne?.naiss || "---"}</td>
                <td>{liste.personne?.sexe || "---"}</td>
                <td>{liste.personne?.adresse || "---"}</td>
                <td>
                  <img width={40} height={40}  src={ "http://localhost:8000/storage/" + liste.personne?.photo } alt='Photo'  className='rounded-circle'/>
                </td>
                <td>{liste.personne?.cin || "---"}</td>
                <td>{liste.personne?.nompere || "---"}</td>
                <td>{liste.personne?.nommere || "---"}</td>
                <td>{liste.personne?.nomtuteur || "---"}</td>
                <td>{liste.personne?.phoneparent || "---"}</td>
                <td>{liste.personne?.phonetuteur || "---"}</td>
                <td>{liste.personne?.adressparent || "---"}</td>
                <td>{liste.personne?.adresstuteur || "---"}</td>
                <td>{liste.dateinscrit}</td>
                <td>{liste.anneesco}</td>
                <td>{liste.inscriptionformations[0]?.type_formation || "---"}</td>
                <td>{liste.parcours[0]?.nomformation || "---"}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary mx-1" onClick={() => openModal(liste)}>
                    <FaEdit /> Modifier
                  </button>
                  <button className="btn btn-sm btn-outline-danger mx-1" onClick={() => handleDelete(liste.matricule)}>
                    <FaTrash /> Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="19" className="text-center text-danger">
                Aucune donnée trouvée !!!
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <ModificationInscription show={modalModification} handleClose={closeModal} personneData={selectedPersonne}/>
    </div>
  );
}

export default AffichageFormation;
