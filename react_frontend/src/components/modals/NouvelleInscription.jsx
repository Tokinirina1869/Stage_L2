import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaGraduationCap, FaPlus, FaTrash, FaUserAlt } from "react-icons/fa";
import { GraduationCap, User, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";

const NouvelleInscription = ({ show, handleClose, refreshList, searchEleve }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    naiss: "",
    lieunaiss: "",
    sexe: "",
    adresse: "",
    cin: "",
    datedel: "",
    lieucin: "",
    nompere: "",
    nommere: "",
    nomtuteur: "",
    adressparent: "",
    adresstuteur: "",
    phoneparent: "",
    phonetuteur: "",
    dateinscrit: "",
    anneesco: "",
    type_inscrit: "inscription",
    nomniveau: "",
    photo: null,
    code_niveau: "",
    profileImage: "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
  });

  useEffect(() => {
  if (searchEleve && searchEleve.personne) {
    const p = searchEleve.personne;
    setForm(prev => ({
      ...prev,
      nom: p.nom || "",
      prenom: p.prenom || "",
      naiss: p.naiss || "",
      lieunaiss: p.lieunaiss || "",
      sexe: p.sexe || "",
      adresse: p.adresse || "",
      cin: p.cin || "",
      datedel: p.datedel || "",
      lieucin: p.lieucin || "",
      nompere: p.nompere || "",
      nommere: p.nommere || "",
      nomtuteur: p.nomtuteur || "",
      adressparent: p.adressparent || "",
      adresstuteur: p.adresstuteur || "",
      phoneparent: p.phoneparent || "",
      phonetuteur: p.phonetuteur || "",
      photo: p.photo || null,
      profileImage: p.photo
        ? `http://localhost:8000/storage/${p.photo}`
        : "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
      nomniveau: p.nomniveau,
    }));
  }
}, [searchEleve]);

  const [niveauForm, setniveauForm] = useState([]);
  const [errors, setErrors] = useState({});

  const [niveauOption, setNiveauOption] = useState([]);

  useEffect(() =>{
    const fetchniveau = async () => {
      try{
        const response = await axios.get('http://localhost:8000/api/niveau');
        setNiveauOption(response.data.data);
      }
      catch(err){
        console.error("Erreur lors du chargement des niveau ", err);
      }
    }
    fetchniveau();
  }, []);

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

    if (name === "cin" && !/^[0-9]{12}$/.test(value)) {
      setErrors(prev => ({ ...prev, cin: "CIN invalide : 12 chiffres" }));
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

  // niveau
  const handleNiveauChange = (index, field, value) => {
    setniveauForm(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addNewNiveau = () => {
    setniveauForm(prev => [...prev, { nomniveau: ""}]);
  };

  const removeniveau = (index) => {
    setniveauForm(prev => prev.filter((_, i) => i !== index));
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(err => err)) {
       Swal.fire({
          icon: "error",
          text: "Veuillez corriger les erreurs dans le formulaire!",
          background: '#1e1e2f',
          color: "white",
          showConfirmButton: true,

        });
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      niveauForm.forEach((p, i) => {
        // Ici on récupère le code du niveau depuis l'option sélectionnée
        const selectedNiveau = niveauOption.find(n => n.nomniveau === p.nomniveau);
        if (selectedNiveau) {
          formData.append(`niveaux[${i}][code_niveau]`, selectedNiveau.code_niveau);
        }
      });

      if (!form.type_inscrit) {
        Swal.fire({
          icon: "error",
          text: "Veuillez choisir le type d'inscription",
          background: '#1e1e2f',
          color: "white",
          showConfirmButton: true,

        })
        return;
      }

      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        naiss: form.naiss,
        lieunaiss: form.lieunaiss,
        sexe: form.sexe,
        adresse: form.adresse,
        cin: form.cin,
        datedel: form.datedel,
        lieucin: form.lieucin,
        nompere: form.nompere,
        nommere: form.nommere,
        nomtuteur: form.nomtuteur,
        adressparent: form.adressparent,
        adresstuteur: form.adresstuteur,
        phoneparent: form.phoneparent,
        phonetuteur: form.phonetuteur,

        dateinscrit: form.dateinscrit,
        anneesco: form.anneesco,
        type_inscrit: form.type_inscrit,
        code_niveau: form.code_niveau,
      };

      await axios.post("http://localhost:8000/api/addacademique", payload, {
        headers: { "Content-Type": "application/json" },
      });

        Swal.fire({
          icon: "success",
          text: "Inscription de nouvelle personne réussie!",
          background: '#1e1e2f',
          color: "white",
          showConfirmButton: false,
          timer: 2000,
        })

      handleClose();
      if (refreshList) refreshList();
    } 
    catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        console.log("Erreurs Laravel :", err.response.data.errors);
        alert("Erreur : " + JSON.stringify(err.response.data.errors));
      } 
      else {
         Swal.fire({
          icon: "error",
          text: "Erreur lors de l'inscription",
          background: '#1e1e2f',
          color: "white",
          showConfirmButton: true,
        })
      }
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nouvelle Inscription Générale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="space-y-8">

        <div className="flex flex-col items-center mb-6">
            <img src={form.profileImage} alt="Profil" className="rounded-full border-4 border-blue-500 w-32 h-32 object-cover"/>
            <div className="mt-3">
                <Form.Label className="cursor-pointer px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition">
                Sélectionner une photo
                <Form.Control type="file" hidden accept="image/*"  onChange={handleImageUpload} />
                </Form.Label>
            </div>
        </div>

          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <User className="w-6 h-6 mr-3" />
              <h5 className="text-center fw-bold">1. Informations Personnel</h5>
            </div>
            <Row>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom *</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} required/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénom(s)</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} required/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date de naissance</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today}/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2" ><Form.Label>Lieu de naissance</Form.Label><Form.Control type="text" name="lieunaiss" value={form.lieunaiss} onChange={handleChange} /></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange}><option value="">-- Choisir --</option><option>Masculin</option><option>Feminin</option></Form.Select></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Actuelle</Form.Label><Form.Control name="adresse" value={form.adresse} onChange={handleChange} /></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label><b>CIN</b> (<b>C</b>arte d'<b>I</b>dentité <b>N</b>ationale)</Form.Label><Form.Control name="cin" value={form.cin} onChange={handleChange} />{errors.cin && <small className="text-danger">{errors.cin}</small>}</Form.Group></Col>
              <Col lg={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Délivrée le</Form.Label>
                  <Form.Control type="date"  name="datedel" value={form.datedel} onChange={handleChange} disabled={!form.cin} max={today}/>
                </Form.Group>
              </Col>

              <Col lg={4}>
                <Form.Group className="mb-2">
                  <Form.Label>à</Form.Label>
                  <Form.Control type="text"name="lieucin" value={form.lieucin} onChange={handleChange} disabled={!form.cin}/>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <Users className="w-6 h-6 mr-3" />
              <h5 className="text-center fw-bold">2. Informations Parentales</h5>
            </div>
            <Row>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Nom et Prénoms du Père</Form.Label><Form.Control name="nompere" value={form.nompere} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Nom et Prénoms de la Mère</Form.Label><Form.Control name="nommere" value={form.nommere} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Adresse actuelle du Parent</Form.Label><Form.Control name="adressparent" value={form.adressparent} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Contact du Parent</Form.Label><Form.Control name="phoneparent" placeholder="ex: 038 38 038 38" value={form.phoneparent} onChange={handleChange}/>{errors.phoneparent && <small className="text-danger">{errors.phoneparent}</small>}</Form.Group></Col>
            </Row>
          </div>

          {/* TUTEUR */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <FaUserAlt className="w-6 h-6 mr-3" />
              <h5 className="text-center fw-bold">3. Informations du Tuteur</h5>
            </div>
            <Row>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Nom du Tuteur</Form.Label><Form.Control name="nomtuteur" value={form.nomtuteur} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Téléphone du Tuteur</Form.Label><Form.Control name="phonetuteur" value={form.phonetuteur} onChange={handleChange}/>{errors.phonetuteur && <small className="text-danger">{errors.phonetuteur}</small>}</Form.Group></Col>
              <Col lg={12}><Form.Group className="mb-2"><Form.Label>Adresse du Tuteur</Form.Label><Form.Control name="adresstuteur" value={form.adresstuteur} onChange={handleChange}/></Form.Group></Col>
            </Row>
          </div>

          {/* INSCRIPTION */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <UserPlus className="w-6 h-6 mr-3" />
              <h5 className="items-center fw-bold">4. Détails de l'Inscription</h5>
            </div>
            <Row>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Date d’inscription</Form.Label><Form.Control type="date" name="dateinscrit" value={form.dateinscrit} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Année scolaire</Form.Label><Form.Select name="anneesco" value={form.anneesco} onChange={handleChange}><option value="">-- Choisir l'année scolaire --</option>{generateAnnee().map(a => <option key={a}>{a}</option>)}</Form.Select></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Type d'inscription</Form.Label><Form.Select name="type_inscrit" value={form.type_inscrit} onChange={handleChange}><option>--Choisir le type d'inscription--</option> <option>Inscription</option><option>Réinscription</option></Form.Select></Form.Group></Col>
            </Row>
          </div>

          {/* niveau */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <FaGraduationCap className="w-6 h-6 mr-3" />
              <h5 className="items-center fw-bold">5. Choix du niveau</h5>
            </div>
            {niveauForm.map((p, i) => (
              <Row key={i} className="align-items-center mb-2">
                <Col lg={5}>
                  <Form.Select name="code_niveau" value={form.code_niveau} onChange={handleChange}>
                      <option value="">-- Choisir niveau --</option>
                      {niveauOption.map(n => (
                          <option key={n.code_niveau} value={n.code_niveau}>
                              {n.nomniveau}
                          </option>
                      ))}
                  </Form.Select>

                </Col>
                <Col lg={5}>
                  <Form.Control type="date" value={p.datedebut} onChange={e => handleNiveauChange(i, "datedebut", e.target.value)} required max={today}/>
                </Col>
                <Col lg={2} className="text-center">
                  <Button variant="outline-danger" onClick={() => removeniveau(i)}><FaTrash /></Button>
                </Col>
              </Row>
            ))}
          </div>
          <div className="mb-3">
            <Button variant="outline-primary" className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 text-white p-1 rounded" onClick={addNewNiveau}><FaPlus /> Ajouter niveau</Button>
          </div>

          {/* BOUTONS */}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-danger" onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="primary" className="gap-2 px-4 py-2 text-white bg-indigo-600 p-1 rounded">S'inscrire</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NouvelleInscription;

