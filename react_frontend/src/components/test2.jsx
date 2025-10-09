import React from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button 
} from '@mui/material';

// 1. Définition des colonnes (utilisée pour l'en-tête)
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nom', headerName: 'Nom Complet', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Rôle', width: 150 },
  { field: 'age', headerName: 'Âge', width: 110 },
  { field: 'action', headerName: 'Action', width: 160 },
];

// Liste des champs à afficher dans les cellules du tableau
const columnFields = ['id', 'nom', 'email', 'role', 'age'];

// 2. Données factices (simulons plus de 5 lignes pour tester le défilement)
const rows = [
  { id: 1, nom: 'Jean Dupont', email: 'jean.dupont@exemple.com', role: 'Administrateur', age: 35 },
  { id: 2, nom: 'Marie Curie', email: 'marie.curie@exemple.com', role: 'Éditeur', age: 42 },
  { id: 3, nom: 'Pierre Richard', email: 'pierre.richard@exemple.com', role: 'Utilisateur', age: 28 },
  { id: 4, nom: 'Sophie Martin', email: 'sophie.martin@exemple.com', role: 'Utilisateur', age: 51 },
  { id: 5, nom: 'Marc Durand', email: 'marc.durand@exemple.com', role: 'Administrateur', age: 31 },
  { id: 6, nom: 'Lucie Moreau', email: 'lucie.moreau@exemple.com', role: 'Utilisateur', age: 24 },
  { id: 7, nom: 'Alain Lefevre', email: 'alain.lefevre@exemple.com', role: 'Administrateur', age: 45 },
  { id: 8, nom: 'Nadia Dubois', email: 'nadia.dubois@exemple.com', role: 'Éditeur', age: 33 },
  { id: 9, nom: 'Hugo Petit', email: 'hugo.petit@exemple.com', role: 'Utilisateur', age: 29 },
  { id: 10, nom: 'Emma Garcia', email: 'emma.garcia@exemple.com', role: 'Utilisateur', age: 38 },
];

/**
 * Composant affichant un tableau de données utilisant les composants MUI Table standards.
 */
function DataDisplayTable1() {
  return (
    <Box sx={{ p: 3, maxWidth: '900px', margin: '0 auto' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Liste des Utilisateurs
      </Typography>
      
      {/* TableContainer pour le défilement et Paper pour le style.
        maxHeight: '350px' -> Définit la hauteur maximale du corps du tableau.
        Le défilement (scroll) s'active automatiquement si le contenu dépasse 350px.
      */}
      <TableContainer 
        component={Paper} 
        sx={{ boxShadow: 5, borderRadius: 2, maxHeight: 350 }} 
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="tableau de données simple">
          
          {/* En-tête du tableau (reste visible si l'option stickyHeader est activée) */}
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.field} 
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          {/* Corps du tableau */}
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                // Ajoute un effet visuel au survol
                hover
                // Style pour les dernières lignes
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                
                {/* Affichage des données (ID, Nom, Email, Rôle, Âge) */}
                {columnFields.map((field) => (
                  <TableCell key={field}>
                    {row[field]}
                  </TableCell>
                ))}

                {/* Cellule d'Action (bouton Modifier) */}
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="primary"
                    onClick={() => console.log('Modifier:', row)}
                  >
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DataDisplayTable1;
