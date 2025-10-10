import React, { useState,useEffect } from 'react';
import { Container, Row, Col, Button, Card, Table, Form } from 'react-bootstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';

function SchoolDashboard({retourDash}) {
  const [parcours, setParcours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [frais, setFrais] = useState([]);
  const [code_formation, setCode_formation] = useState("");
  const [datedebut, setDatedebut] = useState("");
  const [nomformation, setNomformation] = useState("");
  
  const [code_niveau, setCode_niveau] = useState('');
  const [nomniveau, setNomniveau] = useState('');
  const [openNiveau, setOpenNiveau] = useState(false);
  const [openParcours, setOpenParcours] = useState(false);
  const [openFrais, setOpenFrais] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/parcours")
    .then(res => {
      setParcours(res.data);
    })
    .catch(err => {
      console.error("Erreur: ", err);
    })
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/niveau")
    .then(res => {
      console.log(res.data); 
      setNiveaux(res.data.data);
    })
    .catch(err => {
      console.error("Erreur: ", err);
    })
  },[]);

   useEffect(() => {
    axios.get("http://localhost:8000/api/frais")
    .then(res => {
      setFrais(res.data);
    })
    .catch(err => {
      console.error("Erreur: ", err);
    })
  },[]);

  const handleOpenNiveau = () => setOpenNiveau(true);
  const handleCloseNiveau = () => setOpenNiveau(false);
  // PARCOURS Handlers
  const handleOpenParcours = () => setOpenParcours(true);
  const handleCloseParcours = () => setOpenParcours(false);

  // FRAIS Handlers
  const handleOpenFrais = () => setOpenFrais(true);
  const handleCloseFrais = () => setOpenFrais(false);
  const handleAddFrais = () => {
      // Logique d'ajout réel ici.
      console.log("Ajout d'un frais simulé");
      handleCloseFrais();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Petite validation côté frontend
    if (!code_niveau.trim() || !nomniveau.trim()) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/niveaux", {
        code_niveau,
        nomniveau,
      });

      if (response.status === 201 || response.status === 200) {
        alert("✅ Niveau ajouté avec succès !");
        
        // Vide les champs
        setCode_niveau("");
        setNomniveau("");
        
        // Ferme la fenêtre
        handleCloseNiveau();

        // Rafraîchit la liste des niveaux
        const res = await axios.get("http://localhost:8000/api/niveau");
        setNiveaux(res.data.data);
      }
    } catch (error) {
      console.error("Erreur Axios :", error);

      if (error.response) {
        // Laravel renvoie souvent une erreur 422 si la validation échoue
        if (error.response.status === 422) {
          const msg = error.response.data.errors?.code_niveau
            ? "❌ Ce code niveau existe déjà ou est invalide !"
            : "❌ Données invalides. Vérifiez vos champs.";
          alert(msg);
        } else if (error.response.status === 500) {
          alert("Erreur interne du serveur (500)");
        } else {
          alert(`Erreur : ${error.response.statusText}`);
        }
      } else {
        alert("Erreur de connexion au serveur Laravel !");
      }
    }
  };


    return (
        // Utilisation de classes de Tailwind/Bootstrap pour le style
        <Container fluid className="p-4 bg-light min-vh-100">
            <IconButton color='primary' sx={{ background: "blue" }} onClick={retourDash}>
              <ArrowBack sx={{ color: "white", fontSize:"30px", fontWeight:'bold' }}/>
            </IconButton>
            <h1 className="mb-5 text-center text-primary fw-bold">Tableau de Bord de l'Établissement</h1>

            <Row>
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm border-0">
                        <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center fw-bold">
                            Liste des Niveaux Existants
                            <Button variant="light" size="sm" onClick={handleOpenNiveau}>
                                ➕ Ajouter un Niveau
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive size="sm" className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Code Niveau</th>
                                        <th>Nom Niveau</th>
                                        <th>Effectif</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { niveaux.length > 0 ? niveaux.map((niveaux) => (
                                        <tr key={niveaux.code_niveau}>
                                            <td>{niveaux.code_niveau}</td>
                                            <td>{niveaux.code_niveau}</td>
                                            <td>{niveaux.nomniveau}</td>
                                            <td>
                                              <button className="btn btn-primary mx-1">
                                                <FaEdit className='mx-1'/>Modifier
                                              </button>
                                              <button className="btn btn-danger mx-1">
                                                <FaTrash className='mx-1'/>Supprimer
                                              </button>
                                            </td>
                                        </tr>
                                    )):
                                    (
                                      <tr>
                                        <td colSpan="4" className="text-center text-danger">Aucun résultat trouvé !!!</td>
                                      </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm border-0">
                        <Card.Header as="h5" className="bg-info text-white d-flex justify-content-between align-items-center fw-bold">
                            Liste des Frais à Payer
                            <Button variant="light" size="sm" onClick={handleOpenFrais}>
                                ➕ Ajouter un Frais
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive size="sm" className="mb-0">
                                <thead>
                                    <tr>
                                        <th>ID Frais</th>
                                        <th>Nom du Frais</th>
                                        <th>Montant ($)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { frais.length >0 ? frais.map((frais) => (
                                        <tr key={frais.idfrais}>
                                            <td>{frais.idfrais}</td>
                                            <td>{frais.nomfrais}</td>
                                            <td>{frais.montant}</td>
                                            <td>
                                              <button className="btn btn-primary mx-1">
                                                <FaEdit className='mx-1'/>Modifier
                                              </button>
                                              <button className="btn btn-danger mx-1">
                                                <FaTrash className='mx-1'/>Supprimer
                                              </button>
                                            </td>
                                        </tr>
                                    )) :(
                                      <tr>
                                        <td colSpan="4" className="text-center text-danger">
                                          Aucun données trouvé !!!
                                        </td>
                                      </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
              </Row>
              
              <Row>
                <Col lg={12} className="mb-4">
                    <Card className="shadow-sm border-0"> 
                        <Card.Header as="h5" className="bg-success text-white d-flex justify-content-between align-items-center fw-bold">
                            Liste des Parcours Existants
                            <Button variant="light" size="sm" onClick={handleOpenParcours}>
                                ➕ Ajouter un Parcours
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive size="sm" className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Code Parcours</th>
                                        <th>Nom Parcours</th>
                                        <th>Date Début</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { parcours.length > 0 ? parcours.map((parcours) => (
                                        <tr key={parcours.code_formation}>
                                            <td>{parcours.code_formation}</td>
                                            <td>{parcours.nomformation}</td>
                                            <td>{parcours.datedebut}</td>
                                            <td>
                                              <button className="btn btn-primary mx-1">
                                                <FaEdit className='mx-1'/>Modifier
                                              </button>
                                              <button className="btn btn-danger mx-1">
                                                <FaTrash className='mx-1'/>Supprimer
                                              </button>
                                            </td>
                                        </tr>
                                    )):
                                    (
                                      <tr>
                                        <td colSpan="4" className='text-center text-danger'>Aucun données trouvé !!!</td>
                                      </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            {/* Popup pour Ajouter un Niveau (codeniveau, nomniveau, effectif) */}
            <Dialog open={openNiveau} onClose={handleCloseNiveau}>
                <DialogTitle>Ajouter un Nouveau Niveau</DialogTitle>
                <form onSubmit={handleSubmit}>
                  <DialogContent>
                    <TextField
                        autoFocus value={code_niveau} onChange={e => setCode_niveau(e.target.value)}
                        margin="dense"
                        label="Code Niveau (Ex: L1, M2)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ mb: 2 }} // Marge Bottom MUI
                    />
                    <TextField
                        margin="dense" value={nomniveau} onChange={e => setNomniveau(e.target.value)}
                        label="Nom Niveau (Ex: Licence 1, Master 2)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ mb: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleCloseNiveau} variant="secondary">Annuler</Button>
                      <Button type='submit' variant="primary">Ajouter</Button>
                  </DialogActions>
                </form>
            </Dialog>

            {/* Popup pour Ajouter un Parcours (codeparcours, nomParcours, dureeparcours) */}
            <Dialog open={openParcours} onClose={handleCloseParcours}>
                <DialogTitle>Ajouter un Nouveau Parcours</DialogTitle>
                <form onSubmit={0}>
                  <DialogContent>
                      <TextField autoFocus sx={{ mb:2 }} margin='dense' type='text' value={code_formation} onChange={e => setCode_formation(e.target.value)}
                          label="Code Formation" fullWidth variant='outlined' required />
                      <TextField margin="dense" value={datedebut} onChange={e => setDatedebut(e.target.value)}
                          label="Date de début" type="date"
                          fullWidth variant="outlined" required
                          sx={{ mb: 2 }}  InputLabelProps={{ shrink: true }}
                      />
                      <TextField value={nomformation} onChange={e => setNomformation(e.target.value)}
                          margin="dense" label="Nom Parcours (Ex: Informatique, Pâtisserie etc)"
                          type="text" fullWidth variant="outlined" required sx={{ mb: 2 }}
                      />
                    
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleCloseParcours} variant="secondary">Annuler</Button>
                      <Button type='submit' variant="primary">Ajouter</Button>
                  </DialogActions>
                </form>

            </Dialog>

            {/* Popup pour Ajouter un Frais (idfrais, nomfrais, montant frais) */}
            <Dialog open={openFrais} onClose={handleCloseFrais}>
                <DialogTitle>Ajouter un Nouveau Frais à Payer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="ID Frais"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Nom du Frais (Ex: Frais de scolarité, Réinscription)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Montant du Frais ($)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        required
                        inputProps={{ min: 0, step: "0.01" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFrais} variant="secondary">Annuler</Button>
                    <Button onClick={handleAddFrais} variant="success">Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SchoolDashboard;

