import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Test() {
    const [personnes, setPersonnes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/api/liste")
        .then((res) => {
            setPersonnes(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Erreur API: ", err);
            console.log(err);
            setLoading(false);
        }) 

    }, []);

    if(loading) {
        <p className="text-center">Chargement...</p>
    }
    return (
        <>
            <div className="table-responsive" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                <table className="table table-striped table-hover">
                    <thead className="table-primary text-center">
                    <tr>
                        <th>N° Inscription</th> 
                        <th>N° Matricule</th> 
                        <th>Date Inscription</th> 
                        <th>Année Scolaire</th> 
                        <th>Nom</th> 
                        <th>Prénom</th> 
                        <th>Naissance</th> 
                        <th>Sexe</th> 
                        <th>Adresse</th> 
                        <th>CIN</th> 
                        <th>NomPere</th> 
                        <th>NomMère</th> 
                        <th>NomTuteur</th> 
                        <th>PhoneParent</th> 
                        <th>PhoneTuteur</th> 
                        <th>AdresseParent</th> 
                        <th>AdresseTuteur</th> 
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    { personnes && personnes.length > 0 ? (
                        personnes.map((liste) => (
                        <tr key={liste.no_inscrit}>
                            <td>{liste.no_inscrit}</td> 
                            <td>{liste.matricule}</td> 
                            <td>{liste.dateinscrit}</td> 
                            <td>{liste.anneesco}</td> 
                            <td>{liste.personne?.nom}</td> 
                            <td>{liste.personne?.prenom}</td> 
                            <td>{liste.personne?.naiss}</td> 
                            <td>{liste.personne?.sexe}</td>
                            <td>{liste.personne?.adresse}</td> 
                            <td>{liste.personne?.cin}</td> 
                            <td>{liste.personne?.nompere}</td> 
                            <td>{liste.personne?.nommere}</td> 
                            <td>{liste.personne?.nomtuteur}</td> 
                            <td>{liste.personne?.phoneparent}</td> 
                            <td>{liste.personne?.phonetuteur}</td> 
                            <td>{liste.personne?.adressparent}</td> 
                            <td>{liste.personne?.adresstuteur}</td> 
                            <td>
                                <button className="btn btn-sm btn-outline-primary mx-1">
                                    <FaEdit /> Modifier
                                </button>
                                <button className="btn btn-sm btn-outline-danger mx-1">
                                    <FaTrash /> Supprimer
                                </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="18" className="text-center text-danger">
                            Aucune données trouvée !!!
                        </td>
                        </tr>
                    ) }
                    </tbody>
                </table>
            </div>

        </>
    );
}

export default Test;