import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaPlus, FaTrash, FaGraduationCap, FaUserAlt} from "react-icons/fa";
import { User, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";

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
    datedel: "", // Correction: Renommé de 'dateDel' à 'datedel' pour correspondre aux données API
    lieucin: "", // Correction: Renommé de 'lieuCin' à 'lieucin' pour correspondre aux données API
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
    setSchoolYears(years.reverse()); // Afficher la plus récente en premier
  }, []);

  useEffect(() => {
    if (personneData) {
      // Utiliser des variables locales pour un accès clair aux données imbriquées
      const personne = personneData.inscription?.personne || {};
      const inscription = personneData.inscription || {};

      setForm({
        // Données Personne
        matricule: personne.matricule || "",
        nom: personne.nom || "",
        prenom: personne.prenom || "",
        naiss: personne.naiss || "",
        lieunaiss: personne.lieunaiss || "",
        sexe: personne.sexe || "",
        adresse: personne.adresse || "",
        cin: personne.cin || "",
        datedel: personne.datedel || "", // CORRIGÉ
        lieucin: personne.lieucin || "", // CORRIGÉ
        email: personne.email || "",
        nompere: personne.nompere || "",
        nommere: personne.nommere || "",
        nomtuteur: personne.nomtuteur || "",
        adressparent: personne.adressparent || "",
        adresstuteur: personne.adresstuteur || "",
        phoneparent: personne.phoneparent || "",
        phonetuteur: personne.phonetuteur || "",
        
        // Données Inscription
        dateinscrit: inscription.dateinscrit || "",
        anneesco: inscription.anneesco || "",
        
        // Données Formation (à la racine)
        duree: personneData.duree || "", // CORRIGÉ: Accès direct à la racine
        type_formation: personneData.type_formation || "Court Terme", // CORRIGÉ: Accès direct à la racine
        
        photo: null,
        profileImage: personne.photo
          ? `http://localhost:8000/storage/${personne.photo}`
          : "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
      });

      // Données Parcours (liste des formations suivies)
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

    if (name === "cin" && !/^[0-9]{12}$/.test(value)) {
      setError(name, { type: "manual", message: "CIN invalide : 12 chiffres" });
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
      // Exclure la propriété profileImage qui n'est pas nécessaire pour l'API
      if (key !== "profileImage" && form[key] !== null) formData.append(key, form[key]); 
    });
    if (form.photo) formData.append("photo", form.photo);

    // Ajouter les parcours
    parcoursForm.forEach((p, i) => {
      // Ici, il faut vous assurer que le code_formation est bien passé
      const selectedParcours = parcoursOption.find(opt => opt.nomformation === p.nomformation);
      const code = selectedParcours ? selectedParcours.code_formation : p.code_formation || '';
      
      formData.append(`parcours[${i}][nomformation]`, p.nomformation);
      formData.append(`parcours[${i}][datedebut]`, p.datedebut);
      formData.append(`parcours[${i}][code_formation]`, code);
    });

    // Utilisation de PATCH pour la modification
    formData.append("_method", "PATCH"); 

    try {
      await axios.post(`http://localhost:8000/api/inscriptionComplete/${form.matricule}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: 'success',
        title: 'Modification réussie!',
        text: `L'information de ${form.matricule} a été modifié avec succès!`,
        background: '#1e1e2f',
        color: 'white',
        timer: 3000,
        showConfirmButton: false,
        position: "bottom",
        toast: true
      });
      if(refreshList) refreshList(); // Déclencher le rafraîchissement
      handleClose();
    } 
    catch (error) {
      console.error(error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        text: `Impossible de modifier: ${JSON.stringify(error.response?.data?.errors || error.message)}`,
        background: '#1e1e2f',
        color: 'white',
        showConfirmButton: true,
        position: "center",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Inscription</Modal.Title>
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
              <h5 className="text-center fw-bold">1. Informations Personnelles</h5>
            </div>
            <Row>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom *</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} required/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénoms</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} required/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date de naissance</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today}/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2" ><Form.Label>Lieu de naissance</Form.Label><Form.Control type="text" name="lieunaiss" value={form.lieunaiss} onChange={handleChange} /></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange}><option value="">-- Choisir --</option><option>Masculin</option><option>Feminin</option></Form.Select></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Adresse Actuelle</Form.Label><Form.Control name="adresse" value={form.adresse} onChange={handleChange} /></Form.Group></Col>
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
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Date d’inscription</Form.Label><Form.Control type="date" name="dateinscrit" value={form.dateinscrit} onChange={handleChange}/></Form.Group></Col>
              <Col lg={4}><Form.Group className="mb-2"><Form.Label>Année Scolaire</Form.Label><Form.Select name="anneesco" value={form.anneesco} onChange={handleChange}><option value="">-- Choisir --</option>{schoolYears.map((y, i) => <option key={i}>{y}</option>)}</Form.Select></Form.Group></Col>
              <Col lg={6}><Form.Group className="mb-2"><Form.Label>Durée</Form.Label><Form.Select name="duree" value={form.duree} onChange={handleChange}><option>--choisir la durée--</option> <option>3 mois</option><option>2 ans</option></Form.Select></Form.Group></Col>
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
                  <Form.Select value={p.nomformation} onChange={e => handleParcoursChange(i, "nomformation", e.target.value)} required>
                    <option value="">-- Choisir formation --</option>
                    {parcoursOption.map((parcours) => 
                      (<option key={parcours.code_formation} value={parcours.nomformation}>
                        {parcours.nomformation} 
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
          </div>
          <div className="mb-3">
            <Button variant="outline-primary" className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 text-white p-1 rounded" onClick={addNewParcours}><FaPlus /> Ajouter Parcours</Button>
          </div>

          {/* BOUTONS */}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-danger" onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="primary" className="gap-2 px-4 py-2 text-white bg-indigo-600 text-white p-1 rounded">Modifier</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificationInscription;