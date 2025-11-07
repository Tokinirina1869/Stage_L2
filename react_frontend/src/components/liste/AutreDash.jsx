import React, { useState, useEffect, useCallback } from 'react';
// Remplacement des imports Bootstrap par des classes Tailwind
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Button as MuiButton } from '@mui/material'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

// Utilisation d'un composant de bouton MuI pour plus de cohérence dans les Modales
// Le reste des boutons dans le tableau utilisera des classes Tailwind pour un style plus plat.

const URL = "http://localhost:8000/api";

function SchoolDashboard({ retourDash }) {
  const [parcours, setParcours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [frais, setFrais] = useState([]);

  // ... (Déclarations des états inchangées pour les champs de formulaire)
  const [code_formation, setCode_formation] = useState("");
  const [datedebut, setDatedebut] = useState("");
  const [nomformation, setNomformation] = useState("");
  const [selectedParcours, setSelectedParcours] = useState(null); 
  const [openParcours, setOpenParcours] = useState(false);
  const [modalParcours, setModalParcours] = useState(false);

  const [idfrais, setIdfrais] = useState('');
  const [nomfrais, setNomfrais] = useState("");
  const [montant, setMontant] = useState("");
  const [selectedFrais, setSelectedFrais] = useState(null);
  const [openFrais, setOpenFrais] = useState(false);
  const [modalFrais, setModalFrais] = useState(false);

  const [code_niveau, setCode_niveau] = useState('');
  const [nomniveau, setNomniveau] = useState('');
  const [selectedNiveaux, setSelectedNiveaux] = useState(null); 
  const [openNiveau, setOpenNiveau] = useState(false);
  const [modalNiveaux, setModalNiveaux] = useState(false);
  
  // ... (Handlers d'ouverture/fermeture et de Reset de formulaire inchangés)
  const handleOpenNiveau = () => setOpenNiveau(true);
  const handleCloseNiveau = () => { setOpenNiveau(false); resetNiveauForm(); };
  const handleUpdateNiveaux = () => setModalNiveaux(true);
  const handleCloseNiveaux = () => { setModalNiveaux(false); resetNiveauForm(); };

  const handleOpenParcours = () => setOpenParcours(true);
  const handleCloseParcours = () => { setOpenParcours(false); resetParcoursForm(); };
  const handleUpdateParcours = () => setModalParcours(true);
  const handleCloseparcours = () => { setModalParcours(false); resetParcoursForm(); };

  const handleOpenFrais = () => setOpenFrais(true);
  const handleCloseFrais = () => { setOpenFrais(false); resetFraisForm(); };
  const handleUpdateFrais = () => setModalFrais(true);
  const handleClosefrais = () => { setModalFrais(false); resetFraisForm(); };
  
  const resetNiveauForm = () => {
    setCode_niveau('');
    setNomniveau('');
    setSelectedNiveaux(null);
  };

  const resetFraisForm = () => {
    setIdfrais('');
    setNomfrais('');
    setMontant('');
    setSelectedFrais(null);
  };
  
  const resetParcoursForm = () => {
    setCode_formation('');
    setNomformation('');
    setDatedebut('');
    setSelectedParcours(null);
  };

  const fetchData = useCallback(async () => {
    // ... (Logique fetchData inchangée)
    try {
      const parcoursRes = await axios.get(`${URL}/parcours`);
      setParcours(parcoursRes.data);
      
      const niveauRes = await axios.get(`${URL}/niveau`);
      // Assurer que le format est géré pour les niveaux
      setNiveaux(niveauRes.data.data || niveauRes.data); 

      const fraisRes = await axios.get(`${URL}/frais`);
      setFrais(fraisRes.data);
      
    } catch (err) {
      console.error("Erreur lors de la récupération des données initiales: ", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ... (Toutes les fonctions de soumission et de gestion des actions CRUD sont inchangées)
  const handleSubmitNiveaux = async (e) => {
    e.preventDefault();
    // ... (Logique de soumission inchangée)
    if (!code_niveau.trim() || !nomniveau.trim()) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    // ... (appel API et Swal inchangés)
    try {
      const response = await axios.post(`${URL}/niveaux`, { code_niveau, nomniveau });
      if (response.status === 201 || response.status === 200) {
        Swal.fire({ icon: 'success', title: 'Insertion', text: ` Niveau ajouté avec succès !!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
        handleCloseNiveau();
        await fetchData(); 
      }
    } catch (error) {
      console.error("Erreur Axios :", error);
      Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de l'ajout du niveau. Vérifiez le serveur Laravel!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
    }
  };

  const handleEditNiveau = async (e) => {
    e.preventDefault();
    if (!selectedNiveaux) return;
    // ... (appel API et Swal inchangés)
    try{
      await axios.put(`${URL}/updateNiveaux/${selectedNiveaux.code_niveau}`, { code_niveau, nomniveau });
      Swal.fire({ icon: 'success', title: 'Modification', text: `Niveau modifié avec succès!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      handleCloseNiveaux();
      await fetchData();
    } catch(error){
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de la modification du niveau!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
    }
  }
  
  const handleSelectNiveauForEdit = (niveau) => {
    setSelectedNiveaux(niveau); 
    setCode_niveau(niveau.code_niveau);
    setNomniveau(niveau.nomniveau);
    handleUpdateNiveaux();
  }


  const handleDeleteNiveau = async (code_niveau) => {
    // ... (Logique de suppression inchangée)
    if (window.confirm("Voulez-vous vraiment supprimer cette personne ?")) {
      try {
        await axios.delete(`${URL}/deleteNiveaux/${code_niveau}`);
        Swal.fire({ icon: 'success', title: 'Suppression!', text: `Niveau supprimé avec succès !`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
        await fetchData();
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de la modification du niveau!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      }
    }
  };

  const handleSubmitFrais = async (e) => {
    e.preventDefault();
    // ... (Logique de soumission inchangée)
    if(!idfrais.trim() || !nomfrais.trim() || !montant) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    // ... (appel API et Swal inchangés)
    try {
      const response = await axios.post(`${URL}/addfrais`, { idfrais, nomfrais, montant: parseInt(montant, 10) });
      if(response.status === 201 || response.status === 200) {
        Swal.fire({ icon: 'success', title: 'Nouvelle Insertion!', text: `Frais ajouté avec succès !`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
        handleCloseFrais();
        await fetchData(); 
      }
    } catch(error) {
      console.error("Erreur Axios :", error.response ? error.response.data : error.message);
      alert("Erreur lors de l'ajout des frais. Vérifiez le serveur Laravel !");
    }
  };

  const handleEditFrais = async (e) => {
    e.preventDefault();
    if (!selectedFrais) return;
    // ... (appel API et Swal inchangés)
    try{
      await axios.put(`${URL}/updateFrais/${selectedFrais.idfrais}`,{ nomfrais, montant });
      Swal.fire({ icon: 'success', title: 'Modification!', text: `Modification de frais réussie!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      handleClosefrais();
      await fetchData(); 
    } catch(error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de la modification du frais!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
    }
  }
  
  const handleSelectFraisForEdit = (frais) => {
    setSelectedFrais(frais);
    setIdfrais(frais.idfrais);
    setNomfrais(frais.nomfrais);
    setMontant(frais.montant);
    handleUpdateFrais();
  }

  const handleDeleteFrais = async (idfrais) =>{
    if(!idfrais){ alert('IdFrais invalide !!!'); return; }
    // ... (Logique de suppression inchangée)
    if(window.confirm("Voulez-vous vraiement supprimer ce frais?")) {
      try{
        await axios.delete(`${URL}/deleteFrais/${idfrais}`);
         Swal.fire({ icon: 'success', title: 'Suppression!', text: `Le frais supprimé avec succès!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
        await fetchData();
      } catch(err){
        console.error("Erreur: ", err);
        Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de la suppression!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      }
    }
  }

  const handleSubmitParcours = async (e) => {
    e.preventDefault();
    // ... (Logique de soumission inchangée)
    if (!code_formation.trim() || !nomformation.trim() || !datedebut) {
      alert("⚠️ Veuillez remplir tous les champs !");
      return;
    }
    // ... (appel API et Swal inchangés)
    try {
      const response = await axios.post(`${URL}/addParcours`, { code_formation, nomformation, datedebut });

      if (response.data.status === "success") {
         Swal.fire({ icon: 'success', title: 'Nouveau Parcours!', text: `Le nom de formation inseré avec succès!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
        handleCloseParcours();
        await fetchData();
      } else if (response.data.status === "warning") {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Erreur Axios :", error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 409) {
        Swal.fire({ icon: 'warning', title: 'Warning!', text: `Le nom de formation inseré existe déjà !`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de l'ajout du parcours. Vérifiez le serveur Laravel!`, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      }
    }
  };


  const handleEditParcours = async (e) => {
    e.preventDefault();
    if (!selectedParcours) { alert("Aucun parcours sélectionné !"); return };
    // ... (appel API et Swal inchangés)
    try{
      await axios.put(`${URL}/updateParcours/${selectedParcours.code_formation}`, { nomformation, datedebut });
      Swal.fire({ icon: 'success', title: 'Modification', text: `le parcours a été modifié avec succès! `, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      handleCloseparcours();
      await fetchData();
    } catch(error){
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de la modification du parcours `, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
    }
  }
  
  const handleDeleteParcours= async (code_formation) =>{
    if(!code_formation){ alert('Code_formation invalide !!!'); return; }
    // ... (Logique de suppression inchangée)
    if(window.confirm("Voulez-vous vraiement supprimer ce parcours?")) {
      try{
        await axios.delete(`${URL}/deleteParcours/${code_formation}`);
        Swal.fire({ icon: 'success', title: 'Suppression', text: `le parcours a été supprimé avec succès! `, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
        await fetchData();
      } catch(err){
        console.error("Erreur: ", err);
         Swal.fire({ icon: 'error', title: 'Erreur!', text: `Erreur lors de la suppression du parcours `, background: '#1e1e2f', color: 'white', timer: 3000, showConfirmButton: false, position: "bottom", toast: true });
      }
    }
  }

  const handleSelectParcoursForEdit = (parcours) => {
    setSelectedParcours(parcours);
    setCode_formation(parcours.code_formation);
    setNomformation(parcours.nomformation || "");
    setDatedebut(parcours.datedebut ? parcours.datedebut.substring(0,10) : "");
    handleUpdateParcours();
  }
  // --- FIN DES LOGIQUES INCHANGÉES ---

    return (
        // Remplacement de Container fluid par des classes Tailwind
        <div className="p-4 bg-gray-50 min-h-screen"> 
            <IconButton color='primary' className="bg-blue-600 hover:bg-blue-700 mb-6" onClick={retourDash}>
                <ArrowBack className="text-white text-3xl font-bold"/>
            </IconButton>
            <h1 className="mb-8 text-center text-blue-800 text-3xl font-extrabold">
                Tableau de Bord de l'Établissement
            </h1>

            {/* Remplacement de Row par flex et de Col par w-full lg:w-1/2 */}
            <div className="flex flex-wrap -mx-4"> 
                {/* Section Niveaux - lg:w-1/2 équivaut à Col lg={6} */}
                <div className="w-full lg:w-1/2 px-4 mb-8">
                    {/* Remplacement de Card par des classes Tailwind de Card */}
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="bg-blue-600 text-white p-4 flex justify-between items-center font-bold text-lg">
                            Liste des Niveaux Existants
                            <MuiButton variant="contained" size="small" onClick={handleOpenNiveau} sx={{ textTransform: 'none' }}  className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-md">
                                ➕ <h4 className='text-blue-600'>Ajouter un Niveau</h4>
                            </MuiButton>
                        </div>
                        <div className="p-4">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider">Code Niveau</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider">Nom Niveau</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500  tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    { niveaux.length > 0 ? niveaux.map((niveau) => (
                                        <tr key={niveau.code_niveau} className="hover:bg-blue-50 transition duration-150">
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{niveau.code_niveau}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{niveau.nomniveau}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-center">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button 
                                                        className="flex items-center gap-1 px-3 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded transition duration-150 shadow-sm" 
                                                        onClick={() => handleSelectNiveauForEdit(niveau)}
                                                    >
                                                        <FaEdit className="w-4 h-4"/> Modifier
                                                    </button>
                                                    
                                                    <button 
                                                        className="flex items-center gap-1 px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded transition duration-150 shadow-sm" 
                                                        onClick={()=> handleDeleteNiveau(niveau.code_niveau)}
                                                    >
                                                        <FaTrash className='w-4 h-4'/> Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )):
                                    (
                                      <tr>
                                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-red-500 font-semibold">
                                            Aucun résultat trouvé.
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                {/* Section Frais - lg:w-1/2 équivaut à Col lg={6} */}
                <div className="w-full lg:w-1/2 px-4 mb-8">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="bg-green-600 text-white p-4 flex justify-between items-center font-bold text-lg">
                            Liste des Frais à Payer
                            <MuiButton variant="contained" size="small" onClick={handleOpenFrais} sx={{ textTransform: 'none' }}  className="bg-white text-green-600 text-green-600 hover:bg-gray-100 font-bold shadow-md">
                                ➕ <h4 className='text-green-600'>Ajouter un Frais</h4>
                            </MuiButton>
                        </div>
                        <div className="p-4">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">ID Frais</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Nom du Frais</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Montant (Ar)</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500  tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    { frais.length >0 ? frais.map((fraisItem) => (
                                        <tr key={fraisItem.idfrais} className="hover:bg-green-50 transition duration-150">
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{fraisItem.idfrais}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{fraisItem.nomfrais}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-green-700 font-semibold">{fraisItem.montant.toLocaleString('fr-FR')} Ar</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-center">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button 
                                                        className="flex items-center gap-1 px-3 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded transition duration-150 shadow-sm" 
                                                        onClick={() => handleSelectFraisForEdit(fraisItem)}
                                                    >
                                                        <FaEdit className='w-4 h-4'/> Modifier
                                                    </button>
                                                    <button 
                                                        className="flex items-center gap-1 px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded transition duration-150 shadow-sm" 
                                                        onClick={() => handleDeleteFrais(fraisItem.idfrais)}
                                                    >
                                                        <FaTrash className='w-4 h-4'/> Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) :(
                                      <tr>
                                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-red-500 font-semibold">
                                          Aucune donnée trouvée.
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Parcours - w-full équivaut à Col lg={12} */}
            <div className="w-full px-4 mb-8">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"> 
                    <div className="bg-orange-600 text-white p-4 flex justify-between items-center font-bold text-lg">
                        Liste des Parcours Existants
                        <MuiButton variant="contained" size="small" onClick={handleOpenParcours} sx={{ textTransform: 'none' }} className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-md">
                            ➕ <h4 className='text-orange-600 '>Ajouter un Parcours</h4>
                        </MuiButton>
                    </div>
                    <div className="p-4">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider">Code Parcours</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider">Nom Parcours</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500  tracking-wider">Date Début</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500  tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                { parcours.length > 0 ? parcours.map((parcoursItem) => (
                                    <tr key={parcoursItem.code_formation} className="hover:bg-orange-50 transition duration-150">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{parcoursItem.code_formation}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{parcoursItem.nomformation}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{parcoursItem.datedebut ? parcoursItem.datedebut.substring(0, 10) : 'N/A'}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button 
                                                    className="flex items-center gap-1 px-3 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded transition duration-150 shadow-sm" 
                                                    onClick={() => handleSelectParcoursForEdit(parcoursItem)}
                                                >
                                                    <FaEdit className='w-4 h-4'/> Modifier
                                                </button>
                                                <button 
                                                    className="flex items-center gap-1 px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded transition duration-150 shadow-sm" 
                                                    onClick={() => handleDeleteParcours(parcoursItem.code_formation)}
                                                >
                                                    <FaTrash className='w-4 h-4'/> Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )):
                                (
                                  <tr>
                                    <td colSpan="4" className='px-6 py-4 whitespace-nowrap text-center text-red-500 font-semibold'>
                                        Aucune donnée trouvée.
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- Modales (MuI) --- */}
            
            {/* 1. Modale Ajout Niveau */}
            <Dialog open={openNiveau} onClose={handleCloseNiveau}>
                <DialogTitle className="text-blue-600 font-bold">Ajouter un Nouveau Niveau</DialogTitle>
                <form onSubmit={handleSubmitNiveaux}>
                  <DialogContent className="pt-4">
                    <TextField autoFocus value={code_niveau} onChange={e => setCode_niveau(e.target.value)}
                        margin="dense" label="Code Niveau (Ex: L1, M2)" type="text" fullWidth variant="outlined" required sx={{ mb: 2 }}/>
                    <TextField margin="dense" value={nomniveau} onChange={e => setNomniveau(e.target.value)}
                        label="Nom Niveau (Ex: Licence 1, Master 2)" type="text" fullWidth variant="outlined" required sx={{ mb: 2 }}/>
                  </DialogContent>
                  <DialogActions>
                      <MuiButton onClick={handleCloseNiveau} variant="outlined" color="error" sx={{ textTransform: 'none' }} >Annuler</MuiButton>
                      <MuiButton type='submit' variant="contained" color="primary" sx={{ textTransform: 'none' }} >Ajouter</MuiButton>
                  </DialogActions>
                </form>
            </Dialog>

            {/* 2. Modale Modification Niveau */}
            <Dialog open={modalNiveaux} onClose={handleCloseNiveaux}>
              <DialogTitle className="text-blue-600 font-bold">Modification du Niveau</DialogTitle>
                  <form onSubmit={handleEditNiveau}>
                    <DialogContent className="pt-4">
                      <TextField autoFocus value={code_niveau} onChange={e => setCode_niveau(e.target.value)} type='text' margin='dense' variant='outlined' required fullWidth label="Code Niveau" sx={{ mb: 2}} disabled={!!selectedNiveaux}/> 
                      <TextField autoFocus value={nomniveau} onChange={e => setNomniveau(e.target.value)} type='text' margin='dense' variant='outlined' required fullWidth label="Nom Niveau"  sx={{ mb: 2}} />
                    </DialogContent>
                    <DialogActions>
                      <MuiButton onClick={handleCloseNiveaux} variant='outlined' color="error" sx={{ textTransform: 'none' }} >Annuler</MuiButton>
                      <MuiButton type='submit' variant='contained' color="primary" sx={{ textTransform: 'none' }} >Modifier</MuiButton>
                    </DialogActions>
                  </form>
            </Dialog>

            {/* 3. Modale Ajout Frais */}
            <Dialog open={openFrais} onClose={handleCloseFrais}>
                <DialogTitle className="text-green-600 font-bold">Ajouter un Nouveau Frais à Payer</DialogTitle>
                <form onSubmit={handleSubmitFrais}>
                  <DialogContent className="pt-4">
                    <TextField value={idfrais} onChange={e => setIdfrais(e.target.value)}
                        autoFocus margin="dense" label="ID Frais (Ex: FS001)" type="text"
                        fullWidth variant="outlined" required  sx={{ mb: 2 }}
                    />
                    <TextField value={nomfrais} onChange={e => setNomfrais(e.target.value)}
                        margin="dense"
                        label="Nom du Frais (Ex: Frais de scolarité, Réinscription)"
                        type="text" fullWidth variant="outlined" required sx={{ mb: 2 }}
                    />
                    <TextField value={montant} onChange={e => setMontant(e.target.value)}
                        margin="dense" label="Montant du Frais (Ar)" type="number" fullWidth variant="outlined" required inputProps={{ min: 0, step: "1" }}
                    />
                  </DialogContent>
                  <DialogActions>
                      <MuiButton onClick={handleCloseFrais} variant="outlined" color="error" sx={{ textTransform: 'none' }} >Annuler</MuiButton>
                      <MuiButton type='submit' variant="contained" color="success" sx={{ textTransform: 'none' }} >Enregistrer</MuiButton>
                  </DialogActions>
                </form>
              </Dialog>
              
            {/* 4. Modale Modification Frais */}
            <Dialog open={modalFrais} onClose={handleClosefrais}>
                <DialogTitle className="text-green-600 font-bold">Modification de Frais Scolaires</DialogTitle>
                <form onSubmit={handleEditFrais}>
                  <DialogContent className="pt-4">
                    <TextField type='text' value={nomfrais} onChange={e => setNomfrais(e.target.value)} label="Nom Frais Scolaires" variant='outlined' sx={{ mb:2 }} required fullWidth/>
                    <TextField type='number' value={montant} onChange={e => setMontant(e.target.value)} label="Montant Actuel" variant='outlined' sx={{mb:2}} required fullWidth inputProps={{ min: 0, step: "1" }}/>
                  </DialogContent>
                  <DialogActions>
                    <MuiButton onClick={handleClosefrais} variant='outlined' color="error" sx={{ textTransform: 'none' }} >Annuler</MuiButton>
                    <MuiButton type='submit' variant='contained' color='primary' sx={{ textTransform: 'none' }} >Modifier</MuiButton>
                  </DialogActions>
                </form>
              </Dialog>

            {/* 5. Modale Ajout Parcours */}
            <Dialog open={openParcours} onClose={handleCloseParcours}>
                <DialogTitle className="text-orange-600 font-bold">Ajouter un Nouveau Parcours</DialogTitle>
                <form onSubmit={handleSubmitParcours}>
                  <DialogContent className="pt-4">
                      <TextField autoFocus sx={{ mb:2 }} margin='dense' type='text' value={code_formation} onChange={e => setCode_formation(e.target.value)}
                          label="Code Formation (Ex: INFO, PATIS)" fullWidth variant='outlined' required />
                      <TextField margin="dense" value={datedebut} onChange={e => setDatedebut(e.target.value)}
                          label="Date de début" type="date"
                          fullWidth variant="outlined" required
                          sx={{ mb: 2 }}  InputLabelProps={{ shrink: true }}
                      />
                      <TextField value={nomformation} onChange={e => setNomformation(e.target.value)}
                          margin="dense" label="Nom Parcours (Ex: Informatique, Pâtisserie etc)"
                          type="text" fullWidth variant="outlined" required sx={{ mb: 2 }}
                      />
                    
                  </DialogContent>
                  <DialogActions>
                      <MuiButton onClick={handleCloseParcours} variant="outlined" sx={{ textTransform: 'none' }} color="error">Annuler</MuiButton>
                      <MuiButton type='submit' variant="contained" color="primary" sx={{ textTransform: 'none' }} >Ajouter</MuiButton>
                  </DialogActions>
                </form>
            </Dialog>

            {/* 6. Modale Modification Parcours */}
            <Dialog open={modalParcours} onClose={handleCloseparcours}>
              <DialogTitle className="text-orange-600 font-bold">Modifaction de Parcours</DialogTitle>
              <form onSubmit={handleEditParcours}>
                <DialogContent className="pt-4">
                    <TextField type='text' value={code_formation} label="Code Formation" variant='outlined' sx={{ mb:2 }} fullWidth disabled/>
                  <TextField type='text' value={nomformation} onChange={e => setNomformation(e.target.value)} 
                    variant='outlined' label="Nom Formation" sx={{ mb:2 }} autoFocus fullWidth required/>
                  <TextField type='date' value={datedebut} onChange={e => setDatedebut(e.target.value)} 
                    variant='outlined' label="Date de début" sx={{ mb:2 }} InputLabelProps={{ shrink: true }} fullWidth required/>
                </DialogContent>
                <DialogActions>
                  <MuiButton onClick={handleCloseparcours} variant='outlined' sx={{ textTransform: 'none' }} color="error">Annuler</MuiButton>
                  <MuiButton type='submit' variant='contained' color='primary' sx={{ textTransform: 'none' }} >Modifier</MuiButton>
                </DialogActions>
              </form>
            </Dialog>
        </div>
    );
}

export default SchoolDashboard;