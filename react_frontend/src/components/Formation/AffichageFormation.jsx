import React, { useState, useEffect, useMemo, useContext } from "react";
import { 
  FaBookOpen, 
  FaEdit, 
  FaListAlt, 
  FaPen, 
  FaSearch, 
  FaTrash, 
  FaEye, 
  FaIdCard, 
  FaUser, 
  FaBirthdayCake, 
  FaMapMarkerAlt, 
  FaVenusMars, 
  FaHome, 
  FaPhone, 
  FaUserTie, 
  FaUserFriends, 
  FaCalendarAlt, 
  FaGraduationCap, 
  FaClock, FaCamera,FaTimes
} from "react-icons/fa";
import { Search, Calendar, RefreshCw, XCircle, Mail, MapPin } from "lucide-react";
import ModificationInscription from "../modals/ModificationInscription";
import NouvellePersonne from "../modals/NouvellePersonne";
import Swal from "sweetalert2";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

const categories = ["Tous", "Informatique", "Langues", "Musique", "Coupe et Coutûre", "Pâtisserie"];
const url = "http://localhost:8000/api";

function AffichageFormation({ formations }) {
  const [originalPersonnes, setOriginalPersonnes] = useState(formations || []);
  const { theme } = useContext(ThemeContext);

  const [allPersonnes, setAllPersonnes] = useState(formations || []); 
  const [modalModification, setModalModification] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPersonne, setShowPersonne] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);

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
  
  // Couleurs du Thème
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-gray-50';
  const cardColor = isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const lightTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  const openModal = (p) => { setSelectedPersonne(p); setModalModification(true); };
  const closeModal = () => { setModalModification(false); setSelectedPersonne(null); };

  const openDetailsModal = (p) => { setSelectedPersonne(p); setModalDetails(true); };
  const closeDetailsModal = () => { setModalDetails(false); setSelectedPersonne(null); };

  // Mise à jour des listes lorsque 'formations' change
  useEffect(() => { 
    setOriginalPersonnes(formations || []);
    setAllPersonnes(formations || []);
  }, [formations]);
  
  const handleDelete = async (matricule) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas annuler cette action !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      customClass: {
        popup: isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
        confirmButton: 'bg-indigo-600',
        cancelButton: 'bg-red-600',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}/inscriptionComplete/${encodeURIComponent(matricule)}`);
          
          setOriginalPersonnes(prev => prev.filter(p => p.inscription?.personne?.matricule !== matricule));
          setAllPersonnes(prev => prev.filter(p => p.inscription?.personne?.matricule !== matricule));
          
          Swal.fire({
            icon: 'success',
            text: `Supprimé avec succès !`,
            background: isDark ? '#1e1e2f' : '#fff',
            color: isDark ? 'white' : 'black',
            showConfirmButton: false,
            position: "bottom-end",
            timer: 2000,
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la suppression ❌. Assurez-vous que le matricule est correct.',
            icon: 'error',
            customClass: { popup: isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' }
          });
        }
      }
    });
  };

  const handleSearchClass = (classe) => {
    setActiveCategory(classe);
    setCurrentPage(1); 
  };
  
  const resetFilters = () => {
    setAllPersonnes(originalPersonnes || []); 
    setSearchQuery("");
    setActiveCategory("Tous");
    setDateDebut("");
    setDateFin("");
    setSearchMat("");
    setCurrentPage(1);
    Swal.fire({
      icon:'info', 
      title:'Réinitialisation', 
      text: 'Filtres effacés', 
      timer:1500, 
      showConfirmButton:false,
      background: isDark ? '#1e1e2f' : '#fff',
      color: isDark ? 'white' : 'black',
      position: "bottom-end",
    });
  };

  const handleSearchByDate = async () => {
    if (!dateDebut || !dateFin) {
        Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez sélectionner les deux dates pour filtrer.',
        customClass: { popup: isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' }
        });
        return;
    }
    setLoading(true);
    setCurrentPage(1);
    setActiveCategory("Tous");
    setSearchQuery(""); 

    try {
        const response = await axios.get(`${url}/filterDatePro`, {
        params: { date_debut: dateDebut, date_fin: dateFin },
        });
        
        setAllPersonnes(response.data.data || []); 

        Swal.fire({
          icon: 'success', 
          title: 'Succès', 
          text: `Filtrage effectué : ${response.data.data?.length || 0} résultats.`, 
          background: isDark ? '#1e1e2f' : '#fff',
          color: isDark ? 'white' : 'black',
          timer: 2000,
          showConfirmButton: false,
          position: "bottom-end",
        });

    } catch (error) {
        console.error("Erreur de recherche:", error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de filtrer les données. Assurez-vous que l\'API est fonctionnelle.',
          icon: 'error',
          customClass: { popup: isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' }
        });
    } finally {
        setLoading(false);
    }
  };

  const filterPersonnes = (personnesList, query, category) => {
    return personnesList.filter(p => {
      const q = query.toLowerCase().trim();
      
      const matchText = !q || 
        (String(p.inscription?.personne?.matricule || '').toLowerCase().includes(q)) ||
        (String(p.inscription?.personne?.nom || '').toLowerCase().includes(q)) ||
        (String(p.inscription?.personne?.prenom || '').toLowerCase().includes(q)) ||
        (String(p.inscription?.personne?.cin || '').toLowerCase().includes(q)) ||
        (String(p.no_inscrit || '').toLowerCase().includes(q));

      if (!matchText) return false;

      if (category && category !== "Tous") {
        const hasMatchingParcours = p.parcours?.some(parc => parc.nomformation === category);
        if (!hasMatchingParcours) return false;
      }

      return true;
    });
  };

  const filteredPersonnes = useMemo(() => {
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
        setSearchMat("");

        Swal.fire({
          icon: 'success',
          text: `Matricule trouvé : ${personneData.personne?.nom} ${personneData.personne?.prenom}.`,
          background: isDark ? '#1e1e2f' : '#fff',
          color: isDark ? 'white' : 'black',
          timer: 3000,
          position: "center",
          showConfirmButton: false,
        });
      }
      else {
        Swal.fire({
          title: 'Introuvable', 
          text: `Aucune personne trouvée avec le matricule ${searchMat}.`, 
          icon: 'error',
          customClass: { popup: isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' }
        });
      }

    } 
    catch (error) {
      console.error("Erreur de recherche par matricule:", error);
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de récupérer les données pour ce matricule.',
        icon: 'error',
        customClass: { popup: isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' }
      });
    } 
    finally {
      setLoading(false);
    }
  }

  const renderParcours = (parcours) => {
    if (!parcours || parcours.length === 0) return "---";
    const limitedParcours = parcours.slice(0, 2).map(p => p.nomformation).join(', ');
    return parcours.length > 2 ? `${limitedParcours}, ...` : limitedParcours;
  };

  return (
    <div className={`p-4 sm:p-8 min-h-screen ${bgColor} ${textColor}`}>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-indigo-200/50">
        <div className="flex items-center">
          <FaListAlt className="w-8 h-8 text-indigo-500 mr-3" />
          <h5 className={`text-3xl font-extrabold ${textColor}`}>Liste des inscrits aux Formations Professionnelle</h5>
        </div>
        <p className={`text-xl font-semibold mt-4 sm:mt-0 px-4 py-2 rounded-full ${isDark ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
          Total: <b className="text-lg">{filteredPersonnes.length}</b> personnes
        </p>
      </div>

      {/* --- FILTRES RAPIDES ET RECHERCHES --- */}
      <div className={`${cardColor} shadow-xl rounded-xl p-6 mb-8 border transition duration-300`}>
        
        {/* LIGNE 1: RECHERCHE TEXTUELLE & FILTRES DE DATE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end mb-6">
          
          {/* 1. Recherche Textuelle (Nom, CIN, Inscrit) */}
          <div className="relative lg:col-span-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${lightTextColor}`} />
            <input 
              type="text"  
              placeholder="Nom, Matricule, CIN, N° Insc..." 
              value={searchQuery} 
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${inputBg}`}
            />
          </div>

          {/* 2. Filtres par Date (API) */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex items-center gap-2">
              <Calendar className={`w-5 h-5 ${lightTextColor}`} />
              <label className={`text-sm font-medium ${lightTextColor}`}>Du:</label>
              <input type="date" value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className={`w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBg}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className={`text-sm font-medium ${lightTextColor}`}>Au:</label>
              <input type="date" value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className={`w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${inputBg}`}
              />
            </div>
          </div>
          
          {/* 3. Boutons Date & Réinitialisation */}
          <div className="lg:col-span-1 flex gap-3">
             <button onClick={handleSearchByDate} disabled={loading} 
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg shadow font-semibold transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FaSearch className="w-4 h-4" />}
                {loading ? 'Chargement...' : 'Chercher Date'}
            </button>
            
            <button onClick={resetFilters} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow font-semibold hover:bg-red-600 transition">
                <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LIGNE 2: FILTRES CATÉGORIE & RECHERCHE MATRICULE */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100/50">
           {/* Filtres Catégories */}
          <div className="flex flex-wrap gap-2">
            <FaPen className={`w-5 h-5 mr-1 ${lightTextColor}`} />
            <span className={`font-semibold ${lightTextColor} mr-3 hidden sm:inline`}>Filtre Formation:</span>
            {categories.map(key => (
                <button key={key} onClick={() => handleSearchClass(key)} 
                  className={`px-3 py-1.5 rounded-full text-lg font-bold transition duration-150 ${
                    activeCategory === key ? 'bg-indigo-500 text-white shadow-md' : 
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 
                    'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                    {key}
                </button>
            ))}
          </div>
          
          {/* Recherche Matricule (Autofill/Modal) */}
          <div className="flex items-stretch gap-2 w-full sm:w-auto">
              <input type="text" placeholder="Rechercher par Matricule (Autofill)" value={searchMat} 
                onChange={(e) => setSearchMat(e.target.value)}
                className={`flex-grow sm:min-w-[250px] pl-4 pr-4 py-2 rounded-lg focus:ring-green-500 focus:border-green-500 ${inputBg}`}/>
              <button onClick={handleSearchMat} disabled={loading} 
                className={`px-4 py-2 text-white rounded-lg shadow font-semibold transition ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}>
                  <FaSearch className="w-5 h-5" />
              </button>
          </div>
        </div>
      </div>
      
      {/* --- TABLEAU SIMPLIFIÉ (Desktop) --- */}
      <div className={`hidden md:block ${cardColor} shadow-xl rounded-xl ring-1 ring-gray-200/50 overflow-x-auto transition duration-300`}>
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-2 text-center font-semibold w-30">N° Matricule</th>
                <th className="px-4 py-2 text-center font-semibold w-45">Noms & Prénom(s)</th>
                <th className="px-4 py-2 text-center font-semibold w-50">Date et Lieu de Naissance</th>
                <th className="px-4 py-2 text-center font-semibold w-20">Photo</th>
                <th className="px-4 py-2 text-center font-semibold w-24">CIN</th>
                <th className="px-4 py-2 text-center font-semibold w-50">Formation Suivie</th>
                <th className="px-4 py-2 text-center font-semibold w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
                {currentData.length > 0 ? (
                  currentData.map((liste, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50 transition duration-100">
                      <td className="px-2 py-2 text-center text-sm">{liste.inscription?.personne?.matricule}</td>
                      <td className="px-2 py-2 text-center font-medium"><b>{liste.inscription?.personne?.nom}</b> {liste.inscription?.personne?.prenom}</td>
                      <td className="px-2 py-2 text-center text-sm">{liste.inscription?.personne?.naiss} à {liste.inscription?.personne?.lieunaiss}</td>
                      <td>
                        {liste.inscription?.personne?.photo ? (
                          <img
                            src={`http://localhost:8000/storage/${liste.inscription.personne.photo}`}
                            alt="photo"
                            className="w-10 h-10 rounded-full mx-auto cursor-pointer border-2 border-indigo-500 object-cover"
                            onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.inscription.personne.photo}`)}
                          />
                        ) : <span className="text-gray-400 text-sm">Aucune</span>}
                      </td>
                      <td className="px-2 py-2 text-center text-sm">{liste.inscription?.personne?.cin}</td>
                      <td className="px-2 py-2 text-center text-sm">{renderParcours(liste.parcours)}</td>
                      <td className="px-2 py-2 text-center flex justify-center gap-1">
                        <button onClick={() => openDetailsModal(liste)} className="flex items-center text-white bg-blue-600 p-1 rounded text-xs">
                          <FaEye className="mx-1 w-3 h-3"/> Détails
                        </button>
                        <button onClick={() => openModal(liste)} className="flex items-center text-white bg-yellow-600 p-1 rounded text-xs">
                          <FaEdit className="mx-1 w-3 h-3"/> Modifier
                        </button>
                        <button onClick={() => handleDelete(liste.inscription?.personne?.matricule)} className="flex items-center text-white bg-red-600 p-1 rounded text-xs">
                          <FaTrash className="mx-1 w-3 h-3"/> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <FaBookOpen className="mx-auto mb-2" size={24} />
                      <p>Aucune donnée trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
        </table>
        </div>
      </div>

      {/* --- CARDS (Mobile) --- */}
      <div className="md:hidden flex flex-col gap-4 mt-6">
        {currentData.length > 0 ? currentData.map((liste, idx) => (
          <div key={idx} className={`${cardColor} rounded-xl shadow-lg p-4 flex flex-col gap-3 border transition duration-300`}>
            
            {/* Header Mobile: Nom + Actions */}
            <div className="flex items-center justify-between border-b pb-3 border-gray-200/50">
              <div className="flex items-center gap-3">
                {liste.inscription?.personne?.photo && (
                  <img
                    src={`http://localhost:8000/storage/${liste.inscription.personne.photo}`}
                    alt="photo"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                    onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.inscription.personne.photo}`)}
                  />
                )}
                <div>
                  <p className={`font-bold ${textColor}`}>{liste.inscription?.personne?.nom} {liste.inscription?.personne?.prenom}</p>
                  <p className={`text-sm font-medium text-indigo-500`}>{renderParcours(liste.parcours)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openDetailsModal(liste)} title="Détails"
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition">
                    <FaEye className="w-4 h-4"/>
                </button>
                <button onClick={() => openModal(liste)} title="Modifier"
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition">
                    <FaEdit className="w-4 h-4"/>
                </button>
                <button onClick={() => handleDelete(liste.inscription?.personne?.matricule)} title="Supprimer"
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition">
                    <FaTrash className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* Détails Mobile */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <DetailMobile label="Matricule" value={liste.inscription?.personne?.matricule} />
              <DetailMobile label="CIN" value={liste.inscription?.personne?.cin} />
              <DetailMobile label="Date Naiss." value={liste.inscription?.personne?.naiss} />
              <DetailMobile label="Lieu Naiss." value={liste.inscription?.personne?.lieunaiss} />
            </div>
          </div>
        )) : (
          <div className={`text-center py-8 ${lightTextColor}`}>
            <FaBookOpen className="mx-auto mb-3 w-6 h-6" />
            <p>Aucune personne trouvée avec les filtres actuels.</p>
          </div>
        )}
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className={`flex justify-between items-center px-4 py-3 ${cardColor} border-t mt-6 rounded-xl shadow-lg`}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
            className={`flex items-center gap-2 px-3 py-1 font-bold rounded-lg transition duration-200 disabled:opacity-50 ${isDark ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            Précédent
          </button>
          <span className={`text-sm ${lightTextColor}`}>Page **{currentPage}** sur **{totalPages}**</span>
          <button  onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-3 py-1 font-bold rounded-lg transition duration-200 disabled:opacity-50 ${isDark ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            Suivant
          </button>
        </div>
      )}

      {/* MODALES */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]"
          onClick={() => setSelectedImage(null)}>
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Zoom Photo d'identité" className="rounded-lg w-full h-auto object-cover max-h-[80vh]" />
            <p className="text-center text-gray-600 mt-3 font-medium">Photo d'identité (Cliquez en dehors pour fermer)</p>
          </div>
        </div>
      )}

      {/* Modal Détails Professionnel */}
      {modalDetails && selectedPersonne && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
          onClick={closeDetailsModal}>
          <div className={`${cardColor} rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col`} onClick={(e) => e.stopPropagation()}>
            
            {/* En-tête du modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200/50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <FaUser className="w-6 h-6" />
                <div>
                  <h3 className="text-2xl font-bold text-center">Fiche Personnelle</h3>
                </div>
              </div>
              <button onClick={closeDetailsModal} className="text-white hover:text-gray-200 text-2xl transition">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                  <div className="mb-6">
                    <div className="relative group">
                      <div className="m-6 w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden bg-gray-200 flex items-center justify-center mx-auto">
                        {selectedPersonne.inscription?.personne?.photo ? (
                          <img
                            src={`http://localhost:8000/storage/${selectedPersonne.inscription.personne.photo}`}
                            alt="Photo de profil"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedImage(`http://localhost:8000/storage/${selectedPersonne.inscription.personne.photo}`)}
                          />
                        ) : (
                          <FaUser className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <FaCamera className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow 
                      icon={<FaIdCard className="text-indigo-600" />}
                      label="Matricule"
                      value={selectedPersonne.inscription?.personne?.matricule}
                    />
                    <InfoRow 
                      icon={<FaUser className="text-green-600" />}
                      label="Nom Complet"
                      value={`${selectedPersonne.inscription?.personne?.nom} ${selectedPersonne.inscription?.personne?.prenom}`}
                    />
                    <InfoRow 
                      icon={<FaIdCard className="text-blue-600" />}
                      label="Adresse e-mail"
                      value={selectedPersonne.inscription?.personne?.email}
                    />
                    <InfoRow 
                      icon={<FaIdCard className="text-blue-600" />}
                      label="CIN"
                      value={selectedPersonne.inscription?.personne?.cin}
                    />
                    <InfoRow 
                      icon={<FaIdCard className="text-blue-600" />}
                      label="Délivré le"
                      value={selectedPersonne.inscription?.personne?.datedel}
                    />
                    <InfoRow 
                      icon={<FaVenusMars className="text-pink-600" />}
                      label="Sexe"
                      value={selectedPersonne.inscription?.personne?.sexe}
                    />
                    <InfoRow 
                      icon={<FaBirthdayCake className="text-purple-500" />}
                      label="Date de Naissance"
                      value={selectedPersonne.inscription?.personne?.naiss}
                    />
                    <InfoRow 
                      icon={<FaMapMarkerAlt className="text-red-500" />}
                      label="Lieu de Naissance"
                      value={selectedPersonne.inscription?.personne?.lieunaiss}
                    />
                    <InfoRow 
                      icon={<FaHome className="text-green-500" />}
                      label="Adresse Actuelle"
                      value={selectedPersonne.inscription?.personne?.adresse}
                    />
                  </div>
                </div>

                {/* Grille des informations détaillées */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Colonne 1: Informations Familiales */}
                  <div className="space-y-6">
                    <SectionTitle icon={<FaUserFriends className="text-indigo-500" />} title="Informations Familiales" />
                    
                    <InfoRow 
                      icon={<FaUserTie className="text-blue-500" />}
                      label="Nom du Père"
                      value={selectedPersonne.inscription?.personne?.nompere}
                    />
                    <InfoRow 
                      icon={<FaUserFriends className="text-pink-500" />}
                      label="Nom de la Mère"
                      value={selectedPersonne.inscription?.personne?.nommere}
                    />
                    <InfoRow 
                      icon={<FaPhone className="text-green-500" />}
                      label="Téléphone Parent"
                      value={selectedPersonne.inscription?.personne?.phoneparent}
                    />
                    <InfoRow 
                      icon={<FaUserTie className="text-orange-500" />}
                      label="Nom du Tuteur"
                      value={selectedPersonne.inscription?.personne?.nomtuteur}
                    />
                    <InfoRow 
                      icon={<FaPhone className="text-red-500" />}
                      label="Téléphone Tuteur"
                      value={selectedPersonne.inscription?.personne?.phonetuteur}
                    />
                     <InfoRow 
                      icon={<FaHome className="text-blue-500" />}
                      label="Adresse Parent"
                      value={selectedPersonne.inscription?.personne?.adressparent}
                    />
                    <InfoRow 
                      icon={<FaHome className="text-green-500" />}
                      label="Adresse Tuteur"
                      value={selectedPersonne.inscription?.personne?.adresstuteur}
                    />
                  </div>

                  {/* Colonne 4: Informations d'Inscription */}
                  <div className="space-y-6">
                    <SectionTitle icon={<FaGraduationCap className="text-indigo-500" />} title="Informations d'Inscription" />
                    
                    <InfoRow 
                      icon={<FaIdCard className="text-purple-500" />}
                      label="N° Inscription"
                      value={selectedPersonne.no_inscrit}
                    />
                    <InfoRow 
                      icon={<FaCalendarAlt className="text-blue-500" />}
                      label="Date d'Inscription"
                      value={selectedPersonne.inscription?.dateinscrit}
                    />
                    <InfoRow 
                      icon={<FaGraduationCap className="text-green-500" />}
                      label="Année Scolaire"
                      value={selectedPersonne.inscription?.anneesco}
                    />
                    <InfoRow 
                      icon={<FaClock className="text-orange-500" />}
                      label="Durée de Formation"
                      value={selectedPersonne.duree || 'Non spécifié'}
                    />

                    <SectionTitle icon={<FaGraduationCap className="text-indigo-500" />} title="Formations Inscrites" />
                  
                    {selectedPersonne.parcours && selectedPersonne.parcours.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedPersonne.parcours.map((parcours, index) => (
                          <div key={index} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg">
                            <FaGraduationCap className="w-5 h-5" />
                            <span className="font-semibold">{parcours.nomformation}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-100 rounded-lg">
                        <FaGraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Aucune formation assignée</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pied du modal */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200/50 bg-gray-50">
              <button onClick={() => openModal(selectedPersonne)}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold flex items-center gap-2">
                <FaEdit className="w-4 h-4" />
                Modifier
              </button>
              <button onClick={closeDetailsModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <ModificationInscription show={modalModification} handleClose={closeModal} personneData={selectedPersonne}/>
      <NouvellePersonne show={showPersonne} handleClose={closeNewPersonne} personneData={selectedPersonne} /> 
    </div>
  );
}

// Composant utilitaire pour les détails mobiles
const DetailMobile = ({ label, value, isBold = false, className = '' }) => (
  <div className={className}>
    <span className="font-medium text-gray-500">{label}: </span>
    <span className={isBold ? 'font-bold text-gray-900' : 'text-gray-700'}>{value}</span>
  </div>
);

// Nouveaux composants pour le modal professionnel
const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
    <div className="p-2 bg-indigo-100 rounded-lg">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-gray-800">{title}</h4>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-2">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900 font-semibold">{value || 'Non renseigné'}</p>
    </div>
  </div>
);

export default AffichageFormation;