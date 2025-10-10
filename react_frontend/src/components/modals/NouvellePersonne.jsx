import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

const NouvellePersonne = ({ show, handleClose, refreshList }) => {
  const today = new Date().toISOString().split("T")[0];

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
    photo: null,
    profileImage: "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
  });

  const [parcoursForm, setParcoursForm] = useState([]);
  const [errors, setErrors] = useState({});

  // Générer années scolaires
  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      years.push(`${annee}-${annee + 1}`);
    }
    return years;
  };

  // Gestion champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "cin" && !/^[0-9]{8,12}$/.test(value)) {
      setErrors(prev => ({ ...prev, cin: "CIN invalide : 8-12 chiffres" }));
    } else if (name === "cin") {
      setErrors(prev => ({ ...prev, cin: "" }));
    }

    if ((name === "phoneparent" || name === "phonetuteur") && !/^[0-9]{10}$/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Numéro invalide : 10 chiffres" }));
    } else if (name === "phoneparent" || name === "phonetuteur") {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // Parcours
  const handleParcoursChange = (index, field, value) => {
    setParcoursForm(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addNewParcours = () => {
    setParcoursForm(prev => [...prev, { nomformation: "", datedebut: today }]);
  };

  const removeParcours = (index) => {
    setParcoursForm(prev => prev.filter((_, i) => i !== index));
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(err => err)) {
      alert("Veuillez corriger les erreurs dans le formulaire ❌");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      // Ajouter les parcours
      parcoursForm.forEach((p, i) => {
        formData.append(`parcours[${i}][nomformation]`, p.nomformation);
        formData.append(`parcours[${i}][datedebut]`, p.datedebut);
      });

      await axios.post("http://localhost:8000/api/inscriptionComplete", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Inscription complète réussie !");
      handleClose();
      if (refreshList) refreshList();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription ❌");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nouvelle Inscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          {/* PHOTO */}
          <div className="text-center mb-3">
            <img src={form.profileImage} alt="Profil"
              className="rounded-circle border border-3 border-primary"
              style={{ width: 128, height: 128, objectFit: "cover" }} />
            <div className="mt-2">
              <Form.Label className="btn btn-sm btn-outline-primary fw-bold">
                Sélectionner une photo
                <Form.Control type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Form.Label>
            </div>
          </div>

          {/* INFORMATIONS PERSONNELLES */}
          <h5 className="text-center fw-bold">Informations Personne</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} required/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénom</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} required/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date Naissance</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange}><option value="">-- Choisir --</option><option>Masculin</option><option>Feminin</option></Form.Select></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse</Form.Label><Form.Control name="adresse" value={form.adresse} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>CIN</Form.Label><Form.Control name="cin" value={form.cin} onChange={handleChange} />{errors.cin && <small className="text-danger">{errors.cin}</small>}</Form.Group></Col>
          </Row>

          {/* PARENTS */}
          <h5 className="text-center fw-bold mt-3">Informations des Parents</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Père</Form.Label><Form.Control name="nompere" value={form.nompere} onChange={handleChange}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Mère</Form.Label><Form.Control name="nommere" value={form.nommere} onChange={handleChange}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Parents</Form.Label><Form.Control name="adressparent" value={form.adressparent} onChange={handleChange}/></Form.Group></Col>
            <Col lg={6}><Form.Group className="mb-2"><Form.Label>Téléphone Parent</Form.Label><Form.Control name="phoneparent" value={form.phoneparent} onChange={handleChange}/>{errors.phoneparent && <small className="text-danger">{errors.phoneparent}</small>}</Form.Group></Col>
          </Row>

          {/* TUTEUR */}
          <h5 className="text-center fw-bold mt-3">Informations du Tuteur</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Tuteur</Form.Label><Form.Control name="nomtuteur" value={form.nomtuteur} onChange={handleChange}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Tuteur</Form.Label><Form.Control name="adresstuteur" value={form.adresstuteur} onChange={handleChange}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Téléphone Tuteur</Form.Label><Form.Control name="phonetuteur" value={form.phonetuteur} onChange={handleChange}/>{errors.phonetuteur && <small className="text-danger">{errors.phonetuteur}</small>}</Form.Group></Col>
          </Row>

          {/* INSCRIPTION */}
          <h5 className="text-center fw-bold mt-3">Informations d’Inscription</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date d’inscription</Form.Label><Form.Control type="date" name="dateinscrit" value={form.dateinscrit} onChange={handleChange}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Année scolaire</Form.Label><Form.Select name="anneesco" value={form.anneesco} onChange={handleChange}><option value="">-- Choisir --</option>{generateAnnee().map(a => <option key={a}>{a}</option>)}</Form.Select></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Durée</Form.Label><Form.Control name="duree" value={form.duree} onChange={handleChange}/></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Type de formation</Form.Label><Form.Select name="type_formation" value={form.type_formation} onChange={handleChange}><option>Court Terme</option><option>Long Terme</option></Form.Select></Form.Group></Col>
          </Row>

          {/* PARCOURS */}
          <h5 className="text-center fw-bold mt-3">Formations / Parcours</h5>
          {parcoursForm.map((p, i) => (
            <Row key={i} className="align-items-center mb-2">
              <Col lg={5}>
                <Form.Select value={p.nomformation} onChange={e => handleParcoursChange(i, "nomformation", e.target.value)} required>
                  <option value="">-- Choisir formation --</option>
                  {["Informatique", "Musique", "Langues", "Couture", "Pâtisserie"].map(f => <option key={f} value={f}>{f}</option>)}
                </Form.Select>
              </Col>
              <Col lg={5}>
                <Form.Control type="date" value={p.datedebut} onChange={e => handleParcoursChange(i, "datedebut", e.target.value)} required max={today}/>
              </Col>
              <Col lg={2} className="text-center">
                <Button variant="outline-danger" onClick={() => removeParcours(i)}><FaTrash /></Button>
              </Col>
            </Row>
          ))}
          <div className="mb-3">
            <Button variant="outline-primary" onClick={addNewParcours}><FaPlus /> Ajouter Parcours</Button>
          </div>

          {/* BOUTONS */}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-danger" onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="primary">S'inscrire</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NouvellePersonne;
