import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1250,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflowY: "auto",
};

const NouvellePersonne = ({ show, handleClose }) => {
  const today = new Date().toISOString().split("T")[0];
  const [profileImage, setProfileImage] = useState(
    "https://placehold.co/128x128/FFFFFF/000000?text=Photo"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    naiss: "",
    sexe: "",
    adresse: "",
    cin: "",
    nompere: "",
    nommere: "",
    nomtuteur: "",
    adressparent: "",
    adresstuteur: "",
    phoneparent: "",
    phonetuteur: "",
    dateinscrit: "",
    anneesco: "",
    duree: "",
    type_formation: "Court Terme",
    datedebut: "",
    nomformation: [],
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    if (name === "cin" && !/^\d{12}$/.test(value))
      error = "Le CIN doit contenir exactement 12 chiffres.";
    if ((name === "phoneparent" || name === "phonetuteur") && !/^\d{10}$/.test(value))
      error = "Le numéro doit contenir exactement 10 chiffres.";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleChoixFormation = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      nomformation: checked
        ? [...prev.nomformation, value]
        : prev.nomformation.filter((f) => f !== value),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const schoolYears = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      schoolYears.push(`${annee}-${annee + 1}`);
    }
    return schoolYears;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((err) => err);
    if (hasError) {
      alert("Veuillez corriger les erreurs dans le formulaire ❌");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) formData.append(key, value.join(","));
        else formData.append(key, value);
      });
      if (selectedFile) formData.append("photo", selectedFile);

      await axios.post("http://localhost:8000/api/inscriptionComplete", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Inscription complète réussie !");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription ❌");
    }
  };

  return (
    <Modal open={show} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          mb={3}
        >
          Inscription Complète au CFP
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Profil */}
          <Box textAlign="center" mb={3}>
            <Avatar
              src={profileImage}
              sx={{
                width: 120,
                height: 120,
                margin: "auto",
                border: "3px solid #1976d2",
              }}
            />
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Sélectionner une photo
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
          </Box>

          {/* Informations Personnelles */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              textAlign="center"
              mb={2}
            >
              Informations Personnelles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Nom"
                  name="nom"
                  fullWidth
                  required
                  value={form.nom}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Prénom"
                  name="prenom"
                  fullWidth
                  required
                  value={form.prenom}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Date de Naissance"
                  name="naiss"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: today }}
                  value={form.naiss}
                  onChange={handleChange}
                />
              </Grid>

              {/* Sexe élargi */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sexe</InputLabel>
                  <Select
                    name="sexe"
                    value={form.sexe}
                    onChange={handleChange}
                    label="Sexe"
                  >
                    <MenuItem value="Masculin">Masculin</MenuItem>
                    <MenuItem value="Feminin">Féminin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Adresse"
                  name="adresse"
                  fullWidth
                  value={form.adresse}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="CIN"
                  name="cin"
                  fullWidth
                  required
                  value={form.cin}
                  onChange={handleChange}
                  error={!!errors.cin}
                  helperText={errors.cin}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Nom Père"
                  name="nompere"
                  fullWidth
                  value={form.nompere}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Nom Mère"
                  name="nommere"
                  fullWidth
                  value={form.nommere}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Nom Tuteur"
                  name="nomtuteur"
                  fullWidth
                  value={form.nomtuteur}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Adresse Parents"
                  name="adressparent"
                  fullWidth
                  value={form.adressparent}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Adresse Tuteur"
                  name="adresstuteur"
                  fullWidth
                  value={form.adresstuteur}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Téléphone Parent"
                  name="phoneparent"
                  fullWidth
                  required
                  value={form.phoneparent}
                  onChange={handleChange}
                  error={!!errors.phoneparent}
                  helperText={errors.phoneparent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Téléphone Tuteur"
                  name="phonetuteur"
                  fullWidth
                  required
                  value={form.phonetuteur}
                  onChange={handleChange}
                  error={!!errors.phonetuteur}
                  helperText={errors.phonetuteur}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Inscription */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              textAlign="center"
              mb={2}
            >
              Nouvelle Inscription
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date Inscription"
                  name="dateinscrit"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: today }}
                  value={form.dateinscrit}
                  onChange={handleChange}
                />
              </Grid>

              {/* Année scolaire élargie */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Année Scolaire</InputLabel>
                  <Select
                    name="anneesco"
                    value={form.anneesco}
                    onChange={handleChange}
                    label="Année Scolaire"
                  >
                    {generateAnnee().map((annee, i) => (
                      <MenuItem key={i} value={annee}>
                        {annee}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Formation */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              textAlign="center"
              mb={2}
            >
              Formation / Parcours
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Durée (mois)"
                  name="duree"
                  fullWidth
                  required
                  value={form.duree}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Type Formation</InputLabel>
                  <Select
                    name="type_formation"
                    value={form.type_formation}
                    onChange={handleChange}
                  >
                    <MenuItem value="Court Terme">Court Terme</MenuItem>
                    <MenuItem value="Long Terme">Long Terme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Date Début Formation"
                  name="datedebut"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: today }}
                  value={form.datedebut}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              textAlign="center"
              fontWeight="bold"
              mb={1}
            >
              Cochez au moins une formation
            </Typography>

            <FormGroup row sx={{ justifyContent: "center" }}>
              {["Informatique", "Musique", "Langues", "Coupe et Coutûre", "Pâtisserie"].map(
                (formation) => (
                  <FormControlLabel
                    key={formation}
                    control={
                      <Checkbox
                        value={formation}
                        checked={form.nomformation.includes(formation)}
                        onChange={handleChoixFormation}
                      />
                    }
                    label={formation}
                  />
                )
              )}
            </FormGroup>
          </Paper>

          {/* Boutons */}
          <Box textAlign="center" mt={3}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              sx={{ mx: 2, width: 150 }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mx: 2, width: 150 }}
            >
              S'inscrire
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default NouvellePersonne;
