import React, { useState, useEffect, useMemo, useContext } from "react";
import { FaBookOpen, FaEdit, FaListAlt, FaPen, FaSearch, FaTrash } from "react-icons/fa";
import { Search, Calendar } from "lucide-react";
import ModificationInscription from "../modals/ModificationInscription";
import NouvellePersonne from "../modals/NouvellePersonne";
import Swal from "sweetalert2";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

const categories = ["Tous", "Informatique", "Langues", "Musique", "Coupe et Coutûre", "Pâtisserie"];
const url = "http://localhost:8000/api";

function AffichageFormation({ formations }) {
  // AJOUTER un état pour la liste complète originale
  const [originalPersonnes, setOriginalPersonnes] = useState(formations || []);
  
  const { theme } = useContext(ThemeContext);

  // Utiliser allPersonnes comme la liste de base actuelle (initialisée ou filtrée par API)
  const [allPersonnes, setAllPersonnes] = useState(formations || []); 
  const [modalModification, setModalModification] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPersonne, setShowPersonne] = useState(false);

  const openNewPersonne = (p) => { setSelectedPersonne(p); setShowPersonne(true) };
  const closeNewPersonne = () => {setSelectedPersonne(null); setShowPersonne(false) };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchMat, setSearchMat] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const openModal = (p) => { setSelectedPersonne(p); setModalModification(true); };
  const closeModal = () => { setModalModification(false); setSelectedPersonne(null); };

  // Mise à jour des listes lorsque 'formations' change (à l'initialisation ou après un refresh parent)
  useEffect(() => { 
    setOriginalPersonnes(formations || []);
    setAllPersonnes(formations || []);
  }, [formations]);
  
  const handleDelete = async (matricule) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette personne ?")) {
      try {
        await axios.delete(`${url}/inscriptionComplete/${matricule}`);
        // Mettre à jour les deux listes pour maintenir la cohérence
        setOriginalPersonnes(prev => prev.filter(p => p.matricule !== matricule));
        setAllPersonnes(prev => prev.filter(p => p.matricule !== matricule));
        
        Swal.fire({
          icon: 'success',
          text: `La personne a été supprimée avec succès!`,
          background: '#1e1e2f',
          color: 'white',
          showConfirmButton: false,
          position: "bottom",
          timer: 2000,
          backgroundPosition: "center",
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Erreur', 'Erreur lors de la suppression ❌', 'error');
      }
    }
  };

  const handleSearchClass = (classe) => {
    setActiveCategory(classe);
    setCurrentPage(1); 
  };
  
  const resetFilters = () => {
    setAllPersonnes(originalPersonnes || []); // Retour à l'état initial
    setSearchQuery("");
    setActiveCategory("Tous");
    setDateDebut("");
    setDateFin("");
    setCurrentPage(1);
    Swal.fire({icon:'info', title:'Réinitialisé', text: 'Filtres effacés', timer:1500, showConfirmButton:false});
  };


  const handleSearchByDate = async () => {
    if (!dateDebut || !dateFin) {
        Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez sélectionner les deux dates pour filtrer.',
        });
        return;
    }
    setLoading(true);
    setCurrentPage(1);
    setActiveCategory("Tous");
    setSearchQuery(""); // Effacer les filtres locaux

    try {
        const response = await axios.get(`${url}/filterDatePro`, {
        params: { date_debut: dateDebut, date_fin: dateFin },
        });
        
        // Mettre à jour allPersonnes avec la liste filtrée par date
        setAllPersonnes(response.data.data || []); 

        Swal.fire('Succès', `Filtrage effectué : ${response.data.data?.length || 0} résultats.`, 'success');
        setDateDebut("");
        setDateFin("");

    } catch (error) {
        console.error("Erreur de recherche:", error);
        Swal.fire('Erreur', 'Impossible de filtrer les données. Assurez-vous que l\'API est fonctionnelle.', 'error');
    } finally {
        setLoading(false);
    }
  };

  const filterPersonnes = (personnesList, query, category) => {
    return personnesList.filter(p => {
      const q = query.toLowerCase().trim();
      
      // 1. FILTRAGE TEXTUEL
      if (q) {
       // Dans la fonction filterPersonnes
        const matchText = (String(p.matricule || '').toLowerCase().includes(q)) ||
                  (String(p.personne?.nom || '').toLowerCase().includes(q)) ||
                  (String(p.personne?.prenom || '').toLowerCase().includes(q)) ||
                  (String(p.personne?.cin || '').toLowerCase().includes(q)) ||
                  (String(p.no_inscrit || '').toLowerCase().includes(q));
        if (!matchText) return false;
      }

      // 2. FILTRAGE PAR CATÉGORIE (Corrigé pour la gestion multi-parcours)
      if (category && category !== "Tous") {
        // Vérifie si la personne a AU MOINS UN parcours qui correspond à la catégorie
        const hasMatchingParcours = p.parcours?.some(parc => parc.nomformation === category);
        
        if (!hasMatchingParcours) return false;
      }

      return true;
    });
  };


  const filteredPersonnes = useMemo(() => {
    // Le filtrage local est appliqué sur la liste actuelle (soit complète, soit filtrée par date)
    return filterPersonnes(allPersonnes, searchQuery, activeCategory);
  }, [allPersonnes, searchQuery, activeCategory]); 

  // Pagination
  const totalPages = Math.ceil(filteredPersonnes.length / ITEMS_PER_PAGE);
  const currentData = filteredPersonnes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
        openNewPersonne(personneData);

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

  return (
    <div className={`p-4 sm:p-6 min-h-screen ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'}`}>

      {/* --- Catégories --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center mb-6 border-b pb-4 border-indigo-100">
          <FaListAlt className="w-6 h-6 text-indigo-600 mr-3" />
          <h2 className="text-2xl text-center font-bold ">{filteredPersonnes.length} Personnes inscrits</h2>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Recherche Textuelle */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input type="text"  placeholder="Rechercher par nom, matricule, CIN..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* 2. Recherche par Date (API) */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700 hidden sm:block">Du :</label>
              <input type="date" value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 hidden sm:block">Au :</label>
              <input type="date" value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button onClick={handleSearchByDate} disabled={loading} className={`px-4 py-2 text-white rounded-lg shadow ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {loading ? 'Chargement...' : 'Chercher'}
            </button>
            
            <button onClick={resetFilters} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
                Réinitialiser
            </button>

          </div>
        </div>
      </div>

      {/* --- Section de Recherche --- */}
      <div className="p-5 rounded-xl shadow-md mb-6 ring-1 ring-gray-200">
        <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
          <FaPen className="w-6 h-6 mr-3" />
          <h3 className="text-lg text-center font-semibold text-gray-700">Technique de recherche et filtrage par formation !</h3>
        </div>
       

        <div className="flex flex-wrap mb-6 border-b pb-4 gap-2">
          {categories.map(key => (
              <button key={key} onClick={() => handleSearchClass(key)} className={`px-4 py-2 mx-3 rounded-lg font-medium text-large fw-bold 
                ${activeCategory === key ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {key}
              </button>
          ))}

          <div className="flex items-stretch gap-2">
              <input type="text" placeholder="Rechercher par Matricule (Autofill)" value={searchMat} 
                onChange={(e) => setSearchMat(e.target.value)}
                className="flex-grow pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
              <button onClick={handleSearchMat} disabled={loading} className={`px-4 py-2 text-white rounded-lg shadow ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                  <FaSearch className="w-5 h-5" />
              </button>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block rounded-xl shadow-lg ring-1 ring-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-2 text-center font-semibold w-24">N° Matricule</th>
                <th className="px-4 py-2 text-center font-semibold w-24">N° Inscription</th>
                <th className="px-4 py-2 text-center font-semibold w-75">Noms & Prénom(s)</th>
                <th className="px-4 py-2 text-center font-semibold w-40">Date de Naissance</th>
                <th className="px-4 py-2 text-center font-semibold w-20">Sexe</th>
                <th className="px-4 py-2 text-center font-semibold w-60">Adresse Actuelle</th>
                <th className="px-4 py-2 text-center font-semibold w-20">Photo d'identité</th>
                <th className="px-4 py-2 text-center font-semibold w-24">CIN</th>
                <th className="px-4 py-2 text-center font-semibold w-75">Nom du Père</th>
                <th className="px-4 py-2 text-center font-semibold w-75">Nom de la Mère</th>
                <th className="px-4 py-2 text-center font-semibold w-75">Phone Parent</th>
                <th className="px-4 py-2 text-center font-semibold w-75">Nom du Tuteur</th>
                <th className="px-4 py-2 text-center font-semibold w-28">Phone Tuteur</th>
                <th className="px-4 py-2 text-center font-semibold w-75">Adresse Parent</th>
                <th className="px-4 py-2 text-center font-semibold w-60">Adresse Tuteur</th>
                <th className="px-4 py-2 text-center font-semibold w-40">Date Inscription</th>
                <th className="px-4 py-2 text-center font-semibold w-28">Année Scolaire</th>
                <th className="px-4 py-2 text-center font-semibold w-28">Durée de Formation</th>
                <th className="px-4 py-2 text-center font-semibold w-50">Nom de Formation</th>
                <th className="px-4 py-2 text-center font-semibold w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
                {currentData.length > 0 ? (
                  currentData.map((liste, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50 transition duration-100">
                      <td className="px-2 py-2 text-center">{liste.inscription?.personne?.matricule}</td>
                      <td className="px-2 py-2 text-center">{liste.no_inscrit}</td>
                      <td className="px-2 py-2 text-center font-medium"><b>{liste.inscription?.personne?.nom}</b> {liste.inscription?.personne?.prenom}</td>
                      <td className="px-2 py-2 text-center">{liste.inscription?.personne?.naiss} à {liste.inscription?.personne?.lieunaiss}</td>
                      <td className="px-2 py-2 text-center">{liste.inscription?.personne?.sexe}</td>
                      <td className="px-2 py-2 text-center">{liste.inscription?.personne?.adresse}</td>
                      <td className="px-2 py-2 text-center">
                        {liste.personne?.photo ? (
                          <img
                            src={`http://localhost:8000/storage/${liste.personne.photo}`}
                            alt="photo"
                            className="w-10 h-10 rounded-full mx-auto cursor-pointer border-2 border-indigo-500 object-cover"
                            onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.personne.photo}`)}
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
                      <td className="px-2 py-2 text-center">
                          {liste.duree || 'Non spécifié'}
                      </td>
                      <td className="px-2 py-2 text-center">{liste.parcours?.[0]?.nomformation || "---"}</td>
                      <td className="px-2 py-2 text-center flex justify-center gap-1">
                        <button onClick={() => openModal(liste)} className="flex items-center text-white bg-indigo-600 text-white p-1 rounded"><FaEdit  className="mx-1 w-4 h-4"/> Modifier</button>
                        <button onClick={() => handleDelete(liste.inscription?.personne?.matricule)} className="flex items-center text-white bg-red-600 text-white p-1 rounded"><FaTrash className="mx-1 w-4 h-4"/> Supprimer</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={20} className="px-4 py-8 text-center">
                      <FaBookOpen className="mx-auto mb-2" size={24} />
                      <p>Aucune donnée trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
        </table>
      </div>

      {/* --- TABLEAU MOBILE --- */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? currentData.map((liste, idx) => (
          <div key={idx} className="bg-default rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {liste.personne?.photo && (
                  <img
                    src={`http://localhost:8000/storage/${liste.personne.photo}`}
                    alt="photo"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                    onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.personne.photo}`)}
                  />
                )}
                <div>
                  <p className="font-bold">{liste.personne?.nom} {liste.personne?.prenom}</p>
                  <p className="text-sm text-gray-500">{liste.parcours?.[0]?.nomformation || "---"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal(liste)} className="bg-indigo-600 text-white p-2 rounded"><FaEdit /></button>
                <button onClick={() => handleDelete(liste.matricule)} className="bg-red-600 text-white p-2 rounded"><FaTrash /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>Matricule: {liste.matricule}</div>
              <div>Inscription: {liste.no_inscrit}</div>
              <div>Date Inscription: {liste.dateinscrit}</div>
              <div>Année: {liste.anneesco}</div>
              <div>Sexe: {liste.personne?.sexe}</div>
              <div>Adresse: {liste.personne?.adresse}</div>
              <div>CIN: {liste.personne?.cin}</div>
              <div>Durée: **{liste.duree || 'Non spécifié'}**</div>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            <FaBookOpen className="mx-auto mb-2" size={24} />
            <p>Aucune donnée trouvée</p>
          </div>
        )}
      </div>

      {/* --- PAGINATION --- */}
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

      {/* MODALE IMAGE & MODIFICATION */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
            <img src={selectedImage} alt="Zoom" className="rounded-lg w-full h-auto" />
            <p className="text-center text-gray-600 mt-2">Cliquez en dehors pour fermer</p>
          </div>
        </div>
      )}

      <ModificationInscription show={modalModification} handleClose={closeModal} personneData={selectedPersonne}/>
      <NouvellePersonne show={showPersonne} handleClose={closeNewPersonne} />
    </div>
  );
}

export default AffichageFormation;