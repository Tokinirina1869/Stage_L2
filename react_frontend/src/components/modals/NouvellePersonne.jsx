import React, { useEffect, useState, useMemo } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaGraduationCap, FaPlus, FaTrash, FaUserAlt } from "react-icons/fa";
import { User, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";

const getInitialFormState = (today) => ({
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
    dateinscrit: today,
    anneesco: "",
    duree: "",
    type_formation: "Court Terme",
    photo: null,
    profileImage: "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
});

const NouvellePersonne = ({ show, handleClose, refreshList }) => {
  const today = new Date().toISOString().split("T")[0];

  // Utilisation de la fonction d'état initial
  const [form, setForm] = useState(getInitialFormState(today)); 

  const [parcoursForm, setParcoursForm] = useState([]);
  const [errors, setErrors] = useState({});
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

  // Générer années scolaires
  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      years.push(`${annee}-${annee + 1}`);
    }
    return years.reverse(); // Afficher l'année la plus récente en premier
  };

  const parcoursMap = useMemo(() => {
      return parcoursOption.reduce((acc, p) => {
          acc[p.nomformation] = p.code_formation 
            ? p.code_formation.substring(0, 3).toUpperCase()
            : null; 
          return acc;
      }, {});
  }, [parcoursOption]);

  // Gestion champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    setErrors(prev => ({
      ...prev,
      [name] : value.trim() === "" ? "Ce champ est requis " : ""
    }));

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
    const newErrors = {};
    
    // Vérification des champs requis dans le formulaire principal
    // NOTE: C'est une vérification simple, vous pouvez vouloir affiner pour chaque champ requis.
    const requiredFields = ['nom', 'prenom', 'naiss', 'sexe', 'adresse', 'dateinscrit', 'anneesco', 'duree'];
    requiredFields.forEach(key => {
        if (!form[key] || form[key].toString().trim() === "") {
            newErrors[key] = "Ce champ est requis!";
        }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));

    if (Object.values(newErrors).some(err => err) || Object.values(errors).some(err => err)) {
       Swal.fire({
        icon: "error",
        text: "Veuillez corriger les erreurs dans le formulaire !",
        background: '#1e1e2f',
        color: "white",
        showConfirmButton: false,
        timer: 2000,
      })
      return;
    }
    
    // 1. Vérification de la présence d'au moins un parcours
    if (!parcoursForm || parcoursForm.length === 0 || !parcoursForm[0]?.nomformation || !parcoursForm[0]?.datedebut) {
        return Swal.fire({
            icon: 'error',
            text: 'Veuillez ajouter et sélectionner au moins un parcours de formation avec une date.',
            background: '#1e1e2f',
            color: "white",
            showConfirmButton: true
        });
    }

    try {
      const formData = new FormData();
      
      // 2. Gestion et nettoyage des données FormData
      Object.entries(form).forEach(([key, value]) => {
          if (key === 'photo' && value instanceof File) {
              formData.append(key, value); 
          } else if (key !== 'profileImage' && key !== 'photo' && value !== null && value !== '') {
              formData.append(key, value); 
          }
      });

      const premiereFormationNom = parcoursForm[0]?.nomformation;
      const codeFormation = premiereFormationNom ? parcoursMap[premiereFormationNom] : null;

      if (!codeFormation) {
        return Swal.fire({
            icon: 'error',
            text: 'Le code matricule de la première formation est manquant. Vérifiez la sélection du parcours et la donnée dans l\'API.',
            background: '#1e1e2f',
            color: "white",
            showConfirmButton: true
        });
      }
      
      // 3. Ajout du code matricule obligatoire (Ex: INF)
      formData.append('matricule_code', codeFormation); 

      // 4. Ajouter les parcours (array)
      parcoursForm.forEach((p, i) => {
        formData.append(`parcours[${i}][nomformation]`, p.nomformation);
        formData.append(`parcours[${i}][datedebut]`, p.datedebut);
      });
      
      // 5. Envoi
      await axios.post("http://localhost:8000/api/inscriptionComplete", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      Swal.fire({
        icon: "success",
        text: "Nouvelle personne inscrite avec succès!",
        background: '#1e1e2f',
        color: "white",
        showConfirmButton: false,
        timer: 2000,
      })
      
      // 🚀 Vider le formulaire après succès
      setForm(getInitialFormState(today));
      setParcoursForm([]); 
      setErrors({}); 

      handleClose();
      if (refreshList) refreshList();
      
    } catch (err) {
      console.error("Erreur API:", err.response ? err.response.data : err);
      Swal.fire({
        icon: "error",
        text: "Erreur lors de l'inscription! " + (err.response?.data?.message || err.message),
        background: '#1e1e2f',
        color: "white",
        showConfirmButton: true,
      })
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nouvelle Inscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="space-y-8">

          {/* PHOTO */}
          <div className="flex flex-col items-center mb-6">
            <img src={form.profileImage} alt="Profil" className="rounded-full border-4 border-blue-500 w-32 h-32 object-cover"/>
            <div className="mt-3">
                <Form.Label className="cursor-pointer px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition">
                Sélectionner une photo
                <Form.Control type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Form.Label>
            </div>
          </div>

          {/* INFORMATIONS PERSONNELLES */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <User className="w-6 h-6 mr-3" />
              <h5 className="text-center fw-bold">1. Informations Personnel</h5>
            </div>
            <Row>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom *</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} /></Form.Group>
                {errors.nom && <small className="text-danger text-center">{ errors.nom }</small> }
              </Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénoms *</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} /></Form.Group>
                {errors.prenom && <small className="text-danger text-center">{ errors.prenom }</small> }
              </Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date de naissance *</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today}/></Form.Group>
                {errors.naiss && <small className="text-danger text-center">{ errors.naiss }</small> }
              </Col>
              <Col lg={4}><Form.Group className="mb-2" ><Form.Label>Lieu de naissance</Form.Label><Form.Control type="text" name="lieunaiss" value={form.lieunaiss} onChange={handleChange} /></Form.Group>
                {errors.lieunaiss && <small className="text-danger text-center">{ errors.lieunaiss }</small> }
              </Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe *</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange}><option value="">-- Choisir --</option><option>Masculin</option><option>Feminin</option></Form.Select></Form.Group>
                {errors.sexe && <small className="text-danger text-center">{ errors.sexe }</small> }
              </Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Actuelle *</Form.Label><Form.Control name="adresse" value={form.adresse} onChange={handleChange} /></Form.Group>
                {errors.adresse && <small className="text-danger text-center">{ errors.adresse }</small> }
              </Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label><b>CIN</b></Form.Label><Form.Control name="cin" value={form.cin} onChange={handleChange} />{errors.cin && <small className="text-danger">{errors.cin}</small>}</Form.Group></Col>
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
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Nom et Prénoms du père</Form.Label><Form.Control name="nompere" value={form.nompere} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Nom et Prénoms du mère</Form.Label><Form.Control name="nommere" value={form.nommere} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Adresse actuelle Parents</Form.Label><Form.Control name="adressparent" value={form.adressparent} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Numéro de téléphone du Parent</Form.Label><Form.Control name="phoneparent" value={form.phoneparent} onChange={handleChange}/>{errors.phoneparent && <small className="text-danger">{errors.phoneparent}</small>}</Form.Group></Col>
            </Row>
          </div>

          {/* TUTEUR */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <FaUserAlt className="w-6 h-6 mr-3" />
              <h5 className="text-center fw-bold">3. Informations du Tuteur</h5>
            </div>
            <Row>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Nom Tuteur</Form.Label><Form.Control name="nomtuteur" value={form.nomtuteur} onChange={handleChange}/></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Téléphone Tuteur</Form.Label><Form.Control name="phonetuteur" value={form.phonetuteur} onChange={handleChange}/>{errors.phonetuteur && <small className="text-danger">{errors.phonetuteur}</small>}</Form.Group></Col>
              <Col lg={12}><Form.Group className="mb-2"><Form.Label>Adresse Tuteur</Form.Label><Form.Control name="adresstuteur" value={form.adresstuteur} onChange={handleChange}/></Form.Group></Col>
            </Row>
          </div>

          {/* INSCRIPTION */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <UserPlus className="w-6 h-6 mr-3" />
              <h5 className="items-center fw-bold">4. Détails de l'Inscription</h5>
            </div>
            <Row>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Date d’inscription *</Form.Label><Form.Control type="date" name="dateinscrit" value={form.dateinscrit} onChange={handleChange} /></Form.Group>
                {errors.dateinscrit && <small className="text-danger text-center">{ errors.dateinscrit }</small> }
              </Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Année scolaire *</Form.Label><Form.Select name="anneesco" value={form.anneesco} onChange={handleChange}><option value="">-- Choisir l'année scolaire --</option>{generateAnnee().map(a => <option key={a}>{a}</option>)}</Form.Select></Form.Group>
                {errors.anneesco && <small className="text-danger text-center">{ errors.anneesco }</small> }
              </Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Durée *</Form.Label><Form.Select name="duree" value={form.duree} onChange={handleChange}><option value="">--choisir la durée--</option> <option>3 mois</option><option>2 ans</option></Form.Select></Form.Group>
                {errors.duree && <small className="text-danger text-center">{ errors.duree }</small> }
              </Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Type de formation</Form.Label><Form.Select name="type_formation" value={form.type_formation} onChange={handleChange}><option>Court Terme</option><option>Long Terme</option></Form.Select></Form.Group></Col>
            </Row>
          </div>

          {/* PARCOURS */}
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
            <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
              <FaGraduationCap className="w-6 h-6 mr-3" />
              <h5 className="items-center fw-bold">5. Détails de la Formation</h5>
            </div>
            {parcoursForm.map((p, i) => (
              <Row key={i} className="align-items-center mb-2">
                <Col lg={5}>
                  <Form.Select value={p.nomformation} onChange={e => handleParcoursChange(i, "nomformation", e.target.value)}>
                    <option value="">-- Choisir formation --</option>
                    {parcoursOption.map((parcours) => 
                      (<option key={parcours.code_formation} value={parcours.nomformation}>
                        {parcours.nomformation}
                      </option>)
                    )}
                  </Form.Select>
                </Col>
                <Col lg={5}>
                  <Form.Control type="date" value={p.datedebut} onChange={e => handleParcoursChange(i, "datedebut", e.target.value)} max={today} />
                </Col>
                <Col lg={2} className="text-center">
                  <Button variant="outline-danger" onClick={() => removeParcours(i)}><FaTrash /></Button>
                </Col>
              </Row>
            ))}
            {parcoursForm.length === 0 && <p className="text-muted">Veuillez ajouter au moins un parcours.</p>}
          </div>
          <div className="mb-3">
            <Button variant="outline-primary" className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 p-1 rounded" onClick={addNewParcours}><FaPlus /> Ajouter Parcours</Button>
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

export default NouvellePersonne;