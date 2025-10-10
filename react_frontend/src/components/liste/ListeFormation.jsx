import React, { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, Typography, IconButton, Button, Card,
  Stack, TextField, InputAdornment, Fab, useMediaQuery, Chip
} from "@mui/material";
import { ArrowBack, Add, Search } from "@mui/icons-material";
import AffichageFormation from "../Formation/AffichageFormation";
import NouvellePersonne from "../modals/NouvellePersonne";
import ModificationInscription from "../modals/ModificationInscription";
import axios from "axios";

const ListeFormation = ({ onViewDashPro }) => {
  const [showPersonne, setShowPersonne] = useState(false);
  const [formationsData, setFormationsData] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateSearchActive, setIsDateSearchActive] = useState(false);

  const [showModification, setShowModification] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const Formations = ["Tous","Informatique","Langues","Musique","Coupe et Coutûre","Pâtisserie"];

  const openNewPersonne = () => setShowPersonne(true);
  const closeNewPersonne = () => setShowPersonne(false);

  const openModification = (personne) => {
    setSelectedPersonne(personne);
    setShowModification(true);
  };

  const closeModification = () => {
    setShowModification(false);
    setSelectedPersonne(null);
  };

  // 🟢 Charger toutes les données au démarrage
  useEffect(() => {
    handleFilter("Tous");
  }, []);

  // 🟢 Fonction principale de filtrage (backend)
  const handleFilter = async (nomformation) => {
    try {
      setActiveCategory(nomformation);
      const response = await axios.get(`http://127.0.0.1:8000/api/inscriptions/formation/${nomformation}`);
      
      setFormationsData(response.data);
      setFilteredFormations(response.data);
    } catch (err) {
      console.error("Erreur lors du filtrage :", err);
    }
  };

  // 🟡 Recherche entre deux dates
  const handleDateSearch = () => {
    if (!startDate && !endDate) {
      setIsDateSearchActive(false);
      setFilteredFormations(formationsData);
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert("La date de début ne peut pas être postérieure à la date de fin.");
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = formationsData.filter(f => {
      const dateInscrit = new Date(f.dateinscrit);
      const afterStart = start ? dateInscrit >= start : true;
      const beforeEnd = end ? dateInscrit <= end : true;
      return afterStart && beforeEnd;
    });

    setIsDateSearchActive(true);
    setFilteredFormations(filtered);
  };

  // 🔍 Filtrage par recherche texte
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredFormations(formationsData);
    } else {
      const lowerSearch = searchText.toLowerCase();
      const filtered = formationsData.filter(f =>
        Object.values(f).some(val =>
          val &&
          (typeof val === "string" || typeof val === "number") &&
          val.toString().toLowerCase().includes(lowerSearch)
        ) ||
        (f.personne &&
          Object.values(f.personne).some(val =>
            val &&
            (typeof val === "string" || typeof val === "number") &&
            val.toString().toLowerCase().includes(lowerSearch)
          )
        )
      );
      setFilteredFormations(filtered);
    }
  }, [searchText, formationsData]);

  // 🔄 Mise à jour locale après modification
  const handleUpdateList = (updatedPersonne) => {
    const updatedFormations = formationsData.map(f =>
      f.matricule === updatedPersonne.matricule ? updatedPersonne : f
    );
    setFormationsData(updatedFormations);

    // Re-filtrer selon recherche ou date active
    if (isDateSearchActive) {
      handleDateSearch();
    } else if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      const filtered = updatedFormations.filter(f =>
        Object.values(f).some(val =>
          val && (typeof val === "string" || typeof val === "number") &&
          val.toString().toLowerCase().includes(lowerSearch)
        ) ||
        (f.personne &&
          Object.values(f.personne).some(val =>
            val && (typeof val === "string" || typeof val === "number") &&
            val.toString().toLowerCase().includes(lowerSearch)
          )
        )
      );
      setFilteredFormations(filtered);
    } else {
      setFilteredFormations(updatedFormations);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* ==== HEADER ==== */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton color="primary" onClick={onViewDashPro}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            color="success.main"
            fontWeight="bold"
          >
            Liste des inscrits à la Formation Professionnelle
          </Typography>
          {!isMobile && (
            <Button
              variant="contained"
              color="primary"
              onClick={openNewPersonne}
              startIcon={<Add />}
              sx={{
                borderRadius: "40px",
                height: "50px",
                fontWeight: "bold",
                fontSize: "18px",
                textTransform: "none",
              }}
            >
              Nouvelle Inscription
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* ==== CONTENU ==== */}
      <Box sx={{ p: { xs: 2, md: 5 } }}>
        {/* === RECHERCHE ENTRE DEUX DATES === */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField 
            type="date" 
            label="Date de début" 
            InputLabelProps={{ shrink: true }} 
            sx={{ width: 250, m: 1 }}
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
          />
          <TextField 
            type="date" 
            label="Date de fin" 
            InputLabelProps={{ shrink: true }}  
            sx={{ width: 250, m: 1 }}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <Button  
            variant="contained" 
            sx={{ textTransform: 'none', marginTop: 1, height:50 }} 
            onClick={handleDateSearch}
          >
            Rechercher
          </Button>
          {isDateSearchActive && (
            <Button 
              variant="outlined" 
              color="error"
              sx={{ textTransform: 'none', marginTop: 1, height:50, ml: 2 }}
              onClick={() => {
                setStartDate(""); 
                setEndDate("");
                setIsDateSearchActive(false); 
                setFilteredFormations(formationsData);
              }}
            >
              Annuler
            </Button>
          )}
        </Box>

        {/* === FILTRES + BARRE DE RECHERCHE === */}
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", mb: 3, gap: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-start">
              {Formations.map(cat => (
                <Chip 
                  key={cat} 
                  label={cat}
                  onClick={() => handleFilter(cat)}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "200px",
                    fontSize: "18px",
                    height: "40px",
                    border: "1px solid",
                    borderColor: "primary.main",
                    transition: "all 0.3s ease",
                    bgcolor: activeCategory === cat ? "primary.main" : "transparent",
                    color: activeCategory === cat ? "#fff" : "primary.main",
                    transform: activeCategory === cat ? "scale(1.05)" : "scale(1)",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ))}
            </Stack>

            <TextField
              placeholder="Rechercher..."
              variant="outlined"
              size="small"
              sx={{ minWidth: isMobile ? "100%" : "250px" }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <AffichageFormation 
            formations={filteredFormations} 
            onEdit={openModification} // <-- passer la fonction d'ouverture modal
          />
        </Card>
      </Box>

      {isMobile && (
        <Fab color="primary" aria-label="add" onClick={openNewPersonne} sx={{ position: "fixed", bottom: 24, right: 24 }}>
          <Add />
        </Fab>
      )}

      <ModificationInscription
        show={showModification}
        handleClose={closeModification}
        personneData={selectedPersonne}
        refreshList={handleUpdateList} // mise à jour locale
      />
      <NouvellePersonne 
        show={showPersonne} 
        handleClose={closeNewPersonne} 
        refreshList={() => handleFilter(activeCategory)}  
      />
    </Box>
  );
};

export default ListeFormation;
