import React from 'react';
import { useState, useEffect } from "react";
import { Typography } from "@mui/material"; 
import axios from "axios";
import { FaArrowRight, FaList, FaChild, FaUserTie, FaUsers, FaUserGraduate, FaChalkboardTeacher, FaMoneyCheckAlt, FaVenusMars } from "react-icons/fa";
import CountUp from "react-countup";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

// Configuration des couleurs et de l'API (à adapter à votre environnement)
const SECONDARY_COLOR = '#4F46E5'; // Indigo 600
const url = 'http://localhost:8000/api';

// Couleurs utilisées pour les graphiques (Modernes et vifs)
const CHART_COLORS_PRIMARY = [SECONDARY_COLOR, '#818CF8', '#A569BD', '#FF8042', '#00C49F', '#FFBB28']; 
const AGE_COLORS = ['#EF4444', '#10B981']; // Rouge pour Mineurs, Vert pour Majeurs
const GENDER_COLORS = ['#EC4899', '#3B82F6', '#6B7280']; // Rose pour Femme, Bleu pour Homme, Gris pour Autres

// Composant de formatage personnalisé pour la Tooltip
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Vérifie si la donnée contient le pourcentage (pour les Pie Charts d'âge)
    const displayValue = data.pourcentage 
      ? `${new Intl.NumberFormat('mg-MG').format(data.total)} Apprenants (${data.pourcentage}%)`
      : `${new Intl.NumberFormat('mg-MG').format(payload[0].value)} ${unit}`;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="text-sm text-gray-800 font-semibold">{label}</p>
        <p className="text-sm text-indigo-600">{displayValue}</p>
      </div>
    );
  }
  return null;
};


