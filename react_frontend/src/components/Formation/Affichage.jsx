import React, { Component } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

class Affichage extends Component {
    
    render() {
        return (
            <>
                <div className="table-responsive">
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
                                <th>Nom Formation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1869H-F</td>
                                <td>Toky</td>
                                <td>Nirina</td>
                                <td>09/05/2006</td>
                                <td>Masculin</td>
                                <td>Tanambao</td>
                                <td>201031065055</td>
                                <td>22/09/2025</td>
                                <td>2024-2025</td>
                                <td>Musique</td>
                                <td>
                                    <FaEdit color='blue' size={24} className='mx-2'/>
                                    <FaTrash color='red' size={24} className='mx-2'/>
                                </td>
                            </tr>
                            <tr>
                                <td>1869H-F</td>
                                <td>Toky</td>
                                <td>Nirina</td>
                                <td>09/05/2006</td>
                                <td>Masculin</td>
                                <td>Tanambao</td>
                                <td>201031065055</td>
                                <td>22/09/2025</td>
                                <td>2024-2025</td>
                                <td>Musique</td>
                                <td>
                                    <FaEdit color='blue' size={24} className='mx-2'/>
                                    <FaTrash color='red' size={24} className='mx-2'/>
                                </td>
                            </tr>
                            <tr>
                                <td>1869H-F</td>
                                <td>Toky</td>
                                <td>Nirina</td>
                                <td>09/05/2006</td>
                                <td>Masculin</td>
                                <td>Tanambao</td>
                                <td>201031065055</td>
                                <td>22/09/2025</td>
                                <td>2024-2025</td>
                                <td>Musique</td>
                                <td>
                                    <FaEdit color='blue' size={24} className='mx-2'/>
                                    <FaTrash color='red' size={24} className='mx-2'/>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}


export default Affichage;