import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField, FormControlLabel, Checkbox, Button, MenuItem,
  Box, Divider, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Table as MuiTable
} from '@mui/material';
import { Col, Row, Form } from 'react-bootstrap';
import { FaEdit, FaMoneyCheckAlt, FaTimes, FaTrash, FaBookOpen } from 'react-icons/fa';
import axios from 'axios';

const monthOptions = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const url = 'http://localhost:8000/api';

function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState({
    no_paie: '',
    no_inscrit: '',
    matricule: '',
    idfrais: '',
    datepaie: '',
    modepaie: '',
    montantpaie: 0,
    nomFrais: [],
    tuitionMonths: [],
  });

  const [listeFrais, setlisteFrais] = useState([]);
  const [listepaie, setListepaie] = useState([]);

  const [listeInsc, setListInsc] = useState([]);
  const [listeMat, setListMat] = useState([]);

  useEffect(() => {
    const fetchInsc = async () => {
      try {
        const res = await axios.get(`${url}/inscriptions`);
        setListInsc(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des frais :", err);
      }
    };
    fetchInsc();
  }, []);

  useEffect(() => {
    const fetchMat = async () => {
      try {
        const res = await axios.get(`${url}/personnes`);
        setListMat(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des frais :", err);
      }
    };
    fetchMat();
  }, []);

  useEffect(() => {
    const fetchFrais = async () => {
      try {
        const res = await axios.get(`${url}/frais`);
        setlisteFrais(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des frais :", err);
      }
    };
    fetchFrais();
  }, []);

  const fetchPaie = async () =>{
    try{
      const res = await axios.get(`${url}/listepaiement`);
      setListepaie(res.data.data);
    }
    catch(err){
      console.error("Erreur losr de l'affichage",err);
    }
  }
  
  useEffect(() => {
    fetchPaie();
  },[]);

  useEffect(() => {
    let total = 0;

    paymentDetails.nomFrais.forEach((fraisNom) => {
      const frais = listeFrais.find(f => f.nomfrais === fraisNom);
      if (!frais) return;

      if (frais.nomfrais.includes('Ecolage')) {
        total += (frais.montant || 0) * paymentDetails.tuitionMonths.length;
      } else {
        total += frais.montant || 0;
      }
    });

    setPaymentDetails(prev => ({ ...prev, montantpaie: total }));
  }, [paymentDetails.nomFrais, paymentDetails.tuitionMonths, listeFrais]);

  // 🔁 Gestion des champs simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  // 🔁 Sélection / désélection des frais (multi-select)
  const handleFraisChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setPaymentDetails(prev => ({
      ...prev,
      nomFrais: selectedOptions,
      // Si on retire l’écolage, on vide les mois
      tuitionMonths: selectedOptions.some(f => f.includes('Ecolage')) ? prev.tuitionMonths : [],
    }));
  };

  // 🔁 Sélection / désélection des mois pour l’écolage
  const handleTuitionMonthCheck = (month) => {
    setPaymentDetails(prev => {
      const selected = prev.tuitionMonths.includes(month);
      const newMonths = selected
        ? prev.tuitionMonths.filter(m => m !== month)
        : [...prev.tuitionMonths, month];
      return { ...prev, tuitionMonths: newMonths };
    });
  };

   const handleSubmitPaie = async (e) => {
    e.preventDefault();

    const fraisSelectionne = listeFrais.find(f => f.nomfrais === paymentDetails.nomFrais[0]);
    const idfrais = fraisSelectionne ? fraisSelectionne.idfrais : null;

    const dataForm = {
      no_paie: paymentDetails.no_paie, 
      no_inscrit: paymentDetails.no_inscrit,
      idfrais: idfrais,
      matricule: paymentDetails.matricule,
      datepaie: paymentDetails.datepaie,
      modepaie: paymentDetails.modepaie,
      montantpaie: paymentDetails.montantpaie,
    };

    console.log("📤 Données envoyées :", dataForm);

    try {
      await axios.post(`${url}/addpaiement`, dataForm);
      alert("✅ Nouveau paiement ajouté avec succès !");

      fetchPaie();
      setPaymentDetails({
        no_paie: '', no_inscrit: '', matricule: '', idfrais: '', 
        datepaie: '', modepaie: '', montantpaie: 0, nomFrais: [], tuitionMonths: []
      });
    } catch (err) {
      console.error("Erreur:", err.response?.data || err.message);
      alert(`❌ Erreur : ${JSON.stringify(err.response?.data?.errors || err.message)}`);
    }
  };

  const handleDeletePaie = async () => {
    try{
      await axios.delete(`${url}/deletepaiement/`);
      alert("Suppression avec succès !!!");
    }
    catch(err){
      console.error("Erreur: ", err);
      alert("Erreur lors de la suppression !!!");
    }
  }

  const buttonStyle = (color) => ({
    padding: '10px 30px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'none',
    backgroundColor: color,
    '&:hover': { transform: 'translateY(-2px)', backgroundColor: color },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h2' align="center" sx={{ p: 3, fontWeight: 'bold', color: 'green', mb: 3 }}>
          Liste des Paiements effectués
      </Typography>

      <Row>
        <Col lg={5}>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', height: '820px', overflow: 'auto' }}>
            <Card sx={{ maxWidth: 900, width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
             <form onSubmit={handleSubmitPaie}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                    Formulaire de Paiement
                  </Typography>

                  <Row>
                    <Col lg={6} className='mb-3'>
                      <TextField fullWidth label="No. Paiement" name="no_paie" value={paymentDetails.no_paie} onChange={handleChange} size="small" required />
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField select fullWidth label="No. Inscription" name='no_inscrit' value={paymentDetails.no_inscrit} onChange={handleChange} size='small' required>
                        {listeInsc.length > 0 ? listeInsc.map(insc => (
                          <MenuItem key={insc.no_inscrit} value={insc.no_inscrit}>
                            {insc.no_inscrit}
                          </MenuItem>
                        )): (
                          <option>Aucune N°matricule selectionnée</option>
                        )}
                      </TextField>
                    </Col>
                    <Col lg={6} className='mb-3'>
                       <TextField select fullWidth label="No. Matricule" name="matricule" value={paymentDetails.matricule} onChange={handleChange} size="small" required>
                        {listeMat.length > 0 ? listeMat.map(mat => (
                          <MenuItem key={mat.matricule} value={mat.matricule}>
                            {mat.matricule}
                          </MenuItem>
                        )): (
                          <option>Aucune N°matricule selectionnée</option>
                        )}
                      </TextField>
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField select fullWidth label="No. Frais" name='idfrais' value={paymentDetails.idfrais} onChange={handleChange} size='small' required>
                        {listeFrais.length > 0 ? listeFrais.map(frais => (
                          <MenuItem key={frais.idfrais} value={frais.idfrais}>
                            {frais.idfrais}
                          </MenuItem>
                        )): (
                          <option>Aucune N°Frais selectionnée</option>
                        )}
                      </TextField>
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField fullWidth label="Date de paiement" name="datepaie" type="date" value={paymentDetails.datepaie} onChange={handleChange} InputLabelProps={{ shrink: true }} size="small" required />
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField select fullWidth label="Mode de paiement" name="modepaie" value={paymentDetails.modepaie} onChange={handleChange} size="small" required>
                        <MenuItem value="Espèce" >Espèce</MenuItem>
                        <MenuItem value="Chèque" >Chèque</MenuItem>
                      </TextField>
                    </Col>
                    <Col lg={6} className='mb-3'>
                      <TextField fullWidth label="Montant à payer (Ar)" name="montantpaie" type="number" value={paymentDetails.montantpaie} onChange={handleChange} size="small" disabled />
                    </Col>
                  </Row>

                  <Divider sx={{ my: 3 }} />
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Sélection du / des Frais à Payer
                    </Typography>
                    <Form.Select multiple value={paymentDetails.nomFrais} onChange={handleFraisChange}>
                      {listeFrais.map((frais) => (
                        <option key={frais.idfrais} value={frais.nomfrais}>
                          {frais.nomfrais}
                        </option>
                      ))}
                    </Form.Select>

                    {paymentDetails.nomFrais.some(f => f.includes('Ecolage')) && (
                      <Box sx={{ mt: 3, border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Mois à payer :
                        </Typography>
                        {monthOptions.map((month, i) => (
                          <FormControlLabel
                            key={i} control={
                              <Checkbox checked={paymentDetails.tuitionMonths.includes(month)} onChange={() => handleTuitionMonthCheck(month)}/>
                            }
                            label={month}
                          />
                        ))}
                      </Box>
                    )}
                  <Divider sx={{ my: 4 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <Button variant="contained" sx={buttonStyle('#f44336')} startIcon={<FaTimes />}>
                      Annuler
                    </Button>
                    <Button variant="contained" type='submit' sx={buttonStyle('#4CAF50')} startIcon={<FaMoneyCheckAlt />}>
                      Payer
                    </Button>
                  </Box>
                </CardContent>
             </form>
            </Card>
          </Box>
        </Col>

        <Col lg={7}>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 10, borderRadius: 1, height: '750px', overflow: 'auto' }}>
              <MuiTable stickyHeader>
              <TableHead>
                <TableRow sx={{ position: 'sticky', top: 0,zIndex: 2, bgcolor: 'primary.main'}} >
                  {[ 'N° Paiement','N° Matricule', 'N° Inscription', 'Nom et Prénom', 'Date de Paiement', 'Montant Payé', 'Reste', 'Frais Payés','Actions',
                  ].map((title) => (
                    <TableCell key={title} sx={{ color: 'white', fontWeight: 600, textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.3)',backgroundColor: 'primary.main'}}>
                      {title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

                <TableBody>
                  {listepaie.length > 0 ? listepaie.map((liste) => (
                    <TableRow key={liste.no_paie}>
                      <TableCell>{liste.no_paie}</TableCell>
                      <TableCell>{liste.matricule}</TableCell>
                      <TableCell>{liste.no_inscrit}</TableCell>
                      <TableCell><b>{liste.personne?.nom}</b> {liste.personne?.prenom}</TableCell>
                      <TableCell>{liste.datepaie}</TableCell>
                      <TableCell>{liste.montantpaie}</TableCell>
                      <TableCell>0 Ar</TableCell>
                      <TableCell>{liste.frais?.nomfrais || "Aucune"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                          <Button variant="contained" color="success" sx={{textTransform: 'none', px: 1, py: 0.8,}}>
                            <FaEdit style={{ marginRight: 2 }} /> Modifier
                          </Button>

                          <Button variant="contained" color="error" sx={{ textTransform: 'none', px: 1, py: 0.8}}>
                            <FaTrash style={{ marginRight: 2 }} /> Supprimer
                          </Button>
                          <Button variant="contained" color="primary" sx={{ textTransform: 'none', px: 1, py: 0.8}}>
                            <FaTrash style={{ marginRight: 2 }} /> Reçu
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    )) 
                    :(
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                            <FaBookOpen size={24} style={{ marginBottom: 10 }} />
                            <Typography variant="h6">Aucune données trouvées !!!</Typography>
                          </TableCell>
                        </TableRow>
                    )}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Box>
        </Col>
      </Row>
    </Box>
  );
}

export default PaymentPage;
