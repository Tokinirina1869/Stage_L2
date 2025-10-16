import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

const ModificationInscription = ({ show, handleClose, personneData, refreshList }) => {
  const today = new Date().toISOString().split("T")[0];
  const [schoolYears, setSchoolYears] = useState([]);
  const { setError, clearErrors, formState: { errors } } = useForm();

  const [form, setForm] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    naiss: "",
    lieunaiss: "",
    sexe: "",
    adresse: "",
    cin: "",
    dateDel: "",
    lieuCin: "",
    email: "",
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

  const [parcoursOption, setParcoursOption] = useState([]);

  useEffect(() =>{
    const fetchParcours = async () => {
      try{
        const response = await axios.get('http://localhost:8000/api/parcours');
        setParcoursOption(response.data);
      }
      catch(err){
        console.error("Erreur lors du chargement des parcours ", err);
      }
    }
    fetchParcours();
  }, []);

  useEffect(() => {
    const currentAnnee = new Date().getFullYear();
    const years = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      years.push(`${annee}-${annee + 1}`);
    }
    setSchoolYears(years);
  }, []);

  useEffect(() => {
    if (personneData) {
      setForm({
        matricule: personneData.matricule || "",
        nom: personneData.personne?.nom || "",
        prenom: personneData.personne?.prenom || "",
        naiss: personneData.personne?.naiss || "",
        lieunaiss: personneData.personne?.lieunaiss || "",
        sexe: personneData.personne?.sexe || "",
        adresse: personneData.personne?.adresse || "",
        cin: personneData.personne?.cin || "",
        dateDel: personneData.personne?.dateDel || "",
        lieuCin: personneData.personne?.lieuCin || "",
        email: personneData.personne?.email || "",
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
        photo: null,
        profileImage: personneData.personne?.photo
          ? `http://localhost:8000/storage/${personneData.personne.photo}`
          : "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
      });

      setParcoursForm(
        personneData.parcours?.map(p => ({
          code_formation: p.code_formation,
          nomformation: p.nomformation,
          datedebut: p.datedebut,
        })) || []
      );
    }
  }, [personneData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "cin" && !/^[0-9]{8,12}$/.test(value)) {
      setError(name, { type: "manual", message: "CIN invalide : 8-12 chiffres" });
    } else clearErrors(name);

    if ((name === "phoneparent" || name === "phonetuteur") && !/^[0-9]{10}$/.test(value)) {
      setError(name, { type: "manual", message: "Numéro invalide : 10 chiffres" });
    } else clearErrors(name);

    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(name, { type: "manual", message: "Email invalide" });
    } else clearErrors(name);
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

  const handleParcoursChange = (index, field, value) => {
    setParcoursForm(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addNewParcours = () => {
    setParcoursForm(prev => [...prev, { nomformation: "", datedebut: today, isNew: true }]);
  };

  const removeParcours = (index) => {
    setParcoursForm(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      alert("Veuillez corriger les erreurs ❌");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key !== "profileImage") formData.append(key, form[key] ?? "");
    });
    if (form.photo) formData.append("photo", form.photo);

    parcoursForm.forEach((p, i) => {
      formData.append(`parcours[${i}][nomformation]`, p.nomformation);
      formData.append(`parcours[${i}][datedebut]`, p.datedebut);
      if (p.code_formation) formData.append(`parcours[${i}][code_formation]`, p.code_formation);
    });

    formData.append("_method", "PATCH");

    try {
      await axios.post(`http://localhost:8000/api/inscriptionComplete/${form.matricule}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Modification réussie ✅");
      handleClose();
      if (refreshList) refreshList();
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
          <h5 className="text-center fw-bold text-primary">Informations Personnelles</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} required /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénom</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} required /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date Naissance</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Lieu de Naissance</Form.Label><Form.Control name="lieunaiss" value={form.lieunaiss} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange}><option value="">-- Choisir --</option><option>Masculin</option><option>Féminin</option></Form.Select></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse</Form.Label><Form.Control name="adresse" value={form.adresse} onChange={handleChange} /></Form.Group></Col>
          </Row>

          {/* CIN */}
          <h6 className="fw-bold mt-3 text-secondary">Carte d’Identité Nationale</h6>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Numéro CIN</Form.Label><Form.Control name="cin" value={form.cin} onChange={handleChange} />{errors.cin && <small className="text-danger">{errors.cin.message}</small>}</Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Délivrée le</Form.Label><Form.Control type="date" name="dateDel" value={form.dateDel} onChange={handleChange} disabled={!form.cin} max={today} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>à</Form.Label><Form.Control name="lieuCin" value={form.lieuCin} onChange={handleChange} disabled={!form.cin} /></Form.Group></Col>
          </Row>

          {/* PARENTS & TUTEUR */}
          <h5 className="text-center fw-bold text-primary mt-4">Parents et Tuteur</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Père</Form.Label><Form.Control name="nompere" value={form.nompere} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Téléphone Père</Form.Label><Form.Control name="phoneparent" value={form.phoneparent} onChange={handleChange} />{errors.phoneparent && <small className="text-danger">{errors.phoneparent.message}</small>}</Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Parents</Form.Label><Form.Control name="adressparent" value={form.adressparent} onChange={handleChange} /></Form.Group></Col>

            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Mère</Form.Label><Form.Control name="nommere" value={form.nommere} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom Tuteur</Form.Label><Form.Control name="nomtuteur" value={form.nomtuteur} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Tuteur</Form.Label><Form.Control name="adresstuteur" value={form.adresstuteur} onChange={handleChange} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Téléphone Tuteur</Form.Label><Form.Control name="phonetuteur" value={form.phonetuteur} onChange={handleChange} />{errors.phonetuteur && <small className="text-danger">{errors.phonetuteur.message}</small>}</Form.Group></Col>
          </Row>

          {/* INSCRIPTION */}
          <h5 className="text-center fw-bold text-primary mt-4">Informations d’Inscription</h5>
          <Row>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date Inscription</Form.Label><Form.Control type="date" name="dateinscrit" value={form.dateinscrit} onChange={handleChange} max={today} /></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Année Scolaire</Form.Label><Form.Select name="anneesco" value={form.anneesco} onChange={handleChange}><option value="">-- Choisir --</option>{schoolYears.map((y, i) => <option key={i}>{y}</option>)}</Form.Select></Form.Group></Col>
            <Col lg={4}><Form.Group className="mb-2"><Form.Label>Durée</Form.Label><Form.Control name="duree" value={form.duree} onChange={handleChange} placeholder="Ex: 3 mois, 1 an" /></Form.Group></Col>
          </Row>

          {/* PARCOURS */}
          <h5 className="text-center fw-bold text-primary mt-4">Formations / Parcours</h5>
            {parcoursForm.map((p, i) => (
              <Row key={i} className="align-items-center mb-2">
                <Col lg={5}>
                  <Form.Select value={p.nomformation} onChange={e => handleParcoursChange(i, "nomformation", e.target.value)} required>
                    <option value="">-- Choisir formation --</option>
                    {parcoursOption.map((parcours) => 
                      (<option key={parcours.code_formation} value={parcours.nomformation}>
                        {parcours.nomformation} ({parcours.datedebut}) 
                      </option>)
                    )}
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
          <Button variant="outline-primary" size="sm" onClick={addNewParcours}>
            <FaPlus /> Ajouter Formation
          </Button>

          {/* BOUTONS */}
          <div className="text-center mt-4">
            <Button variant="success" type="submit" className="me-2">Enregistrer</Button>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificationInscription;
