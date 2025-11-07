import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button
} from "@mui/material";
import { MonetizationOn } from "@mui/icons-material";
import axios from "axios";

const monthOptions = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

const autresFrais = ["Droit d'inscription", "Frais Scolaires", "Tenue de fête", "VRM"];

export default function CarteEcolage({ matricule, open, handleClose }) {
  const [moisPayes, setMoisPayes] = useState([]);
  const [autresPayes, setAutresPayes] = useState([]);

  useEffect(() => {
    if (!matricule) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/ecolage/${matricule}`);
        if (res.data) {
          setMoisPayes(res.data.moisPayes || []);
          
          setAutresPayes(res.data.autresFraisPayes || []);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setMoisPayes([]);
        setAutresPayes([]);
      }
    };

    fetchData();
  }, [matricule]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        className="text-center text-indigo-600 fw-bold"
        variant="h4"
      >
        <MonetizationOn fontSize="24" className="mx-1" /> Carte des paiements
      </DialogTitle>

      <DialogContent>
        {/* --- Table des frais mensuels --- */}
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="fw-bold text-primary">
                  Mois
                </TableCell>
                <TableCell align="center" className="fw-bold text-primary">
                  Statut
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthOptions.map((month) => {
                const paid = moisPayes.includes(month);
                return (
                  <TableRow key={month}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {month}
                    </TableCell>
                    <TableCell align="center" sx={{backgroundColor: paid ? "#4CAF50" : "#E53935", color: "white", fontWeight: "bold", borderRadius: 2}}>
                      {paid ? "Payé" : "Non payé"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* --- Table des autres frais --- */}
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableBody>
              {autresFrais.map((frais) => {
                const paid = autresPayes.some((f) =>
                  f.toLowerCase().includes(frais.toLowerCase())
                );
                return (
                  <TableRow key={frais}>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {frais}
                    </TableCell>
                    <TableCell align="center" sx={{backgroundColor: paid ? "#4CAF50" : "#E53935", color: "white", fontWeight: "bold", borderRadius: 2}}
                    >
                      {paid ? "Payé" : "Non payé"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box textAlign="center">
          <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2, textTransform: 'none' }}>
            Fermer
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
