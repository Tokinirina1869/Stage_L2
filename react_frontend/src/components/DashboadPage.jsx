import { Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaArrowRight, FaList } from "react-icons/fa";
import CountUp from "react-countup";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const PRIMARY_COLOR = '#143C78';
const url = 'http://localhost:8000/api';

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
  
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#FF6384'];
  const BAR_COLORS = [
    '#0088FE', 
    '#00C49F', 
    '#FFBB28', 
    '#FF8042', 
    '#A569BD', 
    '#FF6384',
    '#36A2EB', 
    '#4BC0C0',
    '#9966FF', 
    '#FF9F40', 
    '#C9CBCF', 
    '#E91E63', 
  ];

  const [data, setData] = useState([]);

  const COLORS = ["#0088FE", "#FF8042"]; // Mineurs / Majeurs

  useEffect(() => {
    axios.get("http://localhost:8000/api/statistique")
      .then(res => {
        const stats = res.data;
        const total = stats.mineurs + stats.majeurs;

        // Calcul des pourcentages
        const formattedData = [
          {
            categorie: "-18 ans",
            total: stats.mineurs,
            pourcentage: ((stats.mineurs / total) * 100).toFixed(1)
          },
          {
            categorie: "+18 ans",
            total: stats.majeurs,
            pourcentage: ((stats.majeurs / total) * 100).toFixed(1)
          }
        ];

        setData(formattedData);
      })
      .catch(err => console.error("Erreur chargement stats âge:", err))
      .finally(() => setLoading(false));
  }, []);

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
        axios.get(`${url}/formations/effectifs`),
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
      setSemaine(semaineRes.data.data);
      setMois(moisRes.data.data)
      setMineur(mineurRes.data.total)
      setMajeur(majeurRes.data.total)
      setLoading(false);
    } 
    catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="pt-5 text-center text-gray-500">Chargement....</p>;

  const statsCards = [
    {title: "Total des apprenants", icon: "fas fa-users", value: total, color:'text-green-500' },
    {title: "Total Académiques", icon: "fas fa-user-plus", value: eleve, color:'text-yellow-500' },
    {title: "Total Professionnelle", icon: "fas fa-graduation-cap", value: formation, color:'text-blue-500' },
    {title: "Paiements Effectués", icon: "fas fa-money-check-alt", value: paiement, color:'text-cyan-500' },
    {title: "Mineur(s)", icon: "fas fa-money-check-alt", value: mineur, color:'text-cyan-500' },
    {title: "Majeur(s)", icon: "fas fa-money-check-alt", value: majeur, color:'text-cyan-500' },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <FaList className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-default">Tableau de bord Général</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          onClick={autre} >
          <FaArrowRight /> Autres
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsCards.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <div className={`text-3xl mb-3 ${item.color}`}>
              <i className={item.icon}></i>
            </div>
            <h3 className="text-lg font-semibold mb-1 text-gray-700 text-indigo-900">{item.title}</h3>
            <p className={`text-2xl font-bold ${item.color}`}>
              <CountUp end={item.value} duration={1.5} separator="," />
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-green-600 text-center mb-4">
            Répartition des apprenants par âge
          </h2>
    
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie data={data} dataKey="total" nameKey="categorie" cx="50%" cy="50%" outerRadius={200} label={({ categorie, pourcentage }) => `${categorie} (${pourcentage}%)`} >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${props.payload.pourcentage}% (${value} apprenants)` } />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h5 className="text-lg font-bold mb-4 text-green-600 text-center mb-4">Répartition des paiements par mois</h5>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie data={mois} dataKey="montant" nameKey="mois" cx="50%" cy="50%" outerRadius={200} label>
                {mois.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h5 className="text-lg font-bold mb-4 text-green-600 text-center mb-4">Paiements par semaine (4 dernières semaines)</h5>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={semaine} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semaine" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10 }} />
              <Legend />
              <Bar
                dataKey="montant"
                maxBarSize={50}
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
              >
                {semaine.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % PIE_COLORS.length]} />
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
