import React from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
const DashboadEleve = ({onViewList}) => {
  const kpiData = [
    { 
      title: 'Effectif total', 
      icon: "fas fa-users", 
      value: 80, 
      color: 'success', 
      barColor: 'success' 
    },
    { 
      title: 'Seconde', 
      icon: "fas fa-user-plus", 
      value: 30, 
      color: 'primary', 
      barColor: 'primary' 
    },
    { 
      title: 'Première', 
      icon: "fas fa-user-graduate",
      value: 20, 
      color: 'success', 
      barColor: 'success' 
    },
    { 
      title: 'Terminale A', 
      icon: "fas fa-graduation-cap",
      value: 17, 
      color: 'secondary', 
      barColor: 'secondary' 
    },
    { 
      title: 'Terminale D', 
      icon: "fas fa-graduation-cap",
      value: 8, 
      color: 'danger', 
      barColor: 'danger' 
    },
    { 
      title: 'Terminale C', 
      icon: "fas fa-graduation-cap",
      value: 5, 
      color: 'warning', 
      barColor: 'warning' 
    },
  ];


  const KPICard = ({ title, value, color, barColor, icon }) => (
    <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
      <div className="card shadow-sm text-center p-2 h-100">
        <div className={`fs-1 mb-3 text-${color}`}>
          <i className={icon}></i>
        </div>
        <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>{title}</h3>
        <p className={`fs-4 fw-bold text-${color} mb-1 p-2`}>{value}</p>
        <div className="progress" style={{ height: '3px' }}>
          <div className={`progress-bar bg-${barColor}`} role="progressbar"
            style={{ width: '100%' }} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  );


  const DashboardContent = () => (
    <div className="container-fluid p-5 shadow">
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <h5 className="mb-0">Tableau de bord</h5>
        <p className="mb-0 fw-bold">
          <button className="btn btn-primary" onClick={onViewList}><FaEye size={25} height={100}className="mx-1" /> Voir la liste</button>
        </p>
      </div>

      <div className="text-center mb-4">
        <h4 className="text-primary fw-bold fst-italic">« Lycée Catholique Laura Vicuna Anjarasoa Ankofafa Fianarantsoa (CFP) »</h4>
      </div>

      <div className="row g-3 mb-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="row g-3">
        {/* Histogramme de recette du mois */}
        <div className="col-lg-5 col-md-6">
          <div className="card shadow-sm p-3 h-100" style={{ minHeight: '350px' }}>
            <h6 className="text-purple fw-bold mb-3" style={{ color: '#800080' }}>Histogramme de recette du mois</h6>
            {/* Espace pour le graphique */}
            <div className="d-flex align-items-center justify-content-center flex-grow-1 text-muted">
                (Espace pour l'histogramme ou le graphique)
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="col-lg-4 col-md-6">
          <div className="card shadow-sm p-3 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '350px' }}>
            <h6 className="text-muted">Photo</h6>
            {/* Espace pour une image ou un placeholder */}
          </div>
        </div>

        {/* Liste des élèves (Export PDF) */}
        <div className="col-lg-3 col-md-12">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-primary fw-bold mb-3">Facilite la recherche des élèves</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label mb-0" htmlFor="classe">Classe :</label>
                <input type="text" id="classe" className="form-control form-control-sm" />
              </div>
              <div className="col-12">
                <label className="form-label mb-0" htmlFor="annee">Année :</label>
                <input type="text" id="annee" className="form-control form-control-sm" />
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="btn btn-warning text-white fw-bold w-100 py-2">
               Lister par ordre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="container-fluid p-4 bg-light min-vh-100">
        <div className="row">
          <div className="col-12">
            <DashboardContent /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboadEleve;