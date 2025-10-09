import React, { useState } from 'react';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup'; 
import { Box, TextField, Button, Typography, Container, Alert, Paper } from '@mui/material';

// 1. Définition du Schéma de Validation avec Yup
const validationSchema = yup.object({
  nom: yup
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est obligatoire'),
  email: yup
    .string()
    .email('Entrez une adresse email valide')
    .required("L'email est obligatoire"),
  message: yup
    .string()
    .min(10, 'Le message est trop court (min 10 caractères)')
    .required('Le message est obligatoire'),
});

/**
 * Composant de formulaire de contact utilisant Formik et Yup pour la validation.
 */
function FomikYupForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Initialisation de Formik avec useFormik
  const formik = useFormik({
    initialValues: {
      nom: '',
      email: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      // Simuler l'envoi de données (remplacez par votre appel API Laravel)
      console.log('Données soumises :', values);
      
      // Réinitialiser le formulaire et afficher le message de succès
      setTimeout(() => {
        setSubmitting(false);
        setIsSubmitted(true);
        resetForm(); 
        
        // Cacher l'alerte après 3 secondes
        setTimeout(() => setIsSubmitted(false), 3000);
      }, 1000);
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Formulaire de Contact (Formik & Yup)
        </Typography>

        {/* Afficher l'alerte de succès après soumission */}
        {isSubmitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Votre message a été envoyé avec succès !
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={formik.handleSubmit} 
          noValidate 
          sx={{ mt: 1 }}
        >
          {/* Champ Nom */}
          <TextField
            fullWidth
            id="nom"
            name="nom"
            label="Nom"
            margin="normal"
            // Valeur et gestion des changements
            value={formik.values.nom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // Important pour la validation au clic
            // Gestion des erreurs
            error={formik.touched.nom && Boolean(formik.errors.nom)}
            helperText={formik.touched.nom && formik.errors.nom}
          />

          {/* Champ Email */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* Champ Message */}
          <TextField
            fullWidth
            id="message"
            name="message"
            label="Message"
            multiline
            rows={4}
            margin="normal"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
          />

          {/* Bouton de Soumission */}
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Envoi...' : 'Envoyer'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default FomikYupForm;
