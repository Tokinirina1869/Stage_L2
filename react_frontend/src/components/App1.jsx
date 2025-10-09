import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert 
} from '@mui/material';

/**
 * Composant de Formulaire de Contact simple utilisant react-hook-form et Material UI.
 */
function ContactForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting, isSubmitSuccessful }, 
    reset 
  } = useForm({
    defaultValues: {
      nom: "",
      email: "",
      message: ""
    }
  });

  // Fonction appelée lors de la soumission du formulaire, uniquement si la validation réussit
  const onSubmit = async (data) => {
    console.log("Données soumises:", data);
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Réinitialiser le formulaire après succès
    reset(); 
  };

  return (
    // Utilisation des composants MUI pour le layout
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Contactez-nous
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Veuillez remplir le formulaire pour nous envoyer votre message.
          </Typography>
        </Box>

        {/* Message de succès après soumission */}
        {isSubmitSuccessful && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Merci! Votre message a été envoyé avec succès.
          </Alert>
        )}

        {/* Le formulaire utilise la balise Box pour l'enveloppement */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Champ Nom */}
          <TextField
            fullWidth
            label="Nom Complet"
            placeholder="Entrez votre nom"
            variant="outlined"
            // RHF integration
            {...register("nom", {
              required: "Le nom est obligatoire.",
              minLength: { value: 3, message: "Le nom doit avoir au moins 3 caractères." }
            })}
            // MUI error handling
            error={!!errors.nom}
            helperText={errors.nom ? errors.nom.message : ''}
          />

          {/* Champ Email */}
          <TextField
            fullWidth
            label="Email"
            placeholder="Entrez votre email"
            variant="outlined"
            type="email"
            {...register("email", {
              required: "L'email est obligatoire.",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Format d'email invalide."
              }
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />

          {/* Champ Message */}
          <TextField
            fullWidth
            label="Message"
            placeholder="Écrivez votre message ici..."
            variant="outlined"
            multiline
            rows={4}
            {...register("message", {
              required: "Le message est obligatoire.",
              minLength: { value: 10, message: "Le message doit contenir au moins 10 caractères." }
            })}
            error={!!errors.message}
            helperText={errors.message ? errors.message.message : ''}
          />

          {/* Bouton de Soumission */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            disabled={isSubmitting}
            sx={{ py: 1.5, borderRadius: 50, mt: 2 }} // Style pour le bouton arrondi et espacement
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ContactForm;
