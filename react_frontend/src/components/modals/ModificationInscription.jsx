import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const ModificationInscription = ({ show, handleClose, personneData }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    matricule: "",
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
    photo: null,
    profileImage: "https://placehold.co/128x128/FFFFFF/000000?text=Photo"
  });

  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const schoolYears = [];
    for (let annee = 2010; annee <= currentAnnee; annee++) {
      schoolYears.push(`${annee}-${annee + 1}`);
    }
    return schoolYears;
  };
  const [schoolYears] = useState(generateAnnee());

  useEffect(() => {
    if (personneData) {
      setForm({
        matricule: personneData.matricule || "",
        nom: personneData.personne?.nom || "",
        prenom: personneData.personne?.prenom || "",
        naiss: personneData.personne?.naiss || "",
        sexe: personneData.personne?.sexe || "",
        adresse: personneData.personne?.adresse || "",
        cin: personneData.personne?.cin || "",
        nompere: personneData.personne?.nompere || "",
        nommere: personneData.personne?.nommere || "",
        nomtuteur: personneData.personne?.nomtuteur || "",
        adressparent: personneData.personne?.adressparent || "",
        adresstuteur: personneData.personne?.adresstuteur || "",
        phoneparent: personneData.personne?.phoneparent || "",
        phonetuteur: personneData.personne?.phonetuteur || "",
        dateinscrit: personneData.dateinscrit || "",
        anneesco: personneData.anneesco || "",
        duree: personneData.inscriptionformations?.[0]?.duree || "",
        type_formation: personneData.inscriptionformations?.[0]?.type_formation || "Court Terme",
        datedebut: personneData.parcours?.[0]?.datedebut || "",
        nomformation: personneData.parcours?.map(p => p.nomformation) || [],
        photo: null,
        profileImage: personneData.personne?.photo 
          ? `http://localhost:8000/storage/${personneData.personne.photo}` 
          : "https://placehold.co/128x128/FFFFFF/000000?text=Photo"
      });
    }
  }, [personneData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      nomformation: e.target.checked
        ? [...prev.nomformation, value]
        : prev.nomformation.filter(f => f !== value)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation frontend
    if (!form.datedebut) {
      alert("Veuillez sélectionner la date de début avant de modifier.");
      return;
    }

    if (form.nomformation.length === 0) {
      alert("Veuillez cocher au moins une formation.");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
        if (key === 'nomformation') {
            form.nomformation.forEach(f => formData.append('nomformation[]', f));
        } else if (key !== 'profileImage') {
            formData.append(key, form[key] ?? '');
        }
    });

    if (form.photo) formData.append('photo', form.photo);
    formData.append('_method', 'PATCH');

    try {
        await axios.post(
            `http://localhost:8000/api/inscriptionComplete/${form.matricule}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        alert("Modification réussie ✅");
        handleClose();
    } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Erreur lors de la modification ❌");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Inscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Image Profil */}
          <div className="text-center mb-3">
            <img
              src={form.profileImage}
              alt="Profil"
              className="rounded-circle border border-3 border-primary"
              style={{ width: "128px", height: "128px", objectFit: "cover" }}
            />
            <div className="mt-2">
              <Form.Label className="btn btn-sm btn-outline-primary fw-bold">
                Sélectionner une photo
                <Form.Control type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Form.Label>
            </div>
          </div>

          {/* Informations Personne */}
          <Row>
            <h5 className="text-center fw-bold">Informations Personne</h5>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} required/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénom</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} required/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date Naissance</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today} required/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange} required>
              <option value="">-- Choisir --</option>
              <option value="Masculin">Masculin</option>
              <option value="Feminin">Féminin</option>
            </Form.Select></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse</Form.Label><Form.Control name="adresse" value={form.adresse} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>CIN</Form.Label><Form.Control name="cin" value={form.cin} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Père</Form.Label><Form.Control name="nompere" value={form.nompere} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Mère</Form.Label><Form.Control name="nommere" value={form.nommere} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Tuteur</Form.Label><Form.Control name="nomtuteur" value={form.nomtuteur} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Parents</Form.Label><Form.Control name="adressparent" value={form.adressparent} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Tuteur</Form.Label><Form.Control name="adresstuteur" value={form.adresstuteur} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Phone Parent</Form.Label><Form.Control name="phoneparent" value={form.phoneparent} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Phone Tuteur</Form.Label><Form.Control name="phonetuteur" value={form.phonetuteur} onChange={handleChange} /></Form.Group></Col>
          </Row>

          {/* Inscription */}
          <h5 className="text-center fw-bold mt-3">Nouvelle Inscription</h5>
          <Row>
            <Col lg={6}><Form.Group className="mb-2"><Form.Label>Date Inscription</Form.Label><Form.Control type="date" name="dateinscrit" value={form.dateinscrit} onChange={handleChange} max={today} required/></Form.Group></Col>
            <Col lg={6}><Form.Group className="mb-2"><Form.Label>Année Scolaire</Form.Label>
              <Form.Select name="anneesco" value={form.anneesco} onChange={handleChange} required>
                <option value="">-- Choisir --</option>
                {schoolYears.map((annee) => (
                    <option key={annee} value={annee}>{annee}</option>
                ))}
              </Form.Select>
            </Form.Group></Col>
          </Row>

          {/* Formation / Parcours */}
          <h5 className="text-center fw-bold mt-3">Formation / Parcours</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Durée</Form.Label><Form.Control type="number" name="duree" value={form.duree} onChange={handleChange} required/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Type Formation</Form.Label>

              {/* === CORRECTION ICI : utiliser type_formation (avant: anneesco) === */}
              <Form.Select name="type_formation" value={form.type_formation} onChange={handleChange} required>
                <option value="">-- Choisir --</option>
                <option value="Court Terme">Court Terme</option>
                <option value="Long Terme">Long Terme</option>
              </Form.Select>

            </Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date Début Formation</Form.Label><Form.Control type="date" name="datedebut" value={form.datedebut} onChange={handleChange} max={today} required/></Form.Group></Col>
          </Row>

          <div className="mb-3 text-center">
            <Form.Label>Nouvelles Formations</Form.Label>
            <Row className="p-2">
                {["Informatique","Musique","Langue","Coupe","Pâtisserie"].map((f) => (
                    <Col key={f} className="form-check">
                        <Form.Check
                            type="checkbox"
                            value={f}
                            label={f}
                            checked={form.nomformation.includes(f)}
                            onChange={handleCheckboxChange}
                        />
                    </Col>
                ))}

            </Row>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <Button variant="outline-danger" onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="primary">Modifier</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificationInscription;
