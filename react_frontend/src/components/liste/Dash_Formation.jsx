import React,{useState, useEffect} from "react";
import axios from "axios";
import { FaEye, FaList, FaStar } from "react-icons/fa";
import { Form } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer  } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import CountUp from 'react-countup';
import Swal from "sweetalert2";

const PRIMARY_COLOR = '#143C78';
const PIE_COLORS = ["#143C78", "#f59e0b", "#e11d48", "#0ea5e9", "#10b981"];

const url = "http://localhost:8000/api";

const DashboadFormation = ({onViewListPro}) => {
  const [total, setTotal] = useState(0);
  const [totalMusic, setTotalMusic] = useState(0);
  const [totalInfo, setTotalInfo] = useState(0);
  const [totalCoupe, setTotalCoupe] = useState(0);
  const [totalLangues, setTotalLangues] = useState(0);
  const [totalPatisserie, setTotalPatisserie] = useState(0);
  const [topParcours, setTopParcours] = useState(null);

  const [typeFormation, setTypeFormation] = useState('');
  const [nomFormation, setNomFormation] = useState('');
  const [anneeScolaire, setAnneeScolaire] = useState('');
  const [apprenants, setApprenants] = useState([]);

  const [data, setData] = useState([]);
  const [parcours, setParcours] = useState([]);

  useEffect(() => {
    axios.get(`${url}/formations/trimestre`)
    .then(res => {
      const transformed = res.data.Data.map(item => ({   
        annee: item.annee,
        trimestre: item.trimestre,
        total: item.total
      }));
      setData(transformed);
    }).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/count`).then(response => { setTotal(response.data.total);}).catch(error => { console.error("Erreur:", error);});
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/musique`).then(response => { setTotalMusic(response.data.total);}).catch(error => { console.error("Erreur:", error);});
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/info`).then(res => { setTotalInfo(res.data.total); }) .catch(error => { console.error("Erreur:", error); });
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/coupe`).then(res => { setTotalCoupe(res.data.total); }) .catch(error => { console.error("Erreur:", error); });
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/langues`) .then(res => { setTotalLangues(res.data.total); })  .catch(error => { console.error("Erreur:", error); });
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/patisserie`) .then(res => { setTotalPatisserie(res.data.total);}) .catch(error => { console.error("Erreur:", error); });
  }, []);

  useEffect(() => {
    axios.get(`${url}/inscriptions/topParcours`).then(res => {setTopParcours(res.data.Data);}).catch(error => { console.error("Erreur:", error);  });
  }, []);

  useEffect(() => {
    axios.get(`${url}/parcours`).then(res => { setParcours(res.data) }).catch(err => console.error(err) );
  }, []);

  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      years.push(`${annee}-${annee + 1}`);
    }
    return years.reverse();
  };

  const handleListerParOrdre = async () => {
    try {
      if (!typeFormation || !nomFormation || !anneeScolaire) {
        return(
          Swal.fire({
            icon: 'warning',
            text: "Veuillez sélectionner tous les filtres !",
            showConfirmButton: true,
            background: '#1e1e2f',
            color: 'white',
            position: "center",
            backgroundPosition: "center",
          })
        )
      }

      const response = await axios.get(`${url}/inscriptions/filter`, {
        params: { type_formation: typeFormation, nom_formation: nomFormation, annee_scolaire: anneeScolaire }
      });

      const data = response.data.Data || [];

      if (data.length === 0) {
        setApprenants([]);
        Swal.fire({
          icon: 'warning',
          text: "Aucun apprenant trouvé pour ces critères!",
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
          position: "center",
          backgroundPosition: "center",
        })
      }
      else {
        setApprenants(data);
        Swal.fire({
          icon: 'success',
          text: `${data.length} apprenant(s) trouvé(s)!`,
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
          position: "center",
          backgroundPosition: "center",
        })
        
      }

    } 
    catch (error) {
      console.error(error);
        Swal.fire({
          icon: 'error',
          text: "Une erreur est survenue lors du chargement des inscrits!",
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
          position: "center",
          backgroundPosition: "center",
        })
    }
  };

  const handleExportPdf = () => {
    if (!typeFormation || !nomFormation || !anneeScolaire) {
      return (
        Swal.fire({
          icon: 'warning',
          text: "Veuillez sélectionner et lister les apprenants avant d'exporter !",
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
          position: "center",
          backgroundPosition: "center",
        })
      )
    }
    if (!apprenants || apprenants.length === 0) {
      return (
        Swal.fire({
          icon: 'error',
          text: "La liste est vide. Veuillez filtrer d'abord.!",
          showConfirmButton: false,
          background: '#1e1e2f',
          color: 'white',
          position: "center",
          backgroundPosition: "center",
          toast: true
        })
      )
    }

    const doc = new jsPDF();

    const titre = "LISTE DES APPRENANTS FILTRÉS";
    const sousTitre = `Formation: ${nomFormation} - Année Scolaire: ${anneeScolaire}`;

    // 4. Préparation des données pour autoTable
    const headers = [
      "N° Inscription", 
      "Nom & Prénom(s)", 
      "Date et lieu de Naissance", 
      "Sexe", 
      "Adresse Actuelle",
      "Durée de la formation",
      "Formation"
    ];

    const data = apprenants.map(liste => {
      return [
        liste.no_inscrit,
        `${liste.nom || ""} ${liste.prenom || ""}`,
        `${liste.naiss || ""} à ${liste.lieunaiss || ""}`,
        liste.sexe || "",
        liste.adresse || "",
        liste.duree || "",
        liste.nomformation
      ];
    });
    doc.setFontSize(16);
    doc.text(titre, 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text(sousTitre, 105, 22, null, null, "center");

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [20, 60, 120] },
    });

    const filename = `Liste_Apprenants_${nomFormation.replace(/\s/g, '')}_${anneeScolaire}.pdf`;
    doc.save(filename);

    Swal.fire({
      icon: 'success',
      text: ` Liste de ${nomFormation} par ordre en fichier pdf!`,
      background: '#1e1e2f',
      color: 'white',
      showConfirmButton: true,
      position: "center",
      backgroundPosition: "center"
    })
  };

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${url}/formations/effectifs`)
    .then(res => {
      setStats(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Erreur lors du chargement des stats: "), err;
    })
  }, []);

  if(loading) return <p className="pt-5 text-center">Chargement....</p>

  const DashboardContent = () => (
    
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <div className="flex items-center">
          <FaList className="w-6 h-6 mx-1"/>
          <h1 className="fw-bold text-default">Tableau de bord pour la formation</h1>
        </div>
        <div className="text-center mb-4">
          <h4 className="text-primary fw-bold fst-italic">« Centre de Formation Professionnelle Laura Vicuna Anjarasoa (CFP) »</h4>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 text-white p-1 rounded" onClick={onViewListPro}> <FaEye size={25} height={100} className="mx-1"/> Voir la liste</button>
      </div>

        <p className="mb-2 p-1 fw-bold flex itmems-center">
          <FaStar className="w-6 h-6 mr-3 text-danger" /> NB : La formation la plus suivie : 
          <span className="mx-2 text-success">
            {" "}
            {topParcours ? topParcours.nomformation : "Chargement..."}{" "}
          </span>
          {topParcours && (
            <small className="text-muted mt-1 mx-2 text-bold">
              {" "}
              ({topParcours.total} inscrits)
            </small>
          )}
        </p>
      <div className="row g-3 mb-4">
        {[
          { title: "Effectif Total", icon: "fas fa-users", value: total, color: "text-green-500", bg: "bg-green-100", progress: "bg-green-500" },
          { title: "Musique", icon: "fas fa-music", value: totalMusic, color: "text-red-500", bg: "bg-red-100", progress: "bg-red-500" },
          { title: "Informatique", icon: "fas fa-laptop-code", value: totalInfo, color: "text-blue-500", bg: "bg-blue-100", progress: "bg-blue-500" },
          { title: "Coupe et Coutûre", icon: "fas fa-cut", value: totalCoupe, color: "text-pink-500", bg: "bg-pink-100", progress: "bg-pink-500" },
          { title: "Langues", icon: "fas fa-language", value: totalLangues, color: "text-purple-500", bg: "bg-purple-100", progress: "bg-purple-500" },
          { title: "Pâtisserie", icon: "fas fa-birthday-cake", value: totalPatisserie, color: "text-yellow-500", bg: "bg-yellow-100", progress: "bg-yellow-500" },
        ].map((item, idx) => (
          <div key={idx} className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
            <div className="card shadow-sm text-center p-3 h-100 hover:scale-105 transition-transform duration-300">
              <div className={`fs-1 mb-3 ${item.color}`}>
                <i className={item.icon}></i>
              </div>
              <h3 className="mb-1 font-semibold p-2 text-sm">{item.title}</h3>
              <p className={`text-2xl font-bold mb-2 ${item.color}`}>
                <CountUp end={item.value} duration={1.5} separator="," />
              </p>
              <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200">
                <div className={`h-2 ${item.progress} transition-all duration-1000`} style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-4 col-md-12">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-primary fw-bold mb-3">Recherche la liste de chaque formation</h6>
            <div className="row g-3">
              <div className="col-12">
                <Form.Label className="form-label mb-0">Type de Formation</Form.Label>
                <Form.Select className="text-center" value={typeFormation} onChange={(e) => setTypeFormation(e.target.value)}>
                  <option value="">---Type de la Formation---</option>
                  <option value="Long Terme">Long Terme</option>
                  <option value="Court Terme">Court Terme</option>
                </Form.Select>

              </div>
              <div className="col-12">
                <Form.Label className="form-label mb-0">Nom Formation</Form.Label>
                <Form.Select className="text-center" value={nomFormation} onChange={(e) => setNomFormation(e.target.value)}>
                  <option value="">---Nom de la Formation---</option>
                  {parcours.map((p) => (
                    <option key={p.code_formation} value={p.nomformation}>{p.nomformation}</option>
                  ))}
                </Form.Select>


              </div>
              <div className="col-12">
                <Form.Label className="form-label mb-0">Année Scolaire: </Form.Label>
                <Form.Select className="text-center" value={anneeScolaire} onChange={(e) => setAnneeScolaire(e.target.value)} >
                  <option value="">---Année Scolaire---</option>
                  {generateAnnee().map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Form.Select>
              </div>
            </div>
            
            <div className="flex items-center mt-5 text-center">
              <button className="btn btn-warning text-white fw-bold mx-2 w-100 py-2"
                style={{backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR,
                  boxShadow: '0 4px 6px rgba(20, 60, 120, 0.2)'
                }} onClick={handleListerParOrdre} >
                Lister par ordre
              </button>
               <button className="btn btn-warning text-white fw-bold w-100 bg-red-500 mx-2 py-2"
                  style={{ boxShadow: '0 4px 6px rgba(20, 42, 120, 0.2)'
                  }} onClick={handleExportPdf}>
                Exporter en PDF
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-6">
          <div className="card shadow-sm">
            <div className="bg-default rounded-xl shadow-lg ring-1 ring-gray-200 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">N° Inscription</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Nom et Prénoms</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Date et lieu de Naissance</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Sexe</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Adresse Actuelle</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    { apprenants.length > 0 ? apprenants.map((liste, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.no_inscrit}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-700">
                          <b className="text-gray-800">{liste.nom}</b> {liste.prenom}
                        </td>
                        <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.naiss} à {liste.lieunaiss}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.sexe}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.adresse}</td>
                      </tr>
                    )): (
                      <td colSpan={5} className="text-center p-5 text-default">
                        Recherche des aprenants par formation et année scolaire....
                      </td>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6">
          <div className="card shadow-sm p-3 h-100" style={{ minHeight: '350px' }}>
            <h2 className="fw-bold mb-3 text-center text-xl font-semibold text-indigo-600">
              📈 Répartition des effectifs par formation
            </h2>

            <ResponsiveContainer width="100%" style={{ marginTop: '15px' }} height={600}>
              <PieChart>
                <Pie data={stats.effectifs} dataKey="value" nameKey="name"  cx="50%" cy="50%" outerRadius={180}  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                  {stats.effectifs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} élèves`, "Effectif"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-6 col-md-6">
          <div className="card shadow-sm p-3 h-100" style={{ minHeight: '350px' }}>
            <h2 className="fw-bold mb-3 text-center text-xl font-semibold text-indigo-600">
              📊 Effectifs des apprenants par trimestre
            </h2>
            
            <ResponsiveContainer width="100%" height={600}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20}} barCategoryGap='2%'>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                  <XAxis dataKey="trimestre" label={{ value: "Trimestre", position: "insideBottom", offset: -10 }}/>
                  <YAxis label={{ value: "Effectifs", angle: -90, position: "insideLedft" }} />
                  <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10 }}
                    labelStyle={(value) => [`${value} formations`, 'Effectifs']}/>
                  <Bar dataKey='total' fill="#2563eb" name="Nombre d'inscrits" maxBarSize={70} radius={[10, 10, 0, 0]}
                    animationDuration={1200} label={{ position: 'top', fill: "green", fontSize: 13, fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
           
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div>
      <div className="container-fluid p-4 bg-default min-vh-100">
        <div className="row">
          <div className="col-12">
            <DashboardContent /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboadFormation;