import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaGraduationCap, FaPlus, FaTrash, FaUserAlt } from "react-icons/fa";
import { GraduationCap, User, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";

const url = "http://localhost:8000/api";

const ModificationAcademique = ({ show, handleClose, selectedPersonne: selectedPersonneProp ,refreshList }) => {
  const today = new Date().toISOString().split("T")[0];

  const [selectedPersonne, setSelectedPersonne] = useState(null);

  useEffect(() => {
    if(selectedPersonneProp) {
      setSelectedPersonne(selectedPersonneProp);
    }
  }, [selectedPersonneProp]);

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
    type_inscrit: "",
    nomniveau: "",
    code_niveau: "",
    photo: null,
    profileImage: "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
  });

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

  useEffect(() => {
    if (selectedPersonne) {
      // Préremplir le formulaire principal
      setForm({
        nom: selectedPersonne.inscription?.personne?.nom || "",
        prenom: selectedPersonne.inscription?.personne?.prenom || "",
        naiss: selectedPersonne.inscription?.personne?.naiss || "",
        lieunaiss: selectedPersonne.inscription?.personne?.lieunaiss || "",
        sexe: selectedPersonne.inscription?.personne?.sexe || "",
        adresse: selectedPersonne.inscription?.personne?.adresse || "",
        cin: selectedPersonne.inscription?.personne?.cin || "",
        datedel: selectedPersonne.inscription?.personne?.datedel || "",
        lieucin: selectedPersonne.inscription?.personne?.lieucin || "",
        nompere: selectedPersonne.inscription?.personne?.nompere || "",
        nommere: selectedPersonne.inscription?.personne?.nommere || "",
        nomtuteur: selectedPersonne.inscription?.personne?.nomtuteur || "",
        adressparent: selectedPersonne.inscription?.personne?.adressparent || "",
        adresstuteur: selectedPersonne.inscription?.personne?.adresstuteur || "",
        phoneparent: selectedPersonne.inscription?.personne?.phoneparent || "",
        phonetuteur: selectedPersonne.inscription?.personne?.phonetuteur || "",
        dateinscrit: selectedPersonne.inscription?.dateinscrit || "",
        anneesco: selectedPersonne.inscription?.anneesco || "",
        type_inscrit: selectedPersonne.type_inscrit || "",
        nomniveau: selectedPersonne.niveau?.nomniveau || "",
        photo: null,
        profileImage: selectedPersonne.inscription?.personne?.photo
          ? `http://localhost:8000/storage/${selectedPersonne.inscription.personne.photo}`
          : "https://placehold.co/128x128/FFFFFF/000000?text=Photo",
      });

      // Préremplir le niveau académique pour le modal
      if (selectedPersonne.niveau) {
        setniveauForm([
          {
            nomniveau: selectedPersonne.niveau.nomniveau,
            datedebut: selectedPersonne.inscription?.dateinscrit || "",
          },
        ]);
      } else {
        setniveauForm([]); // aucun niveau existant
      }
    }
  }, [selectedPersonne]);


  // Générer années scolaires
  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      years.push(`${annee}-${annee + 1}`);
    }
    return years.reverse();
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

      if (field === "nomniveau") {
        const niveau = niveauOption.find(n => n.nomniveau === value);
        updated[index].code_niveau = niveau?.code_niveau || "";
      }

      return updated;
    });
  };


  const addNewNiveau = () => {
    setniveauForm(prev => [...prev, { nomniveau: ""}]);
  };

  const removeniveau = (index) => {
    setniveauForm(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const niveauxAvecCode = niveauForm.map(n => {
      const niveau = niveauOption.find(opt => opt.nomniveau === n.nomniveau);
      return { ...n, code_niveau: niveau?.code_niveau };
    });

    const formData = new FormData();
    
    // 🎯 CORRECTION ESSENTIELLE : Spoofer la méthode PUT avec POST
    formData.append("_method", "PUT"); 

    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined && key !== "profileImage") {
        formData.append(key, form[key]);
      }
    }

    if (niveauxAvecCode.length > 0 && niveauxAvecCode[0].code_niveau) {
      formData.append("code_niveau", niveauxAvecCode[0].code_niveau);
    } 

    if (form.photo) {
      formData.append("photo", form.photo);
    }

    // --- 5. Envoi de la requête ---
    try {
      // 🎯 UTILISER axios.post avec la méthode 'PUT' spoofer
      await axios.post(
        `${url}/updateacademique/${selectedPersonne.no_inscrit}`,
        formData,
        { 
            headers: { 
                "Content-Type": "multipart/form-data" 
            } 
        }
      );

      Swal.fire({
        icon: "success",
        text: "Données modifiées avec succès !",
        background: "#1e1e2f",
        color: "white",
        showConfirmButton: false,
        timer: 2000,
      });

      if (refreshList) refreshList();
      handleClose();
    } 
    catch (error) {
      console.error(error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Erreur de modification",
        text: error.response?.data?.message || JSON.stringify(error.response?.data.errors) || "Une erreur inconnue s'est produite.",
        background: "#1e1e2f",
        color: "white",
        showConfirmButton: true,
      });
    }
  };



  
  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nouvelle Inscription Générale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPersonne ?(
          <Form onSubmit={handleEdit} className="space-y-8">

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
                <Col lg={4}><Form.Group className="mb-2"><Form.Label>Nom *</Form.Label><Form.Control name="nom" value={form.nom} onChange={handleChange} required/></Form.Group></Col>
                <Col lg={4}><Form.Group className="mb-2"><Form.Label>Prénoms</Form.Label><Form.Control name="prenom" value={form.prenom} onChange={handleChange} required/></Form.Group></Col>
                <Col lg={4}><Form.Group className="mb-2"><Form.Label>Date de naissance</Form.Label><Form.Control type="date" name="naiss" value={form.naiss} onChange={handleChange} max={today}/></Form.Group></Col>
                <Col lg={4}><Form.Group className="mb-2" ><Form.Label>Lieu de naissance</Form.Label><Form.Control type="text" name="lieunaiss" value={form.lieunaiss} onChange={handleChange} /></Form.Group></Col>
                <Col lg={4}><Form.Group className="mb-2"><Form.Label>Sexe</Form.Label><Form.Select name="sexe" value={form.sexe} onChange={handleChange}><option value="">-- Choisir le sexe--</option><option>Masculin</option><option>Feminin</option></Form.Select></Form.Group></Col>
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
                <Col lg={6}><Form.Group className="mb-2"><Form.Label>Année scolaire</Form.Label><Form.Select name="anneesco" value={form.anneesco} onChange={handleChange}><option value="">-- Choisir l'année scolaire --</option>{generateAnnee().map(a => <option key={a}>{a}</option>)}</Form.Select></Form.Group></Col>
                <Col lg={12}><Form.Group className="mb-2"><Form.Label>Type d'Inscription</Form.Label><Form.Select name="type_inscrit" value={form.type_inscrit} onChange={handleChange}>
                  <option value="">--Choisir le type d'inscription--</option><option value="Inscription">Inscription</option><option value="Réinscription">Réinscription</option>
                </Form.Select></Form.Group></Col>
              </Row>
            </div>

            {/* niveau */}
            <div className="p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-gray-200">
              <div className="flex items-center text-indigo-600 mb-6 border-b pb-4 border-indigo-100">
                <FaGraduationCap className="w-6 h-6 mr-3" />
                <h5 className="items-center fw-bold">5. Choisir le niveau des apprenants</h5>
              </div>
              {niveauForm.map((p, i) => (
                  <Row key={i} className="align-items-center mb-2">
                    <Col lg={5}>
                      <Form.Select value={p.nomniveau} onChange={e => handleNiveauChange(i, "nomniveau", e.target.value)} required>
                        <option value="">-- Choisir le niveau --</option>
                        {niveauOption.map((niveau) =>(
                            <option key={niveau.code_niveau} value={niveau.nomniveau}>
                                {niveau.nomniveau}
                            </option>
                          ))
                        }
                        
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
              <Button type="submit" variant="primary" className="gap-2 px-4 py-2 text-white bg-indigo-600 p-1 rounded">Modifier</Button>
            </div>
          </Form>
        ): (
          <p className="text-center text-gray-500">Chargement des informations...</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModificationAcademique;

