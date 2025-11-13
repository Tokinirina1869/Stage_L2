import React, { useState, useEffect, useCallback } from "react";
import { FaEye, FaList, FaFilePdf, FaFileExcel, FaSearch } from "react-icons/fa";
import axios from "axios";
import CountUp from "react-countup";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { saveAs } from 'file-saver'; 
import * as XLSX from 'xlsx';

// Ensure the local URL is accessible for the component
const url = 'http://localhost:8000/api';
const PIE_COLORS = ["#143C78", "#f59e0b", "#e11d48", "#0ea5e9", "#10b981", "#8b5cf6"];
const PRIMARY_COLOR = '#143C78';

const DashboardEleve = ({ onViewList }) => {
  const [niveau, setNiveau] = useState([]);
  const [nomNiveau, setNomNiveau] = useState("");
  const [anneeScolaire, setAnneeScolaire] = useState("");
  const [eleve, setEleve] = useState([]);

  const [sexe, setSexe] = useState(null);
  const [minmaj, setMinMaj] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]); // Data for BarChart

  // États regroupés dans un seul objet
  const [counts, setCounts] = useState({
    totalNiveau: 0,
    seconde: 0,
    premiere: 0,
    terminalA: 0,
    terminalC: 0,
    terminalD: 0,
  });

  // ✅ Fonction générique pour tous les compteurs (LOGIC RETAINED)
  const fetchCounts = useCallback(async () => {
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
  }, []);

  const fetchNiveau = useCallback(async () => {
    axios.get(`${url}/niveau`).then(res => { setNiveau(res.data.data) }).catch(err => {console.error(err) });
  }, []);

  const fetchEffectifs = useCallback(async () => {
    // Assuming this endpoint returns the data structure needed for all three pie charts
    axios.get(`${url}/eleve/effectifs`).then(res => { setStats(res.data); setLoading(false) }).catch(err => { console.error(err); setLoading(false); });
  }, []);
 
  const fetchSexe = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/LyceeParSexe`);
      const rawData = res.data.data;

      // 🔄 Transformer les données pour le PieChart
      const formatted = rawData.map(item => ({
        name: item.sexe === "M" ? "Masculin" : 
              item.sexe === "F" ? "Féminin" : item.sexe,
        value: item.total_inscrits
      }));

      setSexe(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const fetchMinMaj = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/LyceeMineurMajeur`);
      const rawData = res.data;

      // Vérifie si les données existent
      if (!rawData || (!rawData.mineurs && !rawData.majeurs)) {
        setMinMaj([]);
        setLoading(false);
        return;
      }

      // 🔄 Transformer les données pour le PieChart
      const formatted = [
        { name: "Mineur", value: rawData.mineurs || 0 },
        { name: "Majeur", value: rawData.majeurs || 0 }
      ];

      setMinMaj(formatted);
      setLoading(false);
    } catch (err) {
      console.error("Erreur fetch Min/Maj :", err);
      setMinMaj([]);
      setLoading(false);
    }
  }, []);


  const fetchAnnee = useCallback(async () => {
    axios.get(`${url}/eleve/Annee`).then(res => { setDatas(res.data.data); }).catch(err => {console.error(err)});
  }, []);

  useEffect(() => {
    fetchCounts();
    fetchNiveau();
    fetchEffectifs();
    fetchAnnee();
    fetchSexe();
    fetchMinMaj();
  }, [fetchCounts, fetchNiveau, fetchEffectifs, fetchAnnee,fetchSexe,fetchMinMaj]);

  // LOGIC RETAINED
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

  // LOGIC RETAINED
  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];

    for(let annee = 2020; annee <= currentAnnee; annee++)
    {
      years.push(`${annee}-${annee + 1}`)
    }

    return years.reverse();
  }

  // LOGIC RETAINED
  async function handleExportPdf() {
    if (!nomNiveau || !anneeScolaire) {
      return Swal.fire({
        icon: "warning",
        text: "Sélectionnez et listez avant d’exporter !",
        background: "#1e1e2f",
        color: "white",
      });
    }

    if (!eleve.length) {
      return Swal.fire({
        icon: "error",
        text: "La liste est vide, filtrez d’abord !",
        background: "#1e1e2f",
        color: "white",
      });
    }

    // ----------------------------
    // 1️⃣ Génération du PDF
    // ----------------------------
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

    const pdfBytes = doc.output("arraybuffer");

    // ----------------------------
    // 2️⃣ Enregistrement (avec fallback)
    // ----------------------------
    try {
      if (window.showSaveFilePicker) {
        // ✅ Navigateur compatible File System Access API
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `Liste_${nomNiveau}_${anneeScolaire}.pdf`,
          types: [
            {
              description: "Fichiers PDF",
              accept: { "application/pdf": [".pdf"] },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(pdfBytes);
        await writable.close();

        Swal.fire({
          icon: "success",
          text: "PDF enregistré avec succès !",
          background: "#1e1e2f",
          color: "white",
        });
      } else {
        // ⚙️ Fallback pour les navigateurs non compatibles (Firefox, Safari, etc.)
        doc.save(`Liste_${nomNiveau}_${anneeScolaire}.pdf`);

        Swal.fire({
          icon: "info",
          text: "Votre navigateur ne permet pas le choix du dossier. Le fichier a été téléchargé automatiquement.",
          background: "#1e1e2f",
          color: "white",
        });
      }
    } catch (err) {
      console.error("Annulé ou erreur :", err);
      if (err.name !== "AbortError") {
        Swal.fire({
          icon: "error",
          text: "Erreur lors de l’enregistrement du fichier.",
          background: "#1e1e2f",
          color: "white",
        });
      }
    }
  }

  // LOGIC RETAINED
  async function handleExportExcel() {
    if (!nomNiveau || !anneeScolaire) {
      return Swal.fire({
        icon: "warning",
        text: "Sélectionnez et listez avant d’exporter !",
        background: "#1e1e2f",
        color: "white",
      });
    }

    if (!eleve.length) {
      return Swal.fire({
        icon: "error",
        text: "La liste est vide, filtrez d’abord !",
        background: "#1e1e2f",
        color: "white",
      });
    }

    try {
      // --------------------------
      // 1️⃣ Préparation des données
      // --------------------------
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
        e.sexe || "",
        e.adresse || "",
        e.nomniveau || "",
      ]);

      const data = [
        ["LISTE DES ÉLÈVES FILTRÉS"],
        [`Classe : ${nomNiveau} | Année : ${anneeScolaire}`],
        [],
        headers,
        ...rows,
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);

      // Largeur des colonnes
      ws["!cols"] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
      ];

      // Fusion des titres
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Liste élèves");

      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // --------------------------
      // 2️⃣ Enregistrement intelligent (File System Access API + fallback)
      // --------------------------
      const fileName = `Liste_${nomNiveau}_${anneeScolaire}.xlsx`;

      if (window.showSaveFilePicker) {
        // ✅ Chrome, Edge, Opera…
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "Fichier Excel",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                  ".xlsx",
                ],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        Swal.fire({
          icon: "success",
          text: "Excel enregistré avec succès !",
          background: "#1e1e2f",
          color: "white",
        });
      } else {
        // ⚙️ Fallback (navigateurs non compatibles)
        saveAs(blob, fileName);

        Swal.fire({
          icon: "info",
          text: "Votre navigateur ne permet pas le choix du dossier. Le fichier a été téléchargé automatiquement.",
          background: "#1e1e2f",
          color: "white",
        });
      }
    } catch (err) {
      console.error("Erreur export Excel :", err);
      if (err.name !== "AbortError") {
        Swal.fire({
          icon: "error",
          text: "Erreur lors de l’enregistrement du fichier Excel.",
          background: "#1e1e2f",
          color: "white",
        });
      }
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50"><p className="text-xl font-semibold text-gray-700 p-8 rounded-lg shadow-lg bg-white">Chargement des données du tableau de bord...</p></div>

  // Component for Chart Cards
  const ChartCard = ({ title, data }) => (
    <div className="bg-white p-6 shadow-xl rounded-xl h-full border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
        {title}
      </h2>
      <div className="h-[300px] sm:h-[400px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={50} paddingAngle={2}
                labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} className="shadow-lg" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`${value} élèves`, 'Effectif']} 
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500 font-medium">Aucune donnée d’effectif disponible pour ce graphique.</p>
          </div>
        )}
      </div>
    </div>
  );

  const BarChartCard = ({ title, data }) => (
    <div className="bg-white p-6 shadow-xl rounded-xl h-full border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
        {title}
      </h2>
      <div className="h-[300px] sm:h-[400px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap="10%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="annee" tickLine={false} axisLine={false} className="text-xs sm:text-sm font-semibold text-gray-600" />
              <YAxis tickLine={false} axisLine={false} className="text-xs sm:text-sm text-gray-600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: PRIMARY_COLOR, fontWeight: 'bold' }}
                formatter={(value) => [`${value} élèves`, 'Effectif']} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar 
                dataKey="total" 
                fill={PRIMARY_COLOR} 
                name="Effectifs" 
                maxBarSize={50} 
                radius={[10, 10, 0, 0]} 
                animationDuration={1500} 
                label={{ 
                  position: 'top', 
                  fill: "#4f46e5", 
                  fontSize: 12, 
                  fontWeight: 'bold' 
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500 font-medium">Aucune donnée d'effectif disponible.</p>
          </div>
        )}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <FaList className="w-8 h-8 text-indigo-700" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Tableau de bord Lycée
          </h1>
        </div>
        <button 
          className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02]" 
          onClick={onViewList}
        > 
          <FaEye size={20} /> Voir la liste
        </button>
      </div>

      <div className="text-center mb-10 p-4 bg-indigo-50/50 rounded-lg shadow-inner">
        <h4 className="text-xl font-serif italic font-semibold text-indigo-800">
          « Lycée Catholique Laura Vicuna Anjarasoa Ankofafa Fianarantsoa (CFP) »
        </h4>
      </div>

      {/* COUNTERS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
        {[
          {title: "Effectifs Total", icon: "fas fa-users", value: counts.totalNiveau, color:'text-green-600', bg: 'bg-green-50', progress: 'bg-green-500', max: counts.totalNiveau },
          {title: "Seconde", icon: "fas fa-user-plus", value: counts.seconde, color:'text-yellow-600', bg: 'bg-yellow-50', progress: 'bg-yellow-500', max: counts.totalNiveau },
          {title: "Première", icon: "fas fa-user-plus", value: counts.premiere, color:'text-blue-600', bg: 'bg-blue-50', progress: 'bg-blue-500', max: counts.totalNiveau },
          {title: "Terminal A", icon: "fas fa-user-graduate", value: counts.terminalA, color:'text-cyan-600', bg: 'bg-cyan-50', progress: 'bg-cyan-500', max: counts.totalNiveau },
          {title: "Terminal C", icon: "fas fa-users", value: counts.terminalC, color:'text-indigo-600', bg: 'bg-indigo-50', progress: 'bg-indigo-600', max: counts.totalNiveau },
          {title: "Terminal D", icon: "fas fa-graduation-cap", value: counts.terminalD, color:'text-red-600', bg: 'bg-red-50', progress: 'bg-red-500', max: counts.totalNiveau },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl shadow-lg border border-gray-100 ${item.bg} hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]`}>
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${item.bg.replace('50', '200')}`} style={{ color: item.color.split('-')[1] }}>
                <i className={`${item.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 text-center">{item.title}</h3>
            </div>
            <p className={`text-3xl font-extrabold mt-3 text-center ${item.color}`}>
              <CountUp end={item.value} duration={1.5} separator=" " />
            </p>
            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-gray-200">
                <div 
                  className={`h-1.5 ${item.progress} transition-all duration-1000 rounded-full`} 
                  style={{ width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {item.title === "Effectifs Total" ? 'Total général' : `${((item.value / item.max) * 100 || 0).toFixed(1)}% du total`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & TABLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Filter Card (Lg: 1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 shadow-xl rounded-xl h-full border border-indigo-100">
            <h6 className="text-lg font-bold mb-5 text-indigo-700 border-b pb-2">
              <FaSearch className="inline mr-2" />
              Filtres des Élèves
            </h6>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="classe">Classe :</label>
                {/* Using standard select/option structure for better Tailwind integration */}
                <select 
                  id="classe" 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white" 
                  value={nomNiveau} 
                  onChange={(e) => setNomNiveau(e.target.value)}
                >
                  <option value="">--- Sélectionner la Classe ---</option>
                  {niveau.map((n) => (
                    <option key={n.code_niveau} value={n.nomniveau}>{n.nomniveau}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="anneeScolaire">Année Scolaire: </label>
                <select 
                  id="anneeScolaire" 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white" 
                  value={anneeScolaire} 
                  onChange={(e) => setAnneeScolaire(e.target.value)}
                >
                  <option value="">--- Sélectionner l'Année ---</option>
                  {generateAnnee().map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col space-y-3">
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white font-bold rounded-lg transition duration-300 transform hover:scale-[1.01] shadow-lg"
                style={{backgroundColor: PRIMARY_COLOR, boxShadow: `0 4px 10px rgba(20, 60, 120, 0.4)`}} 
                onClick={handleListerParOrdre} 
              >
                <FaSearch /> Afficher la Liste
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white font-bold rounded-lg bg-red-600 hover:bg-red-700 transition duration-300 shadow-md"
                onClick={handleExportPdf}
              >
                <FaFilePdf /> Exporter en PDF
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white font-bold rounded-lg bg-green-600 hover:bg-green-700 transition duration-300 shadow-md"
                onClick={handleExportExcel}
              >
                <FaFileExcel /> Exporter en Excel
              </button>
            </div>
          </div>
        </div>

        {/* Table Card (Lg: 2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100 h-full">
            <h6 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
              Résultats de la Recherche
            </h6>
            <div className="max-h-[500px] overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-indigo-600 text-white shadow-md">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase">N° Insc.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">Nom et Prénoms</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase">Date & Lieu Naissance</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase">Sexe</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">Adresse Actuelle</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {eleve.length > 0 ? eleve.map((e, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/50 transition duration-150">
                      <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{e.no_inscrit}</td>
                      <td className="px-4 py-3 text-left text-sm font-bold text-gray-900">{e.nom} <span className="font-normal text-gray-700">{e.prenom}</span></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{e.naiss} à <span className="font-medium">{e.lieunaiss}</span></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{e.sexe}</td>
                      <td className="px-4 py-3 text-left text-sm text-gray-600">{e.adresse}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-gray-500 italic">
                        Veuillez utiliser les filtres pour afficher les élèves.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Chart 1: Répartition par formation (using stats.effectifs) */}
        <ChartCard 
          title="📊 Répartition des effectifs par classe" 
          data={stats?.effectifs} 
        />
        
        {/* Chart 2: Répartition par sexe (using stats.effectifs - assuming the backend sends correct data for this title) */}
        <ChartCard 
          title="♀️♂️ Répartition des apprenants par sexe" 
          data={sexe} 
        />
        
        {/* Chart 3: Répartition par âge (using stats.effectifs - assuming the backend sends correct data for this title) */}
        <ChartCard 
          title="👶 Répartition des apprenants par âge" 
          data={minmaj} 
        />
        
        {/* Chart 4: Effectifs par Année Scolaire (Bar Chart) */}
        <BarChartCard 
          title="📈 Effectifs des apprenants par Année Scolaire" 
          data={datas} 
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <DashboardContent /> 
    </div>
  );
};

export default DashboardEleve;