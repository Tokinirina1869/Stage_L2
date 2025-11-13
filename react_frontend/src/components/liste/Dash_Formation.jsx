import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaList, FaStar, FaMusic, FaLaptopCode, FaCut, FaLanguage, FaBirthdayCake, FaUsers, FaSearch, FaFilePdf, FaFileExcel, FaChartBar, FaChartPie, FaSpinner } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import CountUp from 'react-countup';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

// Définitions de couleurs modernes pour Tailwind
const PRIMARY_COLOR = '#1D4ED8'; // Blue-700
const SECONDARY_COLOR = '#059669'; // Emerald-600
const PIE_COLORS = [
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Green
  '#8B5CF6', // Violet
  '#F472B6'  // Pink
];


const sexe_Colors = ["#143C78","#e11d48"];
const minmaj_Colors = ["#061389ff","#087f0aff"];
const url = "http://localhost:8000/api";

// Composant pour la carte KPI
const KpiCard = ({ title, icon, value, color, bg }) => {
  const IconComponent = ({ className }) => <i className={`${icon} ${className}`}></i>;

  return (
    <div className={`rounded-xl shadow-xl p-5 flex flex-col justify-between ${bg} transition duration-300 hover:shadow-2xl border-l-4 ${color.replace('text', 'border')}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-center font-medium text-gray-600 leading-snug">{title}</h3>
        <IconComponent className={`w-6 h-6 text-2xl ${color}`} />
      </div>
      <p className={`text-3xl text-center font-extrabold ${color}`}>
        <CountUp end={value} duration={1.5} separator=" " />
      </p>
    </div>
  );
};

// Tooltip personnalisé pour Recharts (pour le graphique trimestriel)
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-md">
        <p className="font-semibold text-gray-800">{`Trimestre: ${label}`}</p>
        <p className="text-sm text-blue-600">{`Effectif: ${new Intl.NumberFormat('fr-FR').format(payload[0].value)} inscrits`}</p>
      </div>
    );
  }
  return null;
};

const DashboadFormation = ({ onViewListPro }) => {
  const [loading, setLoading] = useState(true);
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
  const [stats, setStats] = useState({ effectifs: [] });
  const [cfp, setCfp] = useState({ sexes: [] });
  const [mincfp, setMinCfp] = useState({ mins: [] });
  // -----------------------------
  // 1. Data Fetching
  // -----------------------------
  const fetchData = async () => {
    try {
      const [
        trimestreRes, inscCountRes, musicRes, infoRes, coupeRes, languesRes, patisserieRes, topParcoursRes, parcoursRes, statsRes,
      ] = await Promise.all([
        axios.get(`${url}/formations/trimestre`),
        axios.get(`${url}/inscriptions/count`),
        axios.get(`${url}/inscriptions/musique`),
        axios.get(`${url}/inscriptions/info`),
        axios.get(`${url}/inscriptions/coupe`),
        axios.get(`${url}/inscriptions/langues`),
        axios.get(`${url}/inscriptions/patisserie`),
        axios.get(`${url}/inscriptions/topParcours`),
        axios.get(`${url}/parcours`),
        axios.get(`${url}/formations/effectifs`),
      ]);

      const transformedTrimestre = (trimestreRes.data.Data || []).map(item => ({   
        annee: item.annee,
        trimestre: item.trimestre,
        total: item.total
      }));

      setData(transformedTrimestre);
      setTotal(inscCountRes.data.total);
      setTotalMusic(musicRes.data.total);
      setTotalInfo(infoRes.data.total);
      setTotalCoupe(coupeRes.data.total);
      setTotalLangues(languesRes.data.total);
      setTotalPatisserie(patisserieRes.data.total);
      setTopParcours(topParcoursRes.data.Data);
      setParcours(parcoursRes.data);
      setStats(statsRes.data);

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des données du tableau de bord:", err);
      setLoading(false);
      Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: 'Impossible de charger les données. Vérifiez la connexion à l\'API.',
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
        })
    }
  };

  useEffect(() => {
    axios.get(`${url}/FormationParSexe`)
      .then(res => {
        const formatted = res.data.data.map(item => ({
          name: item.sexe,
          value: item.total_inscrits
        }));
        setCfp({ sexes: formatted });
      })
      .catch(err => console.error("Erreur chargement FormationParSexe:", err));
  }, []);

  useEffect(() => {
    const fetchMineurMajeur = async () => {
      try {
        const res = await axios.get(`${url}/CfpMineurMajeur`);
        const { mineurs, majeurs } = res.data; // ✅ récupérer directement les valeurs

        // 🔄 Transformer en format compatible avec PieChart
        const formatted = [
          { name: "Mineurs", value: mineurs },
          { name: "Majeurs", value: majeurs }
        ];

        setMinCfp(formatted); // ou setAgeData(formatted) si tu veux être plus clair
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données Mineur/Majeur :", err);
        setLoading(false);
      }
    };

    fetchMineurMajeur();
  }, [url]);


  useEffect(() => {
    fetchData();
  }, []);

  // -----------------------------
  // 2. Utility Functions
  // -----------------------------
  const generateAnnee = () => {
    const currentAnnee = new Date().getFullYear();
    const years = [];
    for (let annee = 2020; annee <= currentAnnee; annee++) {
      years.push(`${annee}-${annee + 1}`);
    }
    return years.reverse();
  };

  // -----------------------------
  // 3. Handlers
  // -----------------------------
  const handleListerParOrdre = async () => {
    if (!typeFormation || !nomFormation || !anneeScolaire) {
      return Swal.fire({
        icon: 'warning',
        text: "Veuillez sélectionner tous les filtres !",
        showConfirmButton: true,
        background: '#1e1e2f',
        color: 'white',
      });
    }

    try {
      const response = await axios.get(`${url}/inscriptions/filter`, {
        params: { type_formation: typeFormation, nom_formation: nomFormation, annee_scolaire: anneeScolaire }
      });

      const data = response.data.Data || [];
      setApprenants(data);

      if (data.length === 0) {
        Swal.fire({
          icon: 'warning',
          text: "Aucun apprenant trouvé pour ces critères!",
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
        });
      }
      else {
        Swal.fire({
          icon: 'success',
          text: `${data.length} apprenant(s) trouvé(s)!`,
          showConfirmButton: true,
          background: '#1e1e2f',
          color: 'white',
        });
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
      });
    }
  };

  const handleExportPdf = async () => {
    if (!typeFormation || !nomFormation || !anneeScolaire || !apprenants || apprenants.length === 0) {
      return Swal.fire({
        icon: 'warning',
        text: "Veuillez filtrer et afficher des apprenants avant d'exporter !",
        showConfirmButton: true,
        background: '#1e1e2f',
        color: 'white',
      });
    }

    const doc = new jsPDF();
    
    // Fallback for logo (since external assets are not supported in the canvas environment)
    const logoPlaceholder = () => {
        doc.setFontSize(20);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text("CFP", 15, 20);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Centre de Formation", 15, 25);
    };

    logoPlaceholder(); 
    
    // Titre centré
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("LISTE DES APPRENANTS FILTRÉS", 105, 35, { align: "center" });

    // Sous-titre centré
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Formation : ${nomFormation} - Année scolaire : ${anneeScolaire}`, 105, 42, { align: "center" });

    // Date à droite
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Aujourd'hui le : ${new Date().toLocaleDateString()}`, 200, 15, { align: "right" });

    const headers = [
      "N° Insc.",
      "Nom & Prénom(s)",
      "Date et Lieu de Naissance",
      "Sexe",
      "Adresse",
      "Durée",
      "Formation"
    ];

    const data = apprenants.map(liste => [
      liste.no_inscrit || "",
      `${liste.nom || ""} ${liste.prenom || ""}`,
      `${liste.naiss || ""} à ${liste.lieunaiss || ""}`,
      liste.sexe || "",
      liste.adresse || "",
      liste.duree || "",
      liste.nomformation || ""
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 50,
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [29, 78, 216], fontStyle: 'bold' }, // Blue-700
      columnStyles: { 0: { cellWidth: 15 }, 3: { cellWidth: 10 }, 5: { cellWidth: 15 } }
    });

    const pdfBytes = doc.output("arraybuffer");
    const fileName = `Liste_${nomFormation.replace(/\s/g, '')}_${anneeScolaire}.pdf`;

    // Saving logic (kept intelligent export logic)
    (async () => {
      try {
        if (window.showSaveFilePicker) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: "Fichier PDF", accept: { "application/pdf": [".pdf"] } }],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(pdfBytes);
          await writable.close();

          Swal.fire({ icon: "success", text: "PDF enregistré avec succès !", background: "#1e1e2f", color: "white" });
        } else {
          doc.save(fileName);
          Swal.fire({ icon: "info", text: "Le fichier a été téléchargé automatiquement.", background: "#1e1e2f", color: "white" });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erreur export PDF :", error);
          Swal.fire({ icon: "error", text: "Erreur pendant l'exportation du PDF.", background: "#1e1e2f", color: "white" });
        }
      }
    })();
  };

  async function handleExportExcel() {
    if (!typeFormation || !nomFormation || !anneeScolaire || !apprenants || apprenants.length === 0) {
      return Swal.fire({
        icon: "warning",
        text: "Sélectionnez et listez les apprenants avant d’exporter !",
        background: "#1e1e2f",
        color: "white",
      });
    }

    try {
      const headers = [
        "N° Inscription", "Nom & Prénom(s)", "Date et lieu de Naissance", "Sexe", "Adresse Actuelle", "Durée de la formation", "Formation",
      ];

      const rows = apprenants.map((e) => [
        e.no_inscrit || "",
        `${e.nom || ""} ${e.prenom || ""}`,
        `${e.naiss || ""} à ${e.lieunaiss || ""}`,
        e.sexe || "",
        e.adresse || "",
        e.duree || "",
        e.nomformation || "",
      ]);

      const data = [
        ["LISTE DES APPRENANTS FILTRÉS"],
        [`Formation : ${nomFormation} | Année : ${anneeScolaire}`],
        [],
        headers,
        ...rows,
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);

      ws["!cols"] = [
        { wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 20 },
      ];

      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Liste Apprenants");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
      const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fileName = `Liste_${nomFormation.replace(/\s/g, "")}_${anneeScolaire}.xlsx`;

      // Saving logic (kept intelligent export logic)
      if (window.showSaveFilePicker) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: "Fichier Excel", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } }],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          Swal.fire({ icon: "success", text: "Excel enregistré avec succès !", background: "#1e1e2f", color: "white" });
        } catch (error) {
          if (error.name !== "AbortError") {
            throw error;
          }
        }
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        Swal.fire({ icon: "info", text: "Le fichier a été téléchargé automatiquement.", background: "#1e1e2f", color: "white" });
      }
    } catch (err) {
      console.error("Erreur export Excel :", err);
      if (err.name !== "AbortError") {
        Swal.fire({ icon: "error", text: "Erreur lors de l’enregistrement du fichier Excel.", background: "#1e1e2f", color: "white" });
      }
    }
  }

  // -----------------------------
  // 4. Render
  // -----------------------------
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mr-3" />
      <p className="text-xl text-indigo-600">Chargement des données...</p>
    </div>
  );

  const DashboardContent = () => (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header and Top Info */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <FaList className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Tableau de bord de Formation</h1>
        </div>
        <p className="text-sm text-gray-600 italic">« Centre de Formation Professionnelle Laura Vicuna Anjarasoa (CFP) »</p>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] active:scale-95"
          onClick={onViewListPro}
        >
          <FaEye /> Voir la liste
        </button>
      </div>

      {/* Top Course Info */}
      <div className="mb-8 p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-xl shadow-md">
        <p className="flex items-center font-bold text-gray-800">
          <FaStar className="w-5 h-5 mr-3 text-yellow-500" /> 
          Formation la plus suivie : 
          <span className="mx-2 text-indigo-700 font-extrabold">
            {topParcours ? topParcours.nomformation : "Chargement..."}
          </span>
          {topParcours && (
            <span className="text-sm text-gray-600">
              ({topParcours.total} inscrits)
            </span>
          )}
        </p>
      </div>

      {/* KPI Cards (6 metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {[
          { title: "Effectif Total", icon: "fas fa-users", value: total, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Musique", icon: "fas fa-music", value: totalMusic, color: "text-red-600", bg: "bg-red-50" },
          { title: "Informatique", icon: "fas fa-laptop-code", value: totalInfo, color: "text-yellow-600", bg: "bg-yellow-50" },
          { title: "Coupe et Coutûre", icon: "fas fa-cut", value: totalCoupe, color: "text-pink-600", bg: "bg-pink-50" },
          { title: "Langues", icon: "fas fa-language", value: totalLangues, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Pâtisserie", icon: "fas fa-birthday-cake", value: totalPatisserie, color: "text-teal-600", bg: "bg-teal-50" },
        ].map((item, idx) => (
          <KpiCard key={idx} {...item} />
        ))}
      </div>

      {/* Filter and Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Filter Card (Col 1-4) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 h-full transition duration-300 hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-2 text-center">
              <FaSearch className="inline mr-2 text-indigo-600" /> Filtrer et Exporter
            </h2>
            <div className="space-y-4">
              
              {/* Type de Formation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de Formation</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={typeFormation} 
                  onChange={(e) => setTypeFormation(e.target.value)}
                >
                  <option value="">--- Type de la Formation ---</option>
                  <option value="Long Terme">Long Terme</option>
                  <option value="Court Terme">Court Terme</option>
                </select>
              </div>

              {/* Nom Formation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom Formation</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={nomFormation} 
                  onChange={(e) => setNomFormation(e.target.value)}
                >
                  <option value="">--- Nom de la Formation ---</option>
                  {parcours.map((p) => (
                    <option key={p.code_formation} value={p.nomformation}>{p.nomformation}</option>
                  ))}
                </select>
              </div>

              {/* Année Scolaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année Scolaire</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={anneeScolaire} 
                  onChange={(e) => setAnneeScolaire(e.target.value)}
                >
                  <option value="">--- Année Scolaire ---</option>
                  {generateAnnee().map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button 
                className="flex items-center justify-center w-full px-4 py-2 text-white font-bold rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg transition duration-300 transform hover:scale-[1.01]"
                style={{ backgroundColor: PRIMARY_COLOR, boxShadow: '0 4px 6px rgba(29, 78, 216, 0.4)' }} 
                onClick={handleListerParOrdre} 
              >
                <FaSearch className="mr-2" /> Afficher la liste
              </button>

              <button 
                className="flex items-center justify-center w-full px-4 py-2 text-white font-bold rounded-lg bg-red-600 hover:bg-red-700 shadow-lg transition duration-300 transform hover:scale-[1.01]"
                onClick={handleExportPdf}
              >
                <FaFilePdf className="mr-2" /> Exporter en PDF
              </button>

              <button 
                className="flex items-center justify-center w-full px-4 py-2 text-white font-bold rounded-lg bg-green-600 hover:bg-green-700 shadow-lg transition duration-300 transform hover:scale-[1.01]"
                onClick={handleExportExcel}
              >
                <FaFileExcel className="mr-2" /> Exporter en Excel
              </button>
            </div>
          </div>
        </div>

        {/* Results Table (Col 5-12) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 h-full transition duration-300 hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
              Liste des Apprenants Filtrés ({apprenants.length})
            </h2>
            <div className="max-h-[500px] overflow-y-auto rounded-lg ring-1 ring-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white sticky top-0 z-10 shadow-md">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">N° Inscription</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Nom et Prénoms</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Naissance</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Sexe</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold tracking-wide">Adresse</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  { apprenants.length > 0 ? apprenants.map((liste, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-4 py-2 text-center text-sm font-medium text-gray-800">{liste.no_inscrit}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">
                        <span className="font-semibold">{liste.nom}</span> {liste.prenom}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.naiss} à {liste.lieunaiss}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.sexe}</td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{liste.adresse}</td>
                    </tr>
                  )): (
                    <tr className='h-32'>
                      <td colSpan={5} className="text-center p-5 text-gray-500 italic">
                        Utilisez les filtres pour rechercher les apprenants.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Répartition par formation (Pie Chart) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            <FaChartPie className="inline mr-2 text-indigo-600" /> Répartition des effectifs par formation
          </h2>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie 
                data={stats.effectifs} 
                dataKey="value" 
                nameKey="name"  
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                innerRadius={60} 
                paddingAngle={3}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {stats.effectifs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} élèves`, "Effectif"]} 
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            <FaChartPie className="inline mr-2 text-indigo-600" /> Répartition des effectifs par sexe
          </h2>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie 
                data={cfp.sexes} 
                dataKey="value" 
                nameKey="name"  
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                innerRadius={60} 
                paddingAngle={3}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {cfp.sexes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} élèves`, "Effectif"]} 
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            <FaChartPie className="inline mr-2 text-indigo-600" /> Répartition des effectifs par age
          </h2>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie 
                data={mincfp} 
                dataKey="value" 
                nameKey="name"  
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                innerRadius={60} 
                paddingAngle={3}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {mincfp.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} élèves`, "Effectif"]} 
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Effectifs par trimestre (Bar Chart) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            <FaChartBar className="inline mr-2 text-indigo-600" /> Effectifs des apprenants par trimestre
          </h2>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={data} margin={{ top: 30, right: 20, left: 10, bottom: 20}} barCategoryGap='15%'>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="trimestre" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey='total' 
                  fill={PRIMARY_COLOR} 
                  name="Nombre d'inscrits" 
                  maxBarSize={50} 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1200} 
                  label={{ position: 'top', fill: PRIMARY_COLOR, fontSize: 13, fontWeight: 'bold' }} 
                />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <DashboardContent /> 
    </div>
  );
};

export default DashboadFormation;