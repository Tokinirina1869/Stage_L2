import React, { useState, useEffect } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Typography, Modal
} from "@mui/material";
import { FaBookOpen, FaEdit, FaTrash } from "react-icons/fa";
import ModificationInscription from "../modals/ModificationInscription";

function AffichageFormation({ formations }) {
  const [personnes, setPersonnes] = useState(formations || []);
  const [modalModification, setModalModification] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);

  // 👇 Pour afficher une image zoomée
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (p) => { setSelectedPersonne(p); setModalModification(true); };
  const closeModal = () => { setModalModification(false); setSelectedPersonne(null); };

  useEffect(() => { setPersonnes(formations || []); }, [formations]);

  const handleDelete = async (matricule) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette personne ?")) {
      try {
        await fetch(`http://localhost:8000/api/inscriptionComplete/${matricule}`, { method: "DELETE" });
        setPersonnes(personnes.filter(p => p.matricule !== matricule));
        alert("Suppression réussie ✅");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression ❌");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 2 }}>
        <Table sx={{ minWidth: 2200 }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              {[
                "N° Matricule", "N° Inscription", "Noms et Prénoms",
                "Date Naissance", "Sexe", "Adresse", "Photo", "CIN",
                "Nom Mère", "Nom Père", "Nom Tuteur", "Phone Parent",
                "Phone Tuteur", "Adresse Parent", "Adresse Tuteur",
                "Date Inscription", "Année Scolaire", "Type Formation",
                "Nom Formation", "Actions"
              ].map((h, i) => (
                <TableCell key={i} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {personnes.length > 0 ? personnes.map((liste, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{liste.matricule}</TableCell>
                <TableCell>{liste.no_inscrit}</TableCell>
                <TableCell><b>{liste.personne?.nom}</b> {liste.personne?.prenom}</TableCell>
                <TableCell>{liste.personne?.naiss}</TableCell>
                <TableCell>{liste.personne?.sexe}</TableCell>
                <TableCell>{liste.personne?.adresse}</TableCell>

                <TableCell align="center">
                  {liste.personne?.photo ? (
                    <img src={`http://localhost:8000/storage/${liste.personne.photo}`} alt="photo" width={50} height={50}
                      onClick={() => setSelectedImage(`http://localhost:8000/storage/${liste.personne.photo}`)}
                      style={{ borderRadius: "50%", cursor: "pointer", border: "2px solid #1976d2", objectFit: "cover"}} />
                  ) : (
                    <Typography color="text.secondary">Aucune</Typography>
                  )}
                </TableCell>

                <TableCell>{liste.personne?.cin}</TableCell>
                <TableCell>{liste.personne?.nommere}</TableCell>
                <TableCell>{liste.personne?.nompere}</TableCell>
                <TableCell>{liste.personne?.nomtuteur}</TableCell>
                <TableCell>{liste.personne?.phoneparent}</TableCell>
                <TableCell>{liste.personne?.phonetuteur}</TableCell>
                <TableCell>{liste.personne?.adressparent}</TableCell>
                <TableCell>{liste.personne?.adresstuteur}</TableCell>
                <TableCell>{liste.dateinscrit}</TableCell>
                <TableCell>{liste.anneesco}</TableCell>
                <TableCell>{liste.inscriptionformations?.[0]?.type_formation || "---"}</TableCell>
                <TableCell>{liste.parcours?.[0]?.nomformation || "---"}</TableCell>

                <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                  <Button onClick={() => openModal(liste)} sx={{textTransform: 'none', px: 1, py: 0.8,}} variant="contained" color="primary">
                    <FaEdit className="mx-1" /> Modifier
                  </Button>
                  <Button onClick={() => handleDelete(liste.matricule)}  sx={{textTransform: 'none', px: 1, py: 0.8,}} variant="contained" color="error">
                    <FaTrash className="mx-1" /> Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={20} align="center" sx={{ py: 5 }}>
                  <FaBookOpen size={24} style={{ marginBottom: 10 }} />
                  <Typography variant="h6">Aucune donnée trouvée !!!</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔍 MODAL D’IMAGE ZOOMÉE */}
      <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2, boxShadow: 24,
          p: 2, outline: 'none'
        }}>
          <img
            src={selectedImage}
            alt="Zoom"
            style={{ width: "100%", height: "auto", maxWidth: "600px", borderRadius: "10px" }}
          />
          <Typography align="center" sx={{ mt: 1, color: "black" }}>
            Cliquez en dehors pour fermer
          </Typography>
        </Box>
      </Modal>

      <ModificationInscription show={modalModification} handleClose={closeModal} personneData={selectedPersonne} />
    </Box>
  );
}

export default AffichageFormation;
