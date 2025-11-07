import React, { useState, useEffect } from "react";
import { FaEye, FaList } from "react-icons/fa";
import axios from "axios";
import CountUp from "react-countup";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const url = 'http://localhost:8000/api';
const PIE_COLORS = ["#143C78", "#f59e0b", "#e11d48", "#0ea5e9", "#10b981"];

const DashboadrEleve = ({ onViewList }) => {
  const PRIMARY_COLOR = '#143C78';
  const [niveau, setNiveau] = useState([]);

  const [nomNiveau, setNomNiveau] = useState("");
  const [anneeScolaire, setAnneeScolaire] = useState("");
  const [eleve, setEleve] = useState([]);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);

// États regroupés dans un seul objet
const [counts, setCounts] = useState({
  totalNiveau: 0,
  seconde: 0,
  premiere: 0,
  terminalA: 0,
  terminalC: 0,
  terminalD: 0,
});

// ✅ Fonction générique pour tous les compteurs
const fetchCounts = async () => {
  try {
    const endpoints = [
      { key: "totalNiveau", url: `${url}/countNiveau` },
      { key: "seconde", url: `${url}/countSeconde` },
      { key: "premiere", url: `${url}/countPremiere` },
      { key: "terminalA", url: `${url}/countTerminalA` },
      { key: "terminalC", url: `${url}/countTerminalC` },
      { key: "terminalD", url: `${url}/countTerminalD` },
    ];

    // Appels parallèles plus rapides
    const results = await Promise.all(
      endpoints.map((e) => axios.get(e.url).catch(() => ({ data: { data: 0 } })))
    );

    const newCounts = results.reduce((acc, res, idx) => {
      acc[endpoints[idx].key] = res.data.data || 0;
      return acc;
    }, {});

    setCounts(newCounts);
  } catch (error) {
    console.error("Erreur lors du chargement des effectifs :", error);
  }
};

  const fetchNiveau = async () => {
    axios.get(`${url}/niveau`).then(res => { setNiveau(res.data.data) }).catch(err => {console.error(err) });
  }

  const fetchEffectifs = async () => {
    axios.get(`${url}/eleve/effectifs`).then(res => { setStats(res.data); setLoading(false) }).catch(err => { console.error(err) });
  };

  const fetchAnnee = async () => {
    axios.get(`${url}/eleve/Annee`).then(res => { setDatas(res.data.data); }).catch(err => {console.error(err)});
  };

  useEffect(() => {
    fetchCounts();
    fetchNiveau();
    fetchEffectifs();
    fetchAnnee();
  }, []);

  const handleListerParOrdre = async () => {
    try{
      if(!nomNiveau || !anneeScolaire) {
        return(
          Swal.fire({
            icon: 'warning',
            text: 'Veuillez sélectionner tous les filtres !',
            showConfirmButton: true,
            background: "#1e1e2f",
            color: 'white',
            position: 'center',
          })
        )
      }

      const res = await axios.get(`${url}/filterNiveau`, {
        params: {
          nomniveau: nomNiveau, anneesco: anneeScolaire, 
        }
      })

      const data = res.data.data;

      if (data.length === 0) {
        setEleve([]);
        Swal.fire({
          icon: 'warning',
          text: "Aucune élève trouvée pour ces critères!",
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
          position: "center",
          backgroundPosition: "center",
        })
      }
      else {
        setEleve(data);
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
  }

  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];

    for(let annee = 2020; annee <= currentAnnee; annee++)
    {
      years.push(`${annee}-${annee + 1}`)
    }

    return years.reverse();
  }

  const handleExportPdf = () => {
    if (!nomNiveau || !anneeScolaire)
      return Swal.fire({
        icon: "warning",
        text: "Sélectionnez et listez avant d’exporter !",
        background: "#1e1e2f",
        color: "white",
      });

    if (!eleve.length)
      return Swal.fire({
        icon: "error",
        text: "La liste est vide, filtrez d’abord !",
        background: "#1e1e2f",
        color: "white",
      });

    const doc = new jsPDF();
    const titre = "LISTE DES ÉLÈVES FILTRÉS";
    const sousTitre = `Classe : ${nomNiveau} | Année : ${anneeScolaire}`;

    const headers = [
      "N° Inscription",
      "Nom et Prénom(s)",
      "Date et lieu de Naissance",
      "Sexe",
      "Adresse Actuelle",
      "Classe",
    ];
    const rows = eleve.map((e) => [
      e.no_inscrit,
      `${e.nom || ""} ${e.prenom || ""}`,
      `${e.naiss || ""} à ${e.lieunaiss || ""}`,
      e.sexe,
      e.adresse,
      e.nomniveau,
    ]);

    doc.setFontSize(16);
    doc.text(titre, 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text(sousTitre, 105, 22, null, null, "center");

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [20, 60, 120] },
    });

    doc.save(`Liste_${nomNiveau}_${anneeScolaire}.pdf`);

    Swal.fire({
      icon: "success",
      text: `PDF exporté avec succès !`,
      background: "#1e1e2f",
      color: "white",
    });
  };

  const DashboardContent = () => (
    <div className="container-fluid p-5 shadow">
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <div className="flex items-center">
          <FaList className="w-6 h-6 mx-1"/>
          <h1 className="fw-bold">Tableau de bord pour le Lycée </h1>
        </div>
        <p className="mb-0 fw-bold">
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 text-white p-1 rounded" onClick={onViewList}> <FaEye size={25} height={100} className="mx-1"/> Voir la liste</button>
        </p>
      </div>

      <div className="text-center mb-4">
        <h4 className="text-primary fw-bold fst-italic">« Lycée Catholique Laura Vicuna Anjarasoa Ankofafa Fianarantsoa (CFP) »</h4>
      </div>

      <div className="row g-3 mb-4">
        {[
          {title: "Effectifs Total", icon: "fas fa-users", value: counts.totalNiveau, color:'text-green-500', bg: 'bg-green-100', progress: 'bg-green-500' },
          {title: "Seconde", icon: "fas fa-user-plus", value: counts.seconde, color:'text-yellow-500', bg: 'bg-yellow-100', progress: 'bg-yellow-500' },
          {title: "Première", icon: "fas fa-user-plus", value: counts.premiere, color:'text-blue-500', bg: 'bg-blue-100', progress: 'bg-blue-500' },
          {title: "Terminal A", icon: "fas fa-user-graduate", value: counts.terminalA, color:'text-cyan-500', bg: 'bg-cyan-100', progress: 'bg-cyan-500' },
          {title: "Terminal C", icon: "fas fa-users", value: counts.terminalC, color:'text-blue-700', bg: 'bg-blue-200', progress: 'bg-blue-600' },
          {title: "Terminal D", icon: "fas fa-graduation-cap", value: counts.terminalD, color:'text-green-500', bg: 'bg-green-100', progress: 'bg-green-500' },
        ].map((item, idx) => (
          <div key={idx} className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
            <div className="card shadow-sm text-center p-3 h-100 hover:scale-105 transition-transform duration-300">
              <div className={`fs-1 mb-3 ${item.color}`} >
                <i className={item.icon}></i>
              </div>

              <h3 className="mb-1 font-semibold p-2 text-sm" >{item.title}</h3>
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
          <h6 className="text-primary fw-bold mb-3">Recherche des élèves par classe et Année Scolaire</h6>
          <div className="row g-3">
            <div className="col-12">
              <Form.Label className="form-label mb-0" htmlFor="classe">Classe :</Form.Label>
              <Form.Select className="text-center" value={nomNiveau} onChange={(e) => setNomNiveau(e.target.value)}  >
                <option value="">--- Classe ---</option>
                {niveau.map((n) => (
                  <option key={n.code_niveau} value={n.nomniveau}>{n.nomniveau}</option>
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
          <div className="bg-defaut rounded-xl shadow-lg ring-1 ring-gray-200 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">N° Inscription</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Nom et Prénoms</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Date de Naissance</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Sexe</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Adresse Actuelle</th>
                  </tr>
                </thead>

                <tbody className="divide-y devide-gray-100">
                  {eleve.length > 0 ? eleve.map((eleve, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{eleve.no_inscrit}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700"><b>{eleve.nom}</b> {eleve.prenom}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{eleve.naiss} à {eleve.lieunaiss}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{eleve.sexe}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{eleve.adresse}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center p-5 text-default">
                        Recherche des élèves par classe et année scolaire....
                      </td>
                    </tr>
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

          {stats && stats.effectifs && stats.effectifs.length > 0 ? (
            <ResponsiveContainer width="100%" height={600}>
              <PieChart>
                <Pie data={stats.effectifs} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={180}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                  {stats.effectifs.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} élèves`, 'Effectif']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted mt-5 ">Aucune donnée d’effectif disponible.</p>
          )}
        </div>
      </div>
      <div className="col-lg-6 col-md-6">
        <div className="card shadow-sm p-3 h-100" style={{ minHeight: '350px' }}>
          <h2 className="fw-bold mb-3 text-center text-xl font-semibold text-indigo-600">
            📊 Effectifs des apprenants par trimestre
          </h2>
          
          {datas && datas.length > 0 ? (
            <ResponsiveContainer width="100%" height={600}>
              <BarChart data={datas} margin={{ top: 10, right: 30, left: 0, bottom: 20 }} barCategoryGap="2%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="annee" label={{ position: "insideBottom", offset: -5, fontWeight: 'bold' }} />
                <YAxis label={{ value: "Effectifs", angle: -90, position: "insideLeft", fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                  }} labelStyle={{ color: "#4f46e5", fontWeight: 'bold' }}
                  formatter={(value) => [`${value} élèves`, 'Effectif']} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="total" fill="#4f46e5" name="Effectifs" maxBarSize={70} radius={[10, 10, 0, 0]} 
                  animationDuration={1200} label={{ position: 'top', fill: "green", fontSize: 13, fontWeight: 'bold' }}/>
              </BarChart>
            </ResponsiveContainer>
          ): (
            <p className="text-center text-muted mt-5">Aucune données d'effectif disponible</p>
          )}
          
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

export default DashboadrEleve;