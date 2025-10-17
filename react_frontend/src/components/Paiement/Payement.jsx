import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Checkbox, Button, MenuItem, Box, Divider,
  TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Table as MuiTable
} from '@mui/material';
import { Col, Row, Form } from 'react-bootstrap';
import { FaEdit, FaMoneyCheckAlt, FaTimes, FaTrash, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ⚠️ Important : patch autoTable sur jsPDF
jsPDF.API.autoTable = autoTable;

const monthOptions = [
  'Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];
const url = 'http://localhost:8000/api';

const initialPayment = {
  no_paie: '', no_inscrit: '', matricule: '', idfrais: '',
  datepaie: '', modepaie: '', montantpaie: 0, nomFrais: [], tuitionMonths: []
};

function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState(initialPayment);
  const [listeFrais, setListeFrais] = useState([]);
  const [listePaie, setListePaie] = useState([]);
  const [listeInsc, setListeInsc] = useState([]);
  const [modalPaie, setModalPaie] = useState(false);
  const [selectedPaie, setSelectedPaie] = useState(null);

  // ---------------- Data Loading ----------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [inscRes, fraisRes, paieRes] = await Promise.all([
          axios.get(`${url}/inscriptions`),
          axios.get(`${url}/frais`),
          axios.get(`${url}/listepaiement`)
        ]);
        setListeInsc(inscRes.data);
        setListeFrais(fraisRes.data);
        setListePaie(paieRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // ---------------- Utils ----------------
  const resetForm = () => setPaymentDetails(initialPayment);
  const openModal = () => setModalPaie(true);
  const closeModal = () => {
    setModalPaie(false);
    setSelectedPaie(null);
    resetForm();
  }
  const updatePayment = (changes) => setPaymentDetails(prev => ({ ...prev, ...changes }));

  // Automatisation du Matricule selon No. Inscription
  useEffect(() => {
    if (paymentDetails.no_inscrit) {
      const selectedInsc = listeInsc.find(i => i.no_inscrit === paymentDetails.no_inscrit);
      if (selectedInsc && selectedInsc.matricule !== paymentDetails.matricule) {
        updatePayment({ matricule: selectedInsc.matricule });
      }
    } else if (paymentDetails.matricule !== '') {
      updatePayment({ matricule: '' });
    }
  }, [paymentDetails.no_inscrit, listeInsc, paymentDetails.matricule]);

  // ---------------- Frais / Mois ----------------
  const handleFraisChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);

    const ids = listeFrais.filter(f => selected.includes(f.nomfrais)).map(f => f.idfrais);
    
    const isTuitionSelected = selected.some(f => f.toLowerCase().includes('ecolage'));

    updatePayment({
      nomFrais: selected,
      idfrais: ids.join(","),
      tuitionMonths: isTuitionSelected ? paymentDetails.tuitionMonths : []
    });
  };

  const handleTuitionMonthCheck = (month) => {
    const months = paymentDetails.tuitionMonths.includes(month)
      ? paymentDetails.tuitionMonths.filter(m => m !== month)
      : [...paymentDetails.tuitionMonths, month];
    updatePayment({ tuitionMonths: months });
  };

  // ---------------- Montant automatique ----------------
  useEffect(() => {
    const total = paymentDetails.nomFrais.reduce((sum, nom) => {
      const f = listeFrais.find(f => f.nomfrais === nom);
      if (!f) return sum;
      const isTuition = f.nomfrais.toLowerCase().includes('ecolage');
      const amount = f.montant || 0;
      return sum + (isTuition ? amount * paymentDetails.tuitionMonths.length : amount);
    }, 0);
    setPaymentDetails(prev => ({ ...prev, montantpaie: total }));
  }, [paymentDetails.nomFrais, paymentDetails.tuitionMonths, listeFrais]);

  // ---------------- CRUD ----------------
  const fetchPaie = async () => {
    try {
      const res = await axios.get(`${url}/listepaiement`);
      setListePaie(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitPaie = async (e) => {
    e.preventDefault();
    if (!paymentDetails.nomFrais.length) return alert("⚠️ Veuillez sélectionner au moins un frais !");
    if (paymentDetails.nomFrais.some(f => f.toLowerCase().includes('ecolage')) && !paymentDetails.tuitionMonths.length) {
      return alert("⚠️ Veuillez sélectionner au moins un mois pour l'écolage !");
    }
    
    try {
      await axios.post(`${url}/addpaiement`, paymentDetails);
      alert("✅ Paiement ajouté !");
      fetchPaie();
      resetForm();
    } catch (err) {
      alert(`❌ Erreur : ${JSON.stringify(err.response?.data?.errors || err.message)}`);
    }
  };

  const handleEditPaie = async (e) => {
    e.preventDefault();
    if (!selectedPaie) return;
    if (paymentDetails.nomFrais.some(f => f.toLowerCase().includes('ecolage')) && !paymentDetails.tuitionMonths.length) {
      return alert("⚠️ Veuillez sélectionner au moins un mois pour l'écolage !");
    }

    try {
      await axios.put(`${url}/updatepaiement/${selectedPaie.no_paie}`, paymentDetails);
      alert("✅ Modification réussie !");
      closeModal();
      fetchPaie();
    } catch (err) {
      alert(`❌ Erreur : ${JSON.stringify(err.response?.data?.errors || err.message)}`);
    }
  };

  const handleDeletePaie = async (no_paie) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce paiement ?")) return;
    try {
      await axios.delete(`${url}/deletepaiement/${no_paie}`);
      alert("✅ Paiement supprimé !");
      fetchPaie();
    } catch (err) {
      alert("❌ Erreur lors de la suppression !", err);
    }
  };

  const handleSelectedPaie = (paie) => {
    setSelectedPaie(paie);
    
    const fraisData = Array.isArray(paie.frais_associes) ? paie.frais_associes : paie.nomfrais || [];
    const monthsData = Array.isArray(paie.mois_paies) ? paie.mois_paies.map(m => m.nommois) : paie.tuitionMonths || [];

    updatePayment({
      no_paie: paie.no_paie || '',
      no_inscrit: paie.no_inscrit || '',
      matricule: paie.matricule || '',
      datepaie: paie.datepaie || '',
      montantpaie: paie.montantpaie || 0,
      modepaie: paie.modepaie || '',
      nomFrais: Array.isArray(fraisData) ? fraisData.map(f => f.nomfrais || f) : [],
      idfrais: Array.isArray(fraisData) ? fraisData.map(f => f.idfrais || f).join(',') : '',
      tuitionMonths: monthsData
    });
    openModal();
  };

  const calculateReste = (paiement) => {
    const fraisAssocies = Array.isArray(paiement.frais_associes) ? paiement.frais_associes : paiement.nomfrais || [];
    if (!fraisAssocies.length) return 0;
    
    const monthsCount = Array.isArray(paiement.mois_paies) 
        ? paiement.mois_paies.length 
        : (paiement.tuitionMonths?.length || 0);

    const totalFraisDues = fraisAssocies.reduce((sum, f) => {
        const isTuition = (f.nomfrais || f).toLowerCase().includes('ecolage');
        const amount = f.montant || 0;
        return sum + (isTuition ? amount * (monthsCount > 0 ? monthsCount : 1) : amount);
    }, 0);

    return totalFraisDues - (paiement.montantpaie || 0);
  };

  const buttonStyle = (color) => ({
    padding: '10px 30px', borderRadius: '8px', fontWeight: 'bold',
    color: '#fff', textTransform: 'none', backgroundColor: color,
    '&:hover': { transform: 'translateY(-2px)', backgroundColor: color }
  });

  const tableHeaders = [
  { title: 'N° Paiement', width: 120 },
  { title: 'N° Matricule', width: 120 },
  { title: 'N° Inscription', width: 120 },
  { title: 'Nom et Prénom', width: 180 },
  { title: 'Date de Paiement', width: 150 },
  { title: 'Montant Payé (Ar)', width: 150 },
  { title: 'Reste (Ar)', width: 120 },
  { title: 'Frais Payés', width: 350 }, // ✅ colonne élargie
  { title: 'Actions', width: 300 },
];
/**
 * Génère un reçu PDF pour un paiement
 * @param {Object} paiement - Objet paiement contenant info élève et frais associés
 */
const generateReceipt = (paiement) => {
  // 2️⃣ Création du document PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // 3️⃣ Styles de base
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const lineHeight = 8;
  let currentY = 20;

  // 4️⃣ BORDURE décorative
  doc.setDrawColor(30, 144, 255); // couleur bleu
  doc.setLineWidth(1.5);
  doc.rect(8, 8, pageWidth - 16, 281, "S");

  // 5️⃣ LOGO (optionnel)
  try {
    const logo = new Image();
    logo.src = "/fma.png"; // mettre le logo dans /public/fma.png
    doc.addImage(logo, "PNG", pageWidth / 2 - 15, 12, 30, 30);
  } catch (e) {
    console.warn("Logo non trouvé, ignoré.", e);
  }

  // 6️⃣ TITRE
  currentY += 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 102, 204);
  doc.text("REÇU DE PAIEMENT", pageWidth / 2, currentY, { align: "center" });

  // 7️⃣ Infos établissement
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("Établissement Scolaire Sainte-Marie", pageWidth / 2, currentY + 8, { align: "center" });
  doc.text("Adresse : Lot II K 12, Antananarivo - Madagascar", pageWidth / 2, currentY + 14, { align: "center" });
  doc.text("Tél : +261 34 12 345 67 | Email : contact@sainte-marie.edu.mg", pageWidth / 2, currentY + 20, { align: "center" });

  // 8️⃣ Séparation
  currentY += 35;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // 9️⃣ Section informations paiement
  currentY += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Détails du Paiement :", margin, currentY);

  currentY += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`N° Paiement : ${paiement.no_paie}`, margin, currentY);
  doc.text(`Date de paiement : ${paiement.datepaie}`, margin + 100, currentY);

  currentY += lineHeight;
  doc.text(`Nom de l'élève : ${paiement.personne?.nom || ''} ${paiement.personne?.prenom || ''}`, margin, currentY);

  currentY += lineHeight;
  doc.text(`N° Matricule : ${paiement.matricule}`, margin, currentY);
  doc.text(`N° Inscription : ${paiement.no_inscrit}`, margin + 100, currentY);

  currentY += lineHeight;
  doc.text(`Mode de paiement : ${paiement.modepaie}`, margin, currentY);

  currentY += lineHeight;
  doc.text(`Montant payé : ${paiement.montantpaie?.toLocaleString()} Ar`, margin, currentY);

  // 10️⃣ Tableau des frais payés
  const frais = paiement.frais_associes?.map(f => [f.idfrais, f.nomfrais]) || [];
  if (frais.length > 0) {
    // ⚠️ Utiliser autoTable(doc, {...}) et non doc.autoTable()
    autoTable(doc, {
      startY: currentY + 10,
      head: [["Code Frais", "Nom du Frais"]],
      body: frais,
      theme: "striped",
      headStyles: { fillColor: [30, 144, 255] },
      margin: { left: margin, right: margin },
    });
  }

  const afterTableY = doc.lastAutoTable?.finalY || currentY + 20;

  // 11️⃣ Pied de page
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.text("Merci pour votre paiement et votre confiance.", pageWidth / 2, afterTableY + 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Signature du comptable :", margin + 120, afterTableY + 35);
  doc.line(margin + 120, afterTableY + 37, pageWidth - margin, afterTableY + 37);

  // 12️⃣ Sauvegarder le PDF
  doc.save(`Recu_${paiement.no_paie}.pdf`);
};


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h2' align="center" sx={{ p: 3, fontWeight: 'bold', color: 'green', mb: 3 }}>Liste des Paiements effectués</Typography>

      <Row>
        {/* FORMULAIRE DE PAIEMENT */}
        <Col lg={5}>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', height: '820px', overflow: 'auto' }}>
            <Card sx={{ maxWidth: 900, width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleSubmitPaie}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>Formulaire de Paiement</Typography>
                  <Row>
                    <Col lg={6} className='mb-3'>
                      <TextField fullWidth label="No. Paiement" name="no_paie" value={paymentDetails.no_paie} onChange={e => updatePayment({ no_paie: e.target.value })} size="small" required />
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField select fullWidth label="No. Inscription" name='no_inscrit' value={paymentDetails.no_inscrit} onChange={e => updatePayment({ no_inscrit: e.target.value })} size='small' required>
                        {listeInsc.map(insc => (<MenuItem key={insc.no_inscrit} value={insc.no_inscrit}>{insc.no_inscrit}</MenuItem>))}
                      </TextField>
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField fullWidth label="No. Matricule" value={paymentDetails.matricule} size="small" disabled InputProps={{ readOnly: true }} />
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField fullWidth label="Date de paiement" type="date" value={paymentDetails.datepaie} onChange={e => updatePayment({ datepaie: e.target.value })} InputLabelProps={{ shrink: true }} size="small" required />
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField select fullWidth label="Mode de paiement" value={paymentDetails.modepaie} onChange={e => updatePayment({ modepaie: e.target.value })} size="small" required>
                        <MenuItem value="Espèce">Espèce</MenuItem>
                        <MenuItem value="Chèque">Chèque</MenuItem>
                      </TextField>
                    </Col>
                   <Col lg={6} className="mb-3">
                      <TextField
                        fullWidth
                        label="Montant à payer (Ar)"
                        type="number"
                        value={paymentDetails.montantpaie}
                        size="small"
                        onChange={(e) => {
                          const montant = Number(e.target.value);
                          const reste = paymentDetails.totalFrais - montant;

                          setPaymentDetails(prev => ({
                            ...prev,
                            montantpaie: montant,
                            reste: reste > 0 ? reste : 0, // empêche les valeurs négatives
                          }));
                        }}
                      />
                    </Col>

                  </Row>

                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>Sélection du / des Frais à Payer</Typography>
                  <Form.Select multiple value={paymentDetails.nomFrais} onChange={handleFraisChange}>
                    {listeFrais.map(f => <option key={f.idfrais} value={f.nomfrais}>{f.nomfrais}</option>)}
                  </Form.Select>

                  {paymentDetails.nomFrais.some(f => f.includes('Ecolage')) && (
                    <Box sx={{ mt: 3, border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Mois à payer :</Typography>
                      {monthOptions.map((month,i) => (
                        <FormControlLabel key={i} control={<Checkbox checked={paymentDetails.tuitionMonths.includes(month)} onChange={() => handleTuitionMonthCheck(month)} />} label={month} />
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 4 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <Button variant="contained" sx={buttonStyle('#f44336')} startIcon={<FaTimes />} onClick={resetForm}>Annuler</Button>
                    <Button variant="contained" type='submit' sx={buttonStyle('#4CAF50')} startIcon={<FaMoneyCheckAlt />}>Payer</Button>
                  </Box>
                </CardContent>
              </form>
            </Card>
          </Box>
        </Col>

        {/* TABLEAU DES PAIEMENTS */}
        <Col lg={7}>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 10,
                borderRadius: 1,
                height: '750px',
                overflow: 'auto',
              }}
            >
              <MuiTable stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {tableHeaders.map((col) => (
                      <TableCell
                        key={col.title}
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          textAlign: 'center',
                          borderBottom: '2px solid rgba(255,255,255,0.3)',
                          backgroundColor: 'primary.main',
                          width: col.width, // ✅ largeur appliquée
                          whiteSpace:
                            col.title === 'Frais Payés' ? 'normal' : 'nowrap',
                          wordWrap:
                            col.title === 'Frais Payés' ? 'break-word' : 'normal',
                        }}
                      >
                        {col.title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {listePaie.length > 0 ? (
                    listePaie.map((liste) => (
                      <TableRow key={liste.no_paie}>
                        <TableCell>{liste.no_paie}</TableCell>
                        <TableCell>{liste.matricule}</TableCell>
                        <TableCell>{liste.no_inscrit}</TableCell>
                        <TableCell>
                          <b>{liste.personne?.nom}</b> {liste.personne?.prenom}
                        </TableCell>
                        <TableCell>{liste.datepaie}</TableCell>
                        <TableCell>{liste.montantpaie}</TableCell>
                        <TableCell>{calculateReste(liste)}</TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                          }}
                        >
                          {Array.isArray(liste.frais_associes) &&
                          liste.frais_associes.length > 0
                            ? liste.frais_associes.map((f) => f.nomfrais).join(', ')
                            : 'Aucune'}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 1,
                              flexWrap: 'wrap', // ✅ évite débordement
                            }}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleSelectedPaie(liste)}
                              sx={{ textTransform: 'none', px: 1, py: 0.8 }}
                            >
                              <FaEdit style={{ marginRight: 2 }} /> Modifier
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ textTransform: 'none', px: 1, py: 0.8 }}
                              onClick={() => handleDeletePaie(liste.no_paie)}
                            >
                              <FaTrash style={{ marginRight: 2 }} /> Supprimer
                            </Button>
                            <Button
                              variant="contained"
                              sx={{ textTransform: 'none', px: 1, py: 0.8 }}
                              color="primary"
                              onClick={() => generateReceipt(liste)}
                            >
                              Reçu
                            </Button>

                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                        <FaBookOpen size={24} style={{ marginBottom: 10 }} />
                        <Typography variant="h6">
                          Aucune données trouvées !!!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Box>
        </Col>

      </Row>

      {/* MODAL DE MODIFICATION */}
      <Dialog open={modalPaie} onClose={closeModal}>
        <DialogTitle>Modification de Paiement</DialogTitle>
        <form onSubmit={handleEditPaie}>
          <DialogContent>
            <TextField fullWidth label="No. Matricule" value={paymentDetails.matricule} size="small" sx={{ mb: 3 }} disabled InputProps={{ readOnly: true }} />
            <TextField type="date" label="Date de Paiement" value={paymentDetails.datepaie} onChange={e => updatePayment({ datepaie: e.target.value })} fullWidth sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} required/>

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>Sélection du / des Frais à Modifier</Typography>
            <Form.Select multiple value={paymentDetails.nomFrais} onChange={handleFraisChange} style={{ marginBottom: 10 }}>
              {listeFrais.map(f => <option key={f.idfrais} value={f.nomfrais}>{f.nomfrais}</option>)}
            </Form.Select>

            {paymentDetails.nomFrais.some(f => f.includes('Ecolage')) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Mois à payer :</Typography>
                {monthOptions.map((month, i) => (
                  <FormControlLabel key={i} control={<Checkbox checked={paymentDetails.tuitionMonths.includes(month)} onChange={() => handleTuitionMonthCheck(month)} />} label={month} />
                ))}
              </Box>
            )}

            <TextField fullWidth type="number" label="Montant Payé (Ar)" value={paymentDetails.montantpaie} sx={{ mt: 3 }} disabled InputProps={{ readOnly: true }} />
            
            <TextField select fullWidth label="Mode de Paiement" value={paymentDetails.modepaie} onChange={e => updatePayment({ modepaie: e.target.value })} sx={{ mt: 3 }}>
              <MenuItem value="Espèce">Espèce</MenuItem>
              <MenuItem value="Chèque">Chèque</MenuItem>
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeModal} color="error">Annuler</Button>
            <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default PaymentPage;
