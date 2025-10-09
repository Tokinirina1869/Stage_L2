import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import { FaBookOpen, FaEdit, FaTrash } from "react-icons/fa";
import ModificationInscription from "../modals/ModificationInscription";
import NouvellePersonne from "../modals/NouvellePersonne";

const columns = [
  { headerName: 'N° Matricule', width: 80 },
  { headerName: 'N° Inscription', width: 20 },
  { headerName: 'Nom', width: 250 },
  { headerName: 'Prénom', width: 250 },
  { headerName: 'Date de Naissance', width: 140 },
  { headerName: 'Sexe', width: 60 },
  { headerName: 'Adresse Actuelle', width: 220 },
  { headerName: 'Photo', width: 80 },
  { headerName: 'CIN', width: 120 },
  { headerName: 'Nom Mère', width: 180 },
  { headerName: 'Nom Père', width: 180 },
  { headerName: 'Nom Tuteur(euse)', width: 180 },
  { headerName: 'Phone Parent', width: 120 },
  { headerName: 'Phone Tuteur', width: 120 },
  { headerName: 'Adresse Parent', width: 200 },
  { headerName: 'Adresse Tuteur', width: 200 },
  { headerName: 'Date Inscription', width: 140 },
  { headerName: 'Année Scolaire', width: 140 },
  { headerName: 'Type Formation', width: 140 },
  { headerName: 'Nom Formation', width: 300 },
  { headerName: 'Actions à faire', width: 200 },
];

function AffichageFormation({ formations }) {
  const [personnes, setPersonnes] = useState(formations || []);
  const [modalModification, setModalModification] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);

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
        console.error(err); alert("Erreur lors de la suppression ❌");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 2 }}>
        <Table sx={{ minWidth: 2200 }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              {columns.map((c, i) => (
                <TableCell key={i} sx={{ color: 'white', fontWeight: 'bold', fontSize: '20px', textAlign: 'center', width: c.width }}>
                  {c.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {personnes.length > 0 ? personnes.map((liste, idx) => (
              <TableRow key={idx} hover>
                <TableCell sx={{ width: columns[0].width }}>{liste.matricule}</TableCell>
                <TableCell sx={{ width: columns[1].width }}>{liste.no_inscrit}</TableCell>
                <TableCell sx={{ width: columns[2].width }}>{liste.personne?.nom || "---"}</TableCell>
                <TableCell sx={{ width: columns[3].width }}>{liste.personne?.prenom || "---"}</TableCell>
                <TableCell sx={{ width: columns[4].width }}>{liste.personne?.naiss || "---"}</TableCell>
                <TableCell sx={{ width: columns[5].width }}>{liste.personne?.sexe || "---"}</TableCell>
                <TableCell sx={{ width: columns[6].width }}>{liste.personne?.adresse || "---"}</TableCell>
                <TableCell sx={{ width: columns[7].width }}>
                  <img width={40} height={40} src={"http://localhost:8000/storage/" + liste.personne?.photo} alt="photo" className="rounded-circle"/>
                </TableCell>
                <TableCell sx={{ width: columns[8].width }}>{liste.personne?.cin || "---"}</TableCell>
                <TableCell sx={{ width: columns[9].width }}>{liste.personne?.nompere || "---"}</TableCell>
                <TableCell sx={{ width: columns[10].width }}>{liste.personne?.nompere || "---"}</TableCell>
                <TableCell sx={{ width: columns[11].width }}>{liste.personne?.nomtuteur || "---"}</TableCell>
                <TableCell sx={{ width: columns[12].width }}>{liste.personne?.phoneparent || "---"}</TableCell>
                <TableCell sx={{ width: columns[13].width }}>{liste.personne?.phonetuteur || "---"}</TableCell>
                <TableCell sx={{ width: columns[14].width }}>{liste.personne?.adressparent || "---"}</TableCell>
                <TableCell sx={{ width: columns[15].width }}>{liste.personne?.adresstuteur || "---"}</TableCell>
                <TableCell sx={{ width: columns[16].width }}>{liste.dateinscrit}</TableCell>
                <TableCell sx={{ width: columns[17].width }}>{liste.anneesco}</TableCell>
                <TableCell sx={{ width: columns[18].width }}>{liste.inscriptionformations?.[0]?.type_formation || "---"}</TableCell>
                <TableCell sx={{ width: columns[19].width }}>{liste.parcours?.[0]?.nomformation || "---"}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'space-between', minWidth: columns[20].width }}>
                  <Button onClick={() => openModal(liste)} variant="contained" color="primary" sx={{ textTransform:'none',m:1 }} size="large"><FaEdit className="mx-2" /> Modifier</Button>
                  <Button onClick={() => handleDelete(liste.matricule)} variant="contained" sx={{ textTransform:'none',m:1 }} color="error" size="large"><FaTrash className="mx-2"/> Supprimer</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: "center", color: "red", py: 5 }}>
                  <FaBookOpen size={24} style={{ marginBottom: 10 }} />
                  <Typography variant="h6">Aucune donnée trouvée !!!</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </TableContainer>
      <ModificationInscription show={modalModification} handleClose={closeModal} personneData={selectedPersonne} refreshList={() => {}} />
      <NouvellePersonne refreshList={() => {}} />
    </Box>
  );
}

export default AffichageFormation;
