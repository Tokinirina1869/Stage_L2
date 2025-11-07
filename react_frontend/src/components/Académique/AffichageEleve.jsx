import React, { useState, useEffect } from "react";
import { FaBookOpen, FaEdit, FaListAlt, FaPen, FaTrash,FaSearch } from "react-icons/fa";
import { Search, Calendar } from "lucide-react";
import ModificationAcademique from "../modals/ModificationAcademique";
import NouvelleInscription from "../modals/NouvelleInscription";
import Swal from "sweetalert2";
import axios from "axios";

const categories = ["Tous", "Seconde A", "Seconde B", "Première L", "Première S", "Terminal A", "Terminal C", "Terminal D" ];
const url = 'http://localhost:8000/api';

function AffichageEleve() {
    const [modelUpdate, setModalUpdate] = useState(false);
    const [niveaux, setNiveaux] = useState([]);
    const [selectedPersonne, setSelectedPersonne] = useState(null);
    const [showInscription, setShowInscription] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchPersonne, setSearchPersonne] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchMat, setSearchMat] = useState("");
    const ITEMS_PER_PAGE = 10;

    const openIncription = (pers = null) => { setSearchPersonne(pers); setShowInscription(true); };
    const closeIncription = () => { setShowInscription(false); setSearchPersonne(null); };

    const openModalUpdate = (p) => {
        setSelectedPersonne(p);
        setModalUpdate(true);
    }
    const closeModalUpdate = () => {
        setModalUpdate(false);
        setSelectedPersonne(null);
    }
    const [activeCategory, setActiveCategory] = useState('Tous');


    const fetchNiveaux = async () => {
        try{
            const response = await axios.get(`${url}/academique`);
            setNiveaux(response.data.data);
        }
        catch(err){
            console.error("Erreur lors de l'affichage: ", err);
        }
    }
    useEffect(() => {
        fetchNiveaux();
    }, []);

    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");

    const handleSearchByDate = async () => {
        if (!dateDebut || !dateFin) {
            Swal.fire({
            icon: 'warning',
            title: 'Attention',
            text: 'Veuillez sélectionner les deux dates pour filtrer.',
            });
            return;
        }

        try {
            const response = await axios.get(`${url}/filterDate`, {
            params: { date_debut: dateDebut, date_fin: dateFin },
            });
            setNiveaux(response.data.data);
            setCurrentPage(1);
            setDateDebut("");
            setDateFin("");
        } catch (error) {
            console.error("Erreur de recherche:", error);
            Swal.fire('Erreur', 'Impossible de filtrer les données.', 'error');
        }
    };

    const handleDelete = (inscrit) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
            axios.delete(`${url}/deleteacademique/${inscrit.no_inscrit}`)
                .then(() => {
                Swal.fire('Supprimé !', 'L\'élève a été supprimé.', 'success');
                // Mettre à jour la liste localement
                setNiveaux(prev => prev.filter(n => n.no_inscrit !== inscrit.no_inscrit));
                })
                .catch(err => {
                console.error(err);
                Swal.fire('Erreur !', 'Impossible de supprimer cet élève.', 'error');
                });
            }
        });
    };

    const handleSearchClass = async (classe) => {
        setActiveCategory(classe);

        try{
            const res = await axios.get(`${url}/searchClasse/${classe}`);
            setNiveaux(res.data.data);
        }
        catch (err) {
            console.error("Erreur lors du filtrage par classe:", err);
            Swal.fire('Erreur', 'Impossible de filtrer par classe.', 'error');
        }
    }

    const handleSearchMat = async () => {
        if(!searchMat.trim()){
          Swal.fire('Attention', 'Veuillez entrer un matricule pour la recherche.', 'warning');
          return;
        }
    
        const urlMat = `${url}/personne/matricule/${searchMat.trim()}`;
        setLoading(true);
    
        try{
          const res = await axios.get(urlMat);
          const personneData = res.data;
    
          if(personneData && Object.keys(personneData).length > 0) {
            openIncription(personneData);
    
            Swal.fire({
              icon: 'success',
              text: `Matricule trouvé : ${personneData.personne?.nom} ${personneData.personne?.prenom}. Les données sont prêtes.`,
              background: '#1e1e2f',
              color: 'white',
              timer: 3000,
              position: "center",
              showConfirmButton: false,
            });
          }
          else {
            Swal.fire('Introuvable', `Aucune personne trouvée avec le matricule ${searchMat}.`, 'error');
          }
    
        } 
        catch (error) {
          console.error("Erreur de recherche par matricule:", error);
          Swal.fire('Erreur', 'Impossible de récupérer les données pour ce matricule.', 'error');
        } 
        finally {
          setLoading(false);
          setSearchMat(""); // Réinitialiser le champ
        }
      }

    const totalPages = Math.ceil(niveaux.length / ITEMS_PER_PAGE);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="flex items-center mb-6 border-b pb-4 border-indigo-100">
            <FaListAlt className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl text-default text-center font-bold "> {} Personnes inscrits</h2>
            </div>
            <div className="flex flex-wrap mb-6 border-b pb-4 gap-2">
                {categories.map(key => (
                    <button key={key} onClick={() => handleSearchClass(key)}
                        className={`px-3 py-2 rounded-lg font-medium text-medium fw-bold 
                        ${activeCategory === key ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {key}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-5 rounded-xl shadow-md mb-6 ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100 justify-between">
                <div className="flex items-stretch gap-2">
                    <FaPen className="w-6 h-6 mr-3" />
                    <h3 className="text-lg text-center font-semibold text-gray-700">Technique de recherche les élèves!</h3>
                </div>
                <div className="flex items-stretch gap-2">
                    <input type="text" placeholder="Rechercher par Matricule (Autofill)" value={searchMat} 
                    onChange={(e) => setSearchMat(e.target.value)}
                    className="flex-grow pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    <button onClick={handleSearchMat} className={`px-4 py-2 text-white rounded-lg shadow ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                        <FaSearch className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input type="text"  placeholder="Rechercher par nom, matricule, CIN..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <label className="text-sm font-medium text-gray-700 hidden sm:block">Du :</label>
                    <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 hidden sm:block">Au :</label>
                    <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <div className="flex items-center">
                    <button onClick={handleSearchByDate} className="px-4 py-2 mx-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                        Chercher
                    </button>
                    <button onClick={fetchNiveaux} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
                        Actualiser
                    </button>
                </div>
                </div>

            </div>
        </div>

        {/* TABLEAU DESKTOP */}
        <div className="hidden md:block bg-default rounded-xl shadow-lg ring-1 ring-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-indigo-600 text-white sticky top-0">
                <tr>
                    <th className="px-4 py-2 text-center font-semibold w-24">N° Matricule</th>
                    <th className="px-4 py-2 text-center font-semibold w-24">N° Inscription</th>
                    <th className="px-4 py-2 text-center font-semibold w-75">Noms & Prénoms</th>
                    <th className="px-4 py-2 text-center font-semibold w-40">Date de Naissance</th>
                    <th className="px-4 py-2 text-center font-semibold w-20">Sexe</th>
                    <th className="px-4 py-2 text-center font-semibold w-60">Adresse Actuelle</th>
                    <th className="px-4 py-2 text-center font-semibold w-20">Photo d'Identité</th>
                    <th className="px-4 py-2 text-center font-semibold w-24">CIN</th>
                    <th className="px-4 py-2 text-center font-semibold w-75">Nom du Père</th>
                    <th className="px-4 py-2 text-center font-semibold w-75">Nom du Mère</th>
                    <th className="px-4 py-2 text-center font-semibold w-75">Phone Parent</th>
                    <th className="px-4 py-2 text-center font-semibold w-75">Nom du Tuteur</th>
                    <th className="px-4 py-2 text-center font-semibold w-28">Phone Tuteur</th>
                    <th className="px-4 py-2 text-center font-semibold w-75">Adresse Parent</th>
                    <th className="px-4 py-2 text-center font-semibold w-60">Adresse Tuteur</th>
                    <th className="px-4 py-2 text-center font-semibold w-40">Date Inscription</th>
                    <th className="px-4 py-2 text-center font-semibold w-28">Année Scolaire</th>
                    <th className="px-4 py-2 text-center font-semibold w-40">Type d'inscription</th>
                    <th className="px-4 py-2 text-center font-semibold w-40">Nom de Classe</th>
                    <th className="px-4 py-2 text-center font-semibold w-40">Actions</th>
                </tr>
                </thead>
                <tbody>
                    {niveaux.length > 0 ? (
                        niveaux.map((liste, idx) => (
                            <tr key={idx} className="hover:bg-indigo-50 transition duration-100">
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.matricule}</td>
                            <td className="px-2 py-2 text-center">{liste.no_inscrit}</td>
                            <td className="px-2 py-2 text-center font-medium"><b>{liste.inscription?.personne?.nom}</b> {liste.inscription?.personne?.prenom}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.naiss} à {liste.inscription?.personne?.lieunaiss}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.sexe}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.adresse}</td>
                            <td className="px-2 py-2 text-center">
                                {liste.inscription?.personne?.photo ? (
                                <img
                                    src={`http://localhost:8000/storage/${liste.inscription?.personne?.photo}`}
                                    alt="photo"
                                    className="w-10 h-10 rounded-full mx-auto cursor-pointer border-2 border-indigo-500 object-cover"
                                    onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.inscription?.personne?.photo}`)}
                                />
                                ) : <span className="text-gray-400 text-sm">Aucune</span>}
                            </td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.cin}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.nompere}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.nommere}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.phoneparent}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.nomtuteur}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.phonetuteur}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.adressparent}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.personne?.adresstuteur}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.dateinscrit}</td>
                            <td className="px-2 py-2 text-center">{liste.inscription?.anneesco}</td>
                            <td className="px-2 py-2 text-center">{liste.type_inscrit}</td>
                            <td className="px-2 py-2 text-center">{liste.niveau?.nomniveau || "---"}</td>
                            <td className="px-2 py-2 text-center flex justify-center gap-1">
                                <button className="flex items-center text-white bg-indigo-600 text-white p-1 rounded" onClick={() => openModalUpdate(liste)}><FaEdit  className="mx-1 w-4 h-4"/> Modifier</button>
                                <button className="flex items-center text-white bg-red-600 text-white p-1 rounded" onClick={() => handleDelete(liste)} ><FaTrash className="mx-1 w-4 h-4"/> Supprimer</button>
                            </td>
                            </tr>
                        ))
                    ) : (
                    <tr>
                        <td colSpan={20} className="px-4 py-8 text-center text-gray-500">
                            <FaBookOpen className="mx-auto mb-2" size={24} />
                            <p>Aucune donnée trouvée</p>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="md:hidden flex flex-col gap-4">
            {niveaux.length > 0 ? niveaux.map((liste, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {liste.inscription?.personne?.photo && (
                    <img
                        src={`http://localhost:8000/storage/${liste.inscription?.personne?.photo}`}
                        alt="photo"
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                        onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.inscription?.personne?.photo}`)}
                    />
                    )}
                    <div>
                    <p className="font-bold">{liste.inscription?.personne?.nom} {liste.inscription?.personne?.prenom}</p>
                    <p className="text-sm text-gray-500">{liste.parcours?.[0]?.nomformation || "---"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-indigo-600 text-white p-2 rounded" onClick={() => openModalUpdate(liste)}><FaEdit /></button>
                    <button className="bg-red-600 text-white p-2 rounded"><FaTrash /></button>
                </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>Matricule: {liste.matricule}</div>
                <div>Inscription: {liste.no_inscrit}</div>
                <div>Date Inscription: {liste.dateinscrit}</div>
                <div>Année: {liste.anneesco}</div>
                <div>Sexe: {liste.inscription?.personne?.sexe}</div>
                <div>Adresse: {liste.inscription?.personne?.adresse}</div>
                <div>CIN: {liste.inscription?.personne?.cin}</div>
                <div>Durée: {liste.inscriptionformation?.duree || 0}</div>
                </div>
            </div>
            )) : (
            <div className="text-center text-gray-500 py-8">
                <FaBookOpen className="mx-auto mb-2" size={24} />
                <p>Aucune donnée trouvée</p>
            </div>
            )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t mt-4">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-800 text-white fw-bold border rounded-lg text-gray-700 hover:bg-blue-100 disabled:opacity-50">
                Précédent
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} sur {totalPages}</span>
            <button  onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-800 text-white fw-bold border rounded-lg text-gray-700 hover:bg-blue-100 disabled:opacity-50">
                Suivant
            </button>
            </div>
        )}

        {/* MODALE IMAGE */}
        {selectedImage && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}>
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
                <img src={selectedImage} alt="Zoom" className="rounded-lg w-full h-auto" />
                <p className="text-center text-gray-600 mt-2">Cliquez en dehors pour fermer</p>
            </div>
            </div>
        )}
        
        <ModificationAcademique show={modelUpdate} handleClose={closeModalUpdate} selectedPersonne={selectedPersonne}/>
        <NouvelleInscription show={showInscription} handleClose={closeIncription} searchEleve={searchPersonne} />
        </div>
    );
}

export default AffichageEleve;
