import React from "react";

const ICONS = {
  Bell: () => <span className="align-middle">🔔</span>,
  List: () => <span className="align-middle">☰</span>,
  RefreshCcw: () => <span className="align-middle" style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>⟳</span>,
  Book: () => <span className="align-middle">📚</span>,
  Users: () => <span className="align-middle">🧑‍🤝‍🧑</span>,
  DollarSign: () => <span className="align-middle">💲</span>,
  BarChart2: () => <span className="align-middle" style={{ fontSize: '3rem' }}>📊</span>,
  PieChart: () => <span className="align-middle" style={{ fontSize: '3rem' }}>🥧</span>,
};
const transitionStyle = { transition: 'all 0.3s ease-in-out' };
const PRIMARY_COLOR = '#143C78';


const StatCard = ({ title, value, color, borderClass, icon }) => (
  <div className="col-lg-3 col-md-6 mb-4">
    <div className="card shadow-lg h-100 border-0 rounded-4" 
      style={{ 
        ...transitionStyle, cursor: 'pointer',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05), 0 0.25rem 0.5rem rgba(0, 0, 0, 0.02)', transform: 'scale(1)',
      }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div className="card-body p-4 text-center">
        {icon && (
          <div className={`fs-1 mb-3 ${color}`}>
            <i className={icon}></i>
          </div>
        )}
        <p className="card-title text-uppercase fw-semibold mb-1 text-secondary"
          style={{ fontSize: '0.8rem' }} >
          {title}
        </p>
        <h3 className={`fw-bolder display-5 mb-3 ${color}`}>{value}</h3>
        <div className={`mx-auto border-bottom border-4 ${borderClass}`}
          style={{ height: '5px', width: '70%', borderRadius: '3px' }}></div>
      </div>
    </div>
  </div>
);

const StudentListForm = () => (
  <div className="card shadow-lg h-100 border-0 rounded-4">
    <div className="card-body p-4">
      <h5 className="pb-3 mb-4 fw-bold text-dark" style={{ borderBottom: `3px solid ${PRIMARY_COLOR}`, paddingBottom: '8px', color: PRIMARY_COLOR }}>
        Liste des élèves
      </h5>
      <form>
        <div className="mb-4 row align-items-center">
          <label htmlFor="categorie" className="col-sm-4 col-form-label text-end fw-semibold text-secondary">Catégorie :</label>
          <div className="col-sm-8">
            <input type="text" className="form-control rounded-3" id="categorie" placeholder="Ex: Primaire" style={transitionStyle} />
          </div>
        </div>
        <div className="mb-4 row align-items-center">
          <label htmlFor="niveau" className="col-sm-4 col-form-label text-end fw-semibold text-secondary">Niveau :</label>
          <div className="col-sm-8">
            <input type="text" className="form-control rounded-3" id="niveau" placeholder="Ex: CE2" style={transitionStyle} />
          </div>
        </div>
        <div className="mb-5 row align-items-center">
          <label htmlFor="anneeSco" className="col-sm-4 col-form-label text-end fw-semibold text-secondary">Année Sco :</label>
          <div className="col-sm-8">
            <input type="text" className="form-control rounded-3" id="anneeSco" placeholder="Ex: 2024-2025" style={transitionStyle} />
          </div>
        </div>
        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-primary fw-bold shadow-sm rounded-3 py-2" 
            style={{ 
              ...transitionStyle, backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR,
              boxShadow: '0 4px 6px rgba(20, 60, 120, 0.2)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'} >
            Exporter PDF
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ChartPlaceholder = ({ title, icon, borderStyle }) => (
  <div className="card shadow-lg h-100 border-0 rounded-4">
    <div className="card-body p-4 d-flex flex-column">
      <h5 className={`pb-3 mb-4 fw-bold text-dark`} style={borderStyle}>{title}</h5>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center rounded-3" style={{ minHeight: '250px', backgroundColor: '#e9ecef' }}>
        {icon()}
      </div>
    </div>
  </div>
);

function DashboardPage({ autre }) {
  const statColors = {
    inscrits: { valueClass: 'text-info', borderClass: 'border-info' },
    academiques: { valueClass: 'text-danger', borderClass: 'border-danger' },
    formations: { valueClass: 'text-success', borderClass: 'border-success' },
    paiement: { valueClass: 'text-primary', borderClass: 'border-primary' }, 
  };

  return (
    <div className="container-fluid py-5 p-5">
      <div className="d-flex justify-content-between">
        <h1 className="mb-4 fw-bolder" style={{ color: '#343a40' }}>Tableau de bord Général</h1>
        <button className="btn btn-warning" style={{ width:'120px', height:'60px' }} onClick={autre}>Autres</button>
      </div>
      <div className="alert alert-white text-center border-start border-5 border-info p-3 mb-5 rounded-4 shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: statColors.inscrits.borderClass }}>
        <p className="mb-0 text-secondary fst-italic fw-bold">
          « Sekoly katolika mijoro, manabe ny olona manontolo ... antoky ny ho avy »
        </p>
      </div>

      <div className="row g-4 mb-5">
        <StatCard title="Total des inscrits" value="250" color={statColors.inscrits.valueClass} 
            borderClass={statColors.inscrits.borderClass} icon="fas fa-users" />
        <StatCard title="Total Academiques" value="170" color={statColors.academiques.valueClass}
            borderClass={statColors.academiques.borderClass} icon="fas fa-user-plus"/>
        <StatCard title="Total Formations" value="80" color={statColors.formations.valueClass} 
            borderClass={statColors.formations.borderClass} icon="fas fa-graduation-cap" />
        <StatCard title="Paiement effectuée" value="310" color={statColors.paiement.valueClass} 
            borderClass={statColors.paiement.borderClass} icon="fas fa-money-check-alt" />
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <ChartPlaceholder title="Histogramme de recette du mois" icon={ICONS.BarChart2} borderStyle={{ borderBottom: '3px solid #9c6be4' }} />
        </div>

        <div className="col-lg-6">
          <div className="row g-4">
            <div className="col-12">
              <ChartPlaceholder title="Diagramme des effectif par classe" icon={ICONS.PieChart} borderStyle={{ borderBottom: `3px solid ${PRIMARY_COLOR}` }}/>
            </div>

            <div className="col-12">
              <StudentListForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DashboardPage;