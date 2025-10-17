import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Card, Table } from 'react-bootstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const URL = "http://localhost:8000/api";

function SchoolDashboard({ retourDash }) {
  const [parcours, setParcours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [frais, setFrais] = useState([]);

  const [code_formation, setCode_formation] = useState("");
  const [datedebut, setDatedebut] = useState("");
  const [nomformation, setNomformation] = useState("");
  const [selectedParcours, setSelectedParcours] = useState(null); 
  const [openParcours, setOpenParcours] = useState(false);
  const [modalParcours, setModalParcours] = useState(false);

  const [idfrais, setIdfrais] = useState('');
  const [nomfrais, setNomfrais] = useState("");
  const [montant, setMontant] = useState("");
  const [selectedFrais, setSelectedFrais] = useState(null);
  const [openFrais, setOpenFrais] = useState(false);
  const [modalFrais, setModalFrais] = useState(false);

  const [code_niveau, setCode_niveau] = useState('');
  const [nomniveau, setNomniveau] = useState('');
  const [selectedNiveaux, setSelectedNiveaux] = useState(null); 
  const [openNiveau, setOpenNiveau] = useState(false);
  const [modalNiveaux, setModalNiveaux] = useState(false);

  const handleOpenNiveau = () => setOpenNiveau(true);
  const handleCloseNiveau = () => { setOpenNiveau(false); resetNiveauForm(); };
  const handleUpdateNiveaux = () => setModalNiveaux(true);
  const handleCloseNiveaux = () => { setModalNiveaux(false); resetNiveauForm(); };

  const handleOpenParcours = () => setOpenParcours(true);
  const handleCloseParcours = () => { setOpenParcours(false); resetParcoursForm(); };
  const handleUpdateParcours = () => setModalParcours(true);
  const handleCloseparcours = () => { setModalParcours(false); resetParcoursForm(); };

  const handleOpenFrais = () => setOpenFrais(true);
  const handleCloseFrais = () => { setOpenFrais(false); resetFraisForm(); };
  const handleUpdateFrais = () => setModalFrais(true);
  const handleClosefrais = () => { setModalFrais(false); resetFraisForm(); };
  
  const resetNiveauForm = () => {
    setCode_niveau('');
    setNomniveau('');
    setSelectedNiveaux(null);
  };

  const resetFraisForm = () => {
    setIdfrais('');
    setNomfrais('');
    setMontant('');
    setSelectedFrais(null);
  };
  
  const resetParcoursForm = () => {
    setCode_formation('');
    setNomformation('');
    setDatedebut('');
    setSelectedParcours(null);
  };

  const fetchData = useCallback(async () => {
    try {
      const parcoursRes = await axios.get(`${URL}/parcours`);
      setParcours(parcoursRes.data);
      
      const niveauRes = await axios.get(`${URL}/niveau`);
      setNiveaux(niveauRes.data.data || niveauRes.data); 

      const fraisRes = await axios.get(`${URL}/frais`);
      setFrais(fraisRes.data);
      
    } catch (err) {
      console.error("Erreur lors de la récupération des données initiales: ", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitNiveaux = async (e) => {
    e.preventDefault();
    if (!code_niveau.trim() || !nomniveau.trim()) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await axios.post(`${URL}/niveaux`, {
        code_niveau,
        nomniveau,
      });

      if (response.status === 201 || response.status === 200) {
        alert("✅ Niveau ajouté avec succès !");
        handleCloseNiveau();
        await fetchData(); 
      }
    } 
    catch (error) {
      console.error("Erreur Axios :", error);
      alert("Erreur lors de l'ajout du niveau. Vérifiez le serveur Laravel !");
    }
  };

  const handleEditNiveau = async (e) => {
    e.preventDefault();
    if (!selectedNiveaux) return;

    try{
      await axios.put(`${URL}/updateNiveaux/${selectedNiveaux.code_niveau}`, {
        code_niveau, nomniveau
      });

      alert("Niveau modifié avec succès !");
      handleCloseNiveaux();
      await fetchData();
    }
    catch(error){
      console.error(error);
      alert("Erreur lors de la modification du niveau !");
    }
  }
  
  const handleSelectNiveauForEdit = (niveau) => {
    setSelectedNiveaux(niveau); 
    setCode_niveau(niveau.code_niveau);
    setNomniveau(niveau.nomniveau);
    handleUpdateNiveaux();
  }


  const handleDeleteNiveau = async (code_niveau) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette personne ?")) {
      try {
        await axios.delete(`${URL}/deleteNiveaux/${code_niveau}`);
        setNiveaux(niveaux.filter(p => p.code_niveau !== code_niveau));
        alert("Suppression réussie ✅");
        await fetchData();
      } 
      catch (err) {
        console.error(err); alert("Erreur lors de la suppression ❌");
      }
    }
  };

  const handleSubmitFrais = async (e) => {
    e.preventDefault();

    if(!idfrais.trim() || !nomfrais.trim() || !montant) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await axios.post(`${URL}/addfrais`, {
        idfrais,
        nomfrais,
        montant: parseInt(montant, 10)
      });

      if(response.status === 201 || response.status === 200) {
        alert("Frais ajouté avec succès !!!");
        handleCloseFrais();
        await fetchData(); 
      }
    } 
    catch(error) {
      console.error("Erreur Axios :", error.response ? error.response.data : error.message);
      alert("Erreur lors de l'ajout des frais. Vérifiez le serveur Laravel !");
    }
  };

  const handleEditFrais = async (e) => {
    e.preventDefault();
    if (!selectedFrais) return;

    try{
        await axios.put(`${URL}/updateFrais/${selectedFrais.idfrais}`,{
        nomfrais, montant
      });
      alert("Modification réussie !");
      handleClosefrais();
      await fetchData(); 
    }
    catch(error) {
      console.error(error);
      alert("Erreur lors de la modification des frais !");
    }
  }
  
  // Correction: Remplir les champs lors de l'ouverture de la modale de modification des Frais
  const handleSelectFraisForEdit = (frais) => {
    setSelectedFrais(frais);
    setIdfrais(frais.idfrais);
    setNomfrais(frais.nomfrais);
    setMontant(frais.montant);
    handleUpdateFrais();
  }

  const handleDeleteFrais = async (idfrais) =>{
    if(!idfrais){
      alert('IdFrais invalide !!!');
      return;
    }
    if(window.confirm("Voulez-vous vraiement supprimer ce frais?")) {
      try{
        await axios.delete(`${URL}/deleteFrais/${idfrais}`);
        alert("Suppression réussie!!!")
        await fetchData();
      }
      catch(err){
        console.error("Erreur: ", err);
        alert("Erreur lors de la suppression !!!");
      }
    }
  }

  const handleSubmitParcours = async (e) => {
    e.preventDefault();

    if(!code_formation.trim() || !nomformation.trim() || !datedebut) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await axios.post(`${URL}/addParcours`, {
        code_formation,
        nomformation,
        datedebut,
      });

      if(response.status === 201 || response.status === 200) {
        alert("Parcours ajouté avec succès !!!");
        handleCloseParcours();
        await fetchData(); 
      }
    } 
    catch(error) {
      console.error("Erreur Axios :", error.response ? error.response.data : error.message);
      alert("Erreur lors de l'ajout du parcours. Vérifiez le serveur Laravel !");
    }
  };

  const handleEditParcours = async (e) => {
    e.preventDefault();
    if (!selectedParcours) {
      alert("Aucun parcours sélectionné !");
      return
    };
    
    try{
      await axios.put(`${URL}/updateParcours/${selectedParcours.code_formation}`, {
        nomformation, datedebut
      });
      alert("Modification réussie !");
      handleCloseparcours();
      await fetchData();
    }

    catch(error){
      console.error(error);
      alert("Erreur lors de la modification du parcours !");
    }
  }
  
  const handleDeleteParcours= async (code_formation) =>{
    if(!code_formation){
      alert('Code_formation invalide !!!');
      return;
    }
    if(window.confirm("Voulez-vous vraiement supprimer ce parcours?")) {
      try{
        await axios.delete(`${URL}/deleteParcours/${code_formation}`);
        alert("Suppression réussie!!!")
        await fetchData();
      }
      catch(err){
        console.error("Erreur: ", err);
        alert("Erreur lors de la suppression !!!");
      }
    }
  }

  // Correction: Remplir les champs lors de l'ouverture de la modale de modification des Parcours
  const handleSelectParcoursForEdit = (parcours) => {
    setSelectedParcours(parcours);
    setCode_formation(parcours.code_formation);
    setNomformation(parcours.nomformation || "");
    setDatedebut(parcours.datedebut ? parcours.datedebut.substring(0,10) : "");
    handleUpdateParcours();
  }

    return (
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
                                        {/* <th>Effectif</th> */}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { niveaux.length > 0 ? niveaux.map((niveau) => (
                                        <tr key={niveau.code_niveau}>
                                            <td>{niveau.code_niveau}</td>
                                            {/* <td>{niveau.code_niveau}</td> */}
                                            <td>{niveau.nomniveau}</td>
                                            <td style={{ display: 'flex', justifyContent: 'center', alignItems:'center', gap: 1 }}>
                                              <button className="btn btn-primary px-1 mx-1 py-0.8" onClick={() => handleSelectNiveauForEdit(niveau)}>
                                                <FaEdit className='mx-1'/>Modifier
                                              </button>
                                              <button className="btn btn-danger mx-1 px-1 py-0.8" onClick={()=> handleDeleteNiveau(niveau.code_niveau)}>
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
                                    { frais.length >0 ? frais.map((fraisItem) => (
                                        <tr key={fraisItem.idfrais}>
                                            <td>{fraisItem.idfrais}</td>
                                            <td>{fraisItem.nomfrais}</td>
                                            <td>{fraisItem.montant}</td>
                                            <td  style={{ display: 'flex', justifyContent: 'center', alignItems:'center', gap: 1 }}>
                                              <button className="btn btn-primary px-1 mx-1 py-0.8" onClick={() => handleSelectFraisForEdit(fraisItem)}>
                                                <FaEdit className='mx-1'/>Modifier
                                              </button>
                                              <button className="btn btn-danger px-1 mx-1 py-0.8" onClick={() => handleDeleteFrais(fraisItem.idfrais)}>
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
                                    { parcours.length > 0 ? parcours.map((parcoursItem) => (
                                        <tr key={parcoursItem.code_formation}>
                                            <td>{parcoursItem.code_formation}</td>
                                            <td>{parcoursItem.nomformation}</td>
                                            <td>{parcoursItem.datedebut}</td>
                                            <td  style={{ display: 'flex', justifyContent: 'center', alignItems:'center', gap: 1 }}>
                                              <button className="btn btn-primary px-1 mx-1 py-0.8" onClick={() => handleSelectParcoursForEdit(parcoursItem)}>
                                                <FaEdit className='mx-1'/>Modifier
                                              </button>
                                              <button className="btn btn-danger px-1 mx-1 py-0.8" onClick={() => handleDeleteParcours(parcoursItem.code_formation)}>
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

            <Dialog open={openNiveau} onClose={handleCloseNiveau}>
                <DialogTitle>Ajouter un Nouveau Niveau</DialogTitle>
                <form onSubmit={handleSubmitNiveaux}>
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

            <Dialog open={modalNiveaux} onClose={handleCloseNiveaux}>
              <DialogTitle>Modification du nom de classe</DialogTitle>
                  <form onSubmit={handleEditNiveau}>
                    <DialogContent>
                      <TextField autoFocus value={code_niveau} onChange={e => setCode_niveau(e.target.value)} type='text' margin='dense' variant='outlined' required fullWidth label="Code Niveau" sx={{ mb: 2}} disabled={!!selectedNiveaux}/> 
                      <TextField autoFocus value={nomniveau} onChange={e => setNomniveau(e.target.value)} type='text' margin='dense' variant='outlined' required fullWidth label="Nom Niveau"  sx={{ mb: 2}} />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseNiveaux} variant='secondary'>Annuler</Button>
                      <Button type='submit' variant='primary'>Modifier</Button>
                    </DialogActions>
                  </form>
            </Dialog>

              <Dialog open={openFrais} onClose={handleCloseFrais}>
                <DialogTitle>Ajouter un Nouveau Frais à Payer</DialogTitle>
                <form onSubmit={handleSubmitFrais}>
                  <DialogContent>
                    <TextField value={idfrais} onChange={e => setIdfrais(e.target.value)}
                        autoFocus margin="dense" label="ID Frais" type="text"
                        fullWidth variant="outlined" required  sx={{ mb: 2 }}
                    />
                    <TextField value={nomfrais} onChange={e => setNomfrais(e.target.value)}
                        margin="dense"
                        label="Nom du Frais (Ex: Frais de scolarité, Réinscription)"
                        type="text" fullWidth variant="outlined" required sx={{ mb: 2 }}
                    />
                    <TextField value={montant} onChange={e => setMontant(e.target.value)}
                        margin="dense" label="Montant du Frais ($)" type="number" fullWidth variant="outlined" required inputProps={{ min: 0, step: "0.01" }}
                    />
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleCloseFrais} variant="secondary">Annuler</Button>
                      <Button type='submit' variant="success">Enregistrer</Button>
                  </DialogActions>
                </form>
              </Dialog>
              
              <Dialog open={modalFrais} onClose={handleClosefrais}>
                <DialogTitle>Modification de frais Scolaires</DialogTitle>
                <form onSubmit={handleEditFrais}>
                  <DialogContent>
                    <TextField autoFocus type='text' value={nomfrais} onChange={e => setNomfrais(e.target.value)} label="Nom Frais Scolaires" variant='outlined' sx={{ mb:2 }} required fullWidth/>
                    <TextField autoFocus type='number' value={montant} onChange={e => setMontant(e.target.value)} label="Montant Actuel" variant='outlined' sx={{mb:2}} required fullWidth/>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClosefrais} variant='secondary'>
                      Annuler
                    </Button>
                     <Button type='submit' variant='primary'>
                      Modifier
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>

            {/* Popup pour Ajouter un Parcours (codeparcours, nomParcours, dureeparcours) */}
            <Dialog open={openParcours} onClose={handleCloseParcours}>
                <DialogTitle>Ajouter un Nouveau Parcours</DialogTitle>
                <form onSubmit={handleSubmitParcours}>
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

            <Dialog open={modalParcours} onClose={handleCloseparcours}>
              <DialogTitle>Modifaction de Parcours existants</DialogTitle>
              <form onSubmit={handleEditParcours}>
                <DialogContent>
                    <TextField type='text' value={code_formation} label="Code Formation" variant='outlined' sx={{ mb:2 }} fullWidth disabled/>
                  <TextField type='text' value={nomformation} onChange={e => setNomformation(e.target.value)} 
                    variant='outlined' label="Nom Formation" sx={{ mb:2 }} autoFocus fullWidth required/>
                  <TextField type='date' value={datedebut} onChange={e => setDatedebut(e.target.value)} 
                    variant='outlined' label="Date de début" sx={{ mb:2 }} InputLabelProps={{ shrink: true }} fullWidth required/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseparcours} variant='secondary'>Annuler</Button>
                  <Button type='submit' variant='primary'>Modifier</Button>
                </DialogActions>
              </form>
            </Dialog>
        </Container>
    );
}

export default SchoolDashboard;