import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';

class AffichageEleve extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                <div className='table-responsive'>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>N° Matricule</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Date de Naissance</th>
                                <th>Sexe</th>
                                <th>Adresse</th>
                                <th>N° CIN</th>
                                <th>Date d'Inscription</th>
                                <th>Année Scolaire</th>
                                <th>Niveau</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>18</td>
                                <td>Tokinirina</td>
                                <td>Jean Robert</td>
                                <td>09/05/2006</td>
                                <td>Masculin</td>
                                <td>Tanambao Zoara</td>
                                <td>201031065055</td>
                                <td>09/05/2006</td>
                                <td>2024-2025</td>
                                <td>L2</td>
                                <td>
                                    <FaEdit size={24} style={{color: "blue"}} />
                                    <FaTrash size={24} style={{color: "red"}} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}


export default AffichageEleve;