import React, { useState } from 'react';
import { FaEdit, FaFilePdf, FaMoneyCheckAlt, FaTimes, FaTrash } from 'react-icons/fa';
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
  Divider, TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@mui/material';
import { Table } from 'react-bootstrap';


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



function PaymentPage() {

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
    const buttonStyle = () => ({
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
  const [showForm, setShowForm] = useState(false);

  return (
    <Box sx={{ p: 3}}>
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <h2 className="p-3 fw-bold text-success text-center mb-3">
                Liste de Paiement de droit d'inscription
            </h2>
            <button className="btn btn-outline-primary responsive-text" onClick={() => setShowForm( !showForm )}>
                { 
                    showForm ? <><FaTimes size={25} className='mx-1' /> Fermer</> :<><FaMoneyCheckAlt size={25} className="mx-1" /> Nouveau Paiement</> 
                }
            </button>
        </div>

        {showForm && (
           <Box size='xl' centered sx={{
                 p: 4,
                 backgroundColor: '#f4f6f8',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center'
               }}>
                 <Card  size='xl' centered sx={{ maxWidth: 900, width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                   <CardContent>
                     <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                       Formulaire de Paiement
                     </Typography>
           
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={4}>
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
                        </Grid>
                        <Grid>
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
                        </Grid>
                        <Grid>
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
                         </Grid>
                         <Grid>
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
                        </Grid>
                        <Grid>
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
        )}

        <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 1}}>
          <Table sx={{ mminWidth:1000 }} >
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell> N° Paiement </TableCell>
                <TableCell> N° Inscription </TableCell>
                <TableCell> Nom et Prénom </TableCell>
                <TableCell> Date de Paiement</TableCell>
                <TableCell> Montant à payer</TableCell>
                <TableCell> Reste</TableCell>
                <TableCell> Ecolage et Frais Payé</TableCell>
                <TableCell> Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                    <TableCell>PE0002</TableCell>
                    <TableCell>1869H-F</TableCell>
                    <TableCell>Tokinirina Jean Robert</TableCell>
                    <TableCell>26/09/2025</TableCell>
                    <TableCell>74 000ar</TableCell>
                    <TableCell>0ar</TableCell>
                    <TableCell>Septembre, Octobre</TableCell>
                    <TableCell>
                      <button type="button" className="btn btn-sm btn-outline-primary mx-2">
                        <FaEdit size={18} /> Modifer
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger mx-2">
                        <FaTrash size={18} /> Supprimer
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-success mx-2">
                        <FaFilePdf size={18} /> Exporter PDF
                      </button>
                    </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}

export default PaymentPage;
