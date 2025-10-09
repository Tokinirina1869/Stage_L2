import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Box,
  Divider,
} from '@mui/material';

// --- Configuration et Données ---

const academicFees = [
  'Droit d\'inscrit',
  'Frais generaux',
  'VRM',
  'Tenue de fete',
  'Tenue de sport',
  'Blouse',
];

const monthOptions = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

// --- Composant Principal ---

const PaymentPage = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    paymentNo: '',
    inscriptionNo: '',
    matriculeNo: '',
    paymentDate: '',
    paymentMode: '',
    amountToPay: '',
    feeType: 'Academique', // 'Academique' or 'Formation'
    academicChecks: [],
    formationMonths: [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFeeTypeChange = (event) => {
    const newFeeType = event.target.value;
    setPaymentDetails(prev => ({
      ...prev,
      feeType: newFeeType,
      // Reset checks when switching main type
      academicChecks: [],
      formationMonths: [],
    }));
  };

  const handleAcademicCheck = (fee) => {
    setPaymentDetails(prev => {
      const { academicChecks } = prev;
      const newChecks = academicChecks.includes(fee)
        ? academicChecks.filter(item => item !== fee)
        : [...academicChecks, fee];
      return { ...prev, academicChecks: newChecks };
    });
  };

  const handleFormationMonthCheck = (month) => {
    setPaymentDetails(prev => {
      const { formationMonths } = prev;
      const newChecks = formationMonths.includes(month)
        ? formationMonths.filter(item => item !== month)
        : [...formationMonths, month];
      return { ...prev, formationMonths: newChecks };
    });
  };

  const handleSubmit = (type) => {
    if (type === 'Payer') {
      console.log('Paiement soumis:', paymentDetails);
      alert("Paiement soumis ! Vérifiez la console pour les détails.");
      // Ici, vous enverriez les données à votre API
    } else {
      console.log('Annulation');
      alert("Annulation du formulaire.");
      setPaymentDetails({
        paymentNo: '',
        inscriptionNo: '',
        matriculeNo: '',
        paymentDate: '',
        paymentMode: '',
        amountToPay: '',
        feeType: 'Academique',
        academicChecks: [],
        formationMonths: [],
      });
    }
  };

  // Style personnalisé pour les boutons
  const buttonStyle = (color) => ({
    padding: '10px 30px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
    }
  });

  return (
    <Box sx={{
      p: 4,
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card sx={{ maxWidth: 850, width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <CardContent>
          {/* Titre du Formulaire */}
          <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
            Formulaire de Paiement
          </Typography>

          {/* Section 1: Informations de base (No., Date, Montant) */}
          <Grid container spacing={3}>
            {/* Colonne Gauche */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="No. Paiement"
                name="paymentNo"
                value={paymentDetails.paymentNo}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="No. Inscription"
                name="inscriptionNo"
                value={paymentDetails.inscriptionNo}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="No. Matricule"
                name="matriculeNo"
                value={paymentDetails.matriculeNo}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Colonne Droite */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de paiement"
                name="paymentDate"
                type="date"
                value={paymentDetails.paymentDate}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Mode de paiement"
                name="paymentMode"
                value={paymentDetails.paymentMode}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="Montant à payer (Ar)"
                name="amountToPay"
                type="number"
                value={paymentDetails.amountToPay}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Frais à payer (Radio/Checkbox) */}
          <Typography variant="subtitle1" component="div" sx={{ mb: 2, fontWeight: 500 }}>
            Frais à payer
          </Typography>

          <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 3, backgroundColor: '#f9f9f9' }}>
            <Grid container spacing={3}>
              {/* Type de Frais (Radio buttons) */}
              <Grid item xs={12} sm={4}>
                <RadioGroup
                  name="feeType"
                  value={paymentDetails.feeType}
                  onChange={handleFeeTypeChange}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  <FormControlLabel
                    value="Academique"
                    control={<Radio size="small" />}
                    label="Academique"
                  />
                  <FormControlLabel
                    value="Formation"
                    control={<Radio size="small" />}
                    label="Formation"
                  />
                </RadioGroup>
              </Grid>

              {/* Checkboxes Gauche (Frais Académiques) */}
              <Grid item xs={12} sm={4} sx={{ borderLeft: { sm: '1px solid #eee' }, pl: { sm: 3 } }}>
                {paymentDetails.feeType === 'Academique' && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#555' }}>Frais Académiques</Typography>
                    {academicFees.map((fee) => (
                      <FormControlLabel
                        key={fee}
                        control={
                          <Checkbox
                            size="small"
                            checked={paymentDetails.academicChecks.includes(fee)}
                            onChange={() => handleAcademicCheck(fee)}
                            disabled={paymentDetails.feeType !== 'Academique'}
                          />
                        }
                        label={fee}
                      />
                    ))}
                  </>
                )}
              </Grid>

              {/* Checkboxes Droite (Mois de Formation) */}
              <Grid item xs={12} sm={4} sx={{ borderLeft: { sm: '1px solid #eee' }, pl: { sm: 3 } }}>
                {paymentDetails.feeType === 'Formation' && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#555' }}>Mois de Formation</Typography>
                    <Grid container>
                      {monthOptions.map((month) => (
                        <Grid item xs={6} key={month}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={paymentDetails.formationMonths.includes(month)}
                                onChange={() => handleFormationMonthCheck(month)}
                                disabled={paymentDetails.feeType !== 'Formation'}
                                sx={{ py: 0 }}
                              />
                            }
                            label={month}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Grid>

            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Button
              variant="contained"
              sx={buttonStyle('#f44336')}
              onClick={() => handleSubmit('Annuler')}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              sx={buttonStyle('#4CAF50')}
              onClick={() => handleSubmit('Payer')}
            >
              Payer
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentPage;