function DashboardPage({ autre }) {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [eleve, setEleve] = useState(0);
  const [formation, setFormation] = useState(0);
  const [paiement, setPaiement] = useState(0);

  const [semaine, setSemaine] = useState([]);
  const [mois, setMois] = useState([]);
  const [mineur, setMineur] = useState(0);
  const [majeur, setMajeur] = useState(0);

  const [ageData, setAgeData] = useState([]);
  const [sexe, setSexe] = useState(null);
  // ----------------------------------------------------
  // 1. Fetching Age and Gender Data
  // ----------------------------------------------------
  useEffect(() => {
    // Statistique d'âge
    axios.get("http://localhost:8000/api/statistique")
      .then(res => {
        const stats = res.data;
        const total = stats.mineurs + stats.majeurs;

        const formattedAge = [
          { categorie: "Mineurs (-18 ans)", total: stats.mineurs, pourcentage: ((stats.mineurs / total) * 100).toFixed(1), label: 'Mineurs' },
          { categorie: "Majeurs (+18 ans)", total: stats.majeurs, pourcentage: ((stats.majeurs / total) * 100).toFixed(1), label: 'Majeurs' }
        ];
        setAgeData(formattedAge);

      })
      .catch(err => console.error("Erreur chargement stats âge/sexe:", err));
  }, []);

  // ----------------------------------------------------
  // 2. Fetching All Other Data
  // ----------------------------------------------------
  const fetchData = async () => {
    try {
      const [
        totalRes,
        eleveRes,
        formationRes,
        paiementRes,
        semaineRes,
        moisRes,
        mineurRes,
        majeurRes,
      ] = await Promise.all([
        axios.get(`${url}/totalGeneral`),
        axios.get(`${url}/eleve/effectifs`),
        axios.get(`${url}/inscriptions/count`),
        axios.get(`${url}/paiementEffectue`),
        axios.get(`${url}/paiementParSemaine`),
        axios.get(`${url}/paiementParMois`),
        axios.get(`${url}/mineurs`),
        axios.get(`${url}/majeurs`),
      ]);

      setTotal(totalRes.data.data);
      setEleve(eleveRes.data.total);
      setFormation(formationRes.data.total);
      setPaiement(paiementRes.data.data);
      // Assurez-vous que les données de semaine et de mois sont formatées correctement pour Recharts
      setSemaine(semaineRes.data.data.map(d => ({ ...d, montant: parseFloat(d.montant) })));
      setMois(moisRes.data.data.map(d => ({ ...d, montant: parseFloat(d.montant) })));
      setMineur(mineurRes.data.total)
      setMajeur(majeurRes.data.total)
      setLoading(false);
    } 
    catch (err) {
      console.error("Erreur lors du chargement des données du tableau de bord:", err);
      setLoading(false);
    }
  };
  useEffect(() => {
    axios.get(`${url}/ApprenantParSexe`)
      .then(res => {
        const data = res.data.data.map(item => ({
          name: item.sexe,        // Recharts attend 'name'
          value: item.total_inscrits // Recharts attend 'value'
        }));
        setSexe(data);
      })
      .catch(err => console.error("Erreur chargement stats sexe:", err));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex items-center space-x-2 text-xl text-indigo-600">
            <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Chargement des données...</span>
        </div>
    </div>
  );

  const statsCards = [
    {title: "Total Apprenants", icon: FaUsers, value: total, color:'text-indigo-600', bg: 'bg-indigo-50' },
    {title: "Total Académiques", icon: FaUserGraduate, value: eleve, color:'text-green-600', bg: 'bg-green-50' },
    {title: "Total Professionnel", icon: FaChalkboardTeacher, value: formation, color:'text-yellow-600', bg: 'bg-yellow-50' },
    {title: "Paiements Effectué(s)", icon: FaMoneyCheckAlt, value: paiement, color:'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  const demographicCards = [
    {title: "Mineur(s)", icon: FaChild, value: mineur, color:'text-red-500', bg: 'bg-red-50' },
    {title: "Majeur(s)", icon: FaUserTie, value: majeur, color:'text-teal-500', bg: 'bg-teal-50' },
  ];
  
  // ----------------------------------------------------
  // 3. Render Component
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      
      {/* Header and Action Button */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <FaList className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Tableau de bord Général</h1>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] active:scale-95"
          onClick={autre} 
        >
          Autres Analyses <FaArrowRight />
        </button>
      </div>

      {/* KPI Cards (4 metrics + 2 demographics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {[...statsCards, ...demographicCards].map((item, idx) => (
          <div 
            key={idx} 
            className={`${item.bg} rounded-2xl shadow-xl p-5 flex flex-col justify-between border-l-4 ${item.color.replace('text', 'border')} transition duration-300 hover:shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg text-center font-bold text-gray-600  leading-snug">{item.title}</h3>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <p className={`text-3xl font-extrabold text-center ${item.color}`}>
              {/* Le CountUp n'est utilisé que pour le nombre entier total, sinon on affiche la valeur formatée */}
              {item.title.includes('Paiements') 
                ? `${new Intl.NumberFormat('mg-MG').format(item.value)}`
                : <CountUp end={item.value} duration={1.5} separator=" " />
              }
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid - 3 Charts in a row for demographic and monthly financial split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 1: Répartition par Âge */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-1 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            Répartition des apprenants par Âge
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                data={ageData} 
                dataKey="total" 
                nameKey="categorie" 
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                innerRadius={60} // Donut style
                paddingAngle={4}
                label={({ categorie, pourcentage }) => `${pourcentage}%`} 
                labelLine={false}
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart 2: Répartition par Sexe */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-1 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            Répartition des apprenants par Sexe
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                data={sexe} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                innerRadius={60}
                paddingAngle={4}
                labelLine={false}
                label
              >
                {sexe.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>

              <Tooltip 
                formatter={(value) => [`${new Intl.NumberFormat('mg-MG').format(value)} Apprenants`, "Total"]} 
                contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: 8, 
                    padding: 10 
                }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Paiements par Mois */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-1 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            Recete de Paiements par mois
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                data={mois} 
                dataKey="montant" 
                nameKey="mois" 
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                innerRadius={60}
                paddingAngle={4}
                labelLine={false}
                label
              >
                {mois.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS_PRIMARY[index % CHART_COLORS_PRIMARY.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${new Intl.NumberFormat('mg-MG').format(value)} Ar`, "Montant Total"]} 
                contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: 8, 
                    padding: 10 
                }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Bar Chart Row (Full Width) for Weekly Trend */}
      <div className="mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 transition duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 text-center">
            Recette de Paiements (4 Dernières Semaines)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={semaine} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="semaine" stroke="#6b7280" />
              <YAxis 
                stroke="#6b7280" 
                tickFormatter={(value) => `${new Intl.NumberFormat('mg-MG').format(value)} Ar`}
                domain={['dataMin - 1000', 'dataMax + 1000']} // Améliore la visualisation des variations
              />
              <Tooltip 
                content={<CustomTooltip unit="Ar" />}
                labelFormatter={(label) => `Semaine : ${label}`}
              />
              <Legend />
              <Bar
                dataKey="montant"
                name="Montant"
                maxBarSize={60}
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
              >
                {semaine.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SECONDARY_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;