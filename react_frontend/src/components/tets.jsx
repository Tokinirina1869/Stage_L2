// import React, {useState, useEffect} from 'react';
// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
// import axios from 'axios';
// import ModificationInscription from './modals/ModificationInscription';

// const columns = [
//   { headerName: 'N° Matricule', width: 50 },
//   { headerName: 'N° Inscription', width: 10 },
//   { headerName: 'Nom', width: 250 },
//   { headerName: 'Prénom', width: 250 },
//   { headerName: 'Date de Naissance', width: 50 },
//   { headerName: 'Sexe', width: 50 },
//   { headerName: 'Adresse Actuelle', width: 110 },
//   { headerName: 'Photo', width: 40 },
//   { headerName: 'CIN', width: 50 },
//   { headerName: 'Nom Mère', width: 160 },
//   { headerName: 'Nom Père', width: 160 },
//   { headerName: 'Nom Tuteur(euse)', width: 160 },
//   { headerName: 'Phone Parent', width: 16},
//   { headerName: 'Phone Tuteur', width: 60 },
//   { headerName: 'Adresse Parent', width: 160 },
//   { headerName: 'Adresse Tuteur', width: 160 },
//   { headerName: 'Date Inscription', width: 50 },
//   { headerName: 'Année Scolaire', width: 50 },
//   { headerName: 'Type Formation', width: 100 },
//   { headerName: 'Nom Formation', width: 160 },
//   { headerName: 'Action', width: 200 },
// ];

// function DataDisplayTable() {

//   const [personnes, setPersonnes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modalModification, setModalModification] = useState(false);
//     const [selectedPersonne, setSelectedPersonne] = useState(null);
  
//     const openModal = (personne) => {
//       setSelectedPersonne(personne);
//       setModalModification(true);
//     };
//     const closeModal = () => {
//       setModalModification(false);
//       setSelectedPersonne(null);
//     };
   
//     useEffect(() => {
//       fetchPersonnes();
//     }, []);
  
//     const fetchPersonnes = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/personnes');
//         setPersonnes(response.data);
//           setLoading(false);
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
  
//     if (loading) {
//       return <p className="text-center mt-3">Chargement...</p>;
//     }
  
//     const handleDelete = async (matricule) => {
//         if (window.confirm( "Voulez-vous vraiement supprimer cette personne ?" ))
//         {
//             try{
//                 await axios.delete(`http://localhost:8000/api/inscriptionComplete/${matricule}`);
//                 setPersonnes(personnes.filter(p => p.matricule !== matricule));
//                 alert ("Suppression réussie ✅");
//             }
//             catch(err) {
//               console.err(err);
//               alert("Erreur lors de la suppression ❌");
//             }
//         }
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" component="h1" gutterBottom align="center">
//         Liste des Utilisateurs
//       </Typography>
      
//       <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 2 }}>
//         <Table sx={{ minWidth: 650 }} aria-label="tableau de données simple">
          
//           {/* En-tête du tableau */}
//           <TableHead sx={{ bgcolor: 'primary.light' }}>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell key={column.field} sx={{ color: 'white', fontWeight: 'bold' }} >
//                   {column.headerName}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
          
//           <TableBody>
//             {personnes && personnes.length > 0 ? (
              
//               personnes.map((liste) => (
//                 <TableRow key={liste.no_inscrit}
//                 // Ajoute un effet visuel au survol
//                 hover
//                 // Style pour les dernières lignes
//                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                
//                 <TableCell>{liste.matricule}</TableCell>
//                 <TableCell>{liste.no_inscrit}</TableCell>
//                 <TableCell>{liste.personne?.nom || "---"}</TableCell>
//                 <TableCell>{liste.personne?.prenom || "---"}</TableCell>
//                 <TableCell>{liste.personne?.naiss || "---"}</TableCell>
//                 <TableCell>{liste.personne?.sexe || "---"}</TableCell>
//                 <TableCell>{liste.personne?.adresse || "---"}</TableCell>
//                 <TableCell>
//                   <img width={40} height={40}  src={ "http://localhost:8000/storage/" + liste.personne?.photo } alt='Photo'  className='rounded-circle'/>
//                 </TableCell>
//                 <TableCell>{liste.personne?.cin || "---"}</TableCell>
//                 <TableCell>{liste.personne?.nompere || "---"}</TableCell>
//                 <TableCell>{liste.personne?.nompere || "---"}</TableCell>
//                 <TableCell>{liste.personne?.nomtuteur || "---"}</TableCell>
//                 <TableCell>{liste.personne?.phoneparent || "---"}</TableCell>
//                 <TableCell>{liste.personne?.phonetuteur || "---"}</TableCell>
//                 <TableCell>{liste.personne?.adressparent || "---"}</TableCell>
//                 <TableCell>{liste.personne?.adresstuteur || "---"}</TableCell>
//                 <TableCell>{liste.dateinscrit}</TableCell>
//                 <TableCell>{liste.anneesco}</TableCell>
//                 <TableCell>{liste.inscriptionformations[0]?.type_formation || "---"}</TableCell>
//                 <TableCell>{liste.parcours[0]?.nomformation || "---"}</TableCell>
//                 <TableCell sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
//                   <Button variant="outlined" size="small"  color="primary" onClick={() => openModal(liste)}>
//                     Modifier
//                   </Button>
//                   <Button variant="outlined" size="small"  color="danger" onClick={() => handleDelete(liste.matricule)}>
//                     Supprimer
//                   </Button>
//                   </TableCell>
//                 </TableRow>

//               ))
//             ):(
//                 <tr>
//                   <td colSpan="19" className="text-center text-danger">
//                     Aucune donnée trouvée !!!
//                   </td>
//                 </tr>
//               )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <ModificationInscription show={modalModification} handleClose={closeModal} personneData={selectedPersonne} refreshList={fetchPersonnes} />
//     </Box>
//   );
// }

// export default DataDisplayTable;


import React, { useState } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const AffichageFormation = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Filtrage des données selon la recherche
  const filteredData = data.filter(
    (item) =>
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
        Liste des Inscriptions
      </Typography>

      {/* Champ de recherche */}
      <TextField
        fullWidth
        label="Rechercher un élève ou une formation..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Tableau filtré */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell><strong>Prénom</strong></TableCell>
              <TableCell><strong>Formation</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.nom}</TableCell>
                  <TableCell>{row.prenom}</TableCell>
                  <TableCell>{row.formation}</TableCell>
                  <TableCell>{row.dateInscription}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AffichageFormation;
