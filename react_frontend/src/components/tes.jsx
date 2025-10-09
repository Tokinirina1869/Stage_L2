import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Icône d'accueil

/**
 * Composant de Barre de Navigation en haut utilisant Material UI (AppBar).
 */
function TopNavBar() {
  // Liste des liens de navigation
  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Liste', path: '/liste' },
    { label: 'Formulaire', path: '/formulaire' },
    { label: 'À Propos', path: '/a-propos' },
  ];

  // Fonction factice pour la navigation (remplacez par react-router-dom si utilisé)
  const handleNavigation = (path) => {
    console.log(`Navigation vers: ${path}`);
    // Ici, vous utiliseriez navigate(path) de react-router-dom
  };

  return (
    // AppBar est le composant de barre de navigation principal
    <AppBar position="sticky" elevation={4} sx={{ p:2, borderRadius:1 }} >
      <Toolbar>
        
        {/* Titre de l'application (aligné à gauche) */}
        <Typography variant="h6" component="div" 
          sx={{ 
            display: { xs: 'none', sm: 'block' }, // Caché sur mobile, visible sur desktop
            cursor: 'pointer' 
          }} onClick={() => handleNavigation('/')} >
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Mon Application
        </Typography>

        {/* Box pour pousser les liens à droite */}
        <Box sx={{ flexGrow: 1 }} /> 

        {/* Liens de Navigation (alignés à droite) */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            <Button key={item.label} sx={{ color: '#fff', mx: 1 }} onClick={() => handleNavigation(item.path)}>
              {item.label}
            </Button>
          ))}
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default TopNavBar;
