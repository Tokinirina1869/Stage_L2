import React,{useState, useEffect} from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";

const PRIMARY_COLOR = '#143C78';

const DashboadFormation = ({onViewListPro}) => {
  const [total, setTotal] = useState(0);
  const [totalMusic, setTotalMusic] = useState(0);
  const [totalInfo, setTotalInfo] = useState(0);
  const [totalCoupe, setTotalCoupe] = useState(0);
  const [totalLangues, setTotalLangues] = useState(0);
  const [totalPatisserie, setTotalPatisserie] = useState(0);
  const [topParcours, setTopParcours] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/count")
      .then(response => {
        setTotal(response.data.total);
      })
      .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/musique")
      .then(response => {
        setTotalMusic(response.data.total);
      })
      .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/info")
    .then(res => {
      setTotalInfo(res.data.total);
    })
    .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/coupe")
    .then(res => {
      setTotalCoupe(res.data.total);
    })
    .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/langues")
    .then(res => {
      setTotalLangues(res.data.total);
    })
    .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/patisserie")
    .then(res => {
      setTotalPatisserie(res.data.total);
    })
    .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/inscriptions/topParcours")
    .then(res => {
      setTopParcours(res.data);
    })
    .catch(error => {
        console.error("Erreur:", error);
      });
  }, []);

  const DashboardContent = () => (

    <div className="p-3">
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <h5 className="mb-0">Tableau de bord</h5>
        <button className="btn btn-primary" onClick={onViewListPro}> <FaEye size={25} height={100} className="mx-1"/> Voir la liste</button>
        <p className="mb-0 fw-bold">
          NB : La formation la plus suivie :
          <span className="text-success">
            {" "}
            {topParcours ? topParcours.formation : "Chargement..."}{" "}
          </span>
          {topParcours && (
            <small className="text-muted">
              {" "}
              ({topParcours.total_personnes} inscrits)
            </small>
          )}
        </p>
      </div>

      <div className="text-center mb-4">
        <h4 className="text-primary fw-bold fst-italic">« Centre de Formation Professionnelle Laura Vicuna Anjarasoa (CFP) »</h4>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
          <div className="card shadow-sm text-center p-2 h-100">
            <div className={`fs-1 mb-3 text-success`}>
              <i className="fas fa-users"></i>
            </div>
            <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>Effectif Total</h3>
            <p className={`fs-4 fw-bold text-success mb-1 p-2`}>{total}</p>
            <div className="progress" style={{ height: '3px' }}>
              <div className={`progress-bar bg-success`} role="progressbar"
                style={{ width: '100%' }} aria-valuenow={total} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
          <div className="card shadow-sm text-center p-2 h-100">
            <div className={`fs-1 mb-3 text-danger`}>
              <i className="fas fa-music"></i>
            </div>
            <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>Musique</h3>
            <p className={`fs-4 fw-bold text-danger mb-1 p-2`}>{totalMusic}</p>
            <div className="progress" style={{ height: '3px' }}>
              <div className={`progress-bar bg-danger`} role="progressbar"
                style={{ width: '100%' }} aria-valuenow={total} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
          <div className="card shadow-sm text-center p-2 h-100">
            <div className={`fs-1 mb-3 text-success`}>
              <i className="fas fa-laptop-code"></i>
            </div>
            <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>Informatique</h3>
            <p className={`fs-4 fw-bold text-success mb-1 p-2`}>{totalInfo}</p>
            <div className="progress" style={{ height: '3px' }}>
              <div className={`progress-bar bg-success`} role="progressbar"
                style={{ width: '100%' }} aria-valuenow={total} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
          <div className="card shadow-sm text-center p-2 h-100">
            <div className={`fs-1 mb-3 text-danger`}>
              <i className="fas fa-cut"></i>
            </div>
            <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>Coupe et Coutûre</h3>
            <p className={`fs-4 fw-bold text-danger mb-1 p-2`}>{totalCoupe}</p>
            <div className="progress" style={{ height: '3px' }}>
              <div className={`progress-bar bg-danger`} role="progressbar"
                style={{ width: '100%' }} aria-valuenow={total} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
          <div className="card shadow-sm text-center p-2 h-100">
            <div className={`fs-1 mb-3 text-secondary`}>
              <i className="fas fa-language"></i>
            </div>
            <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>Langues</h3>
            <p className={`fs-4 fw-bold text-secondary mb-1 p-2`}>{totalLangues}</p>
            <div className="progress" style={{ height: '3px' }}>
              <div className={`progress-bar bg-secondary`} role="progressbar"
                style={{ width: '100%' }} aria-valuenow={total} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6 col-6 mb-3 p-3">
          <div className="card shadow-sm text-center p-2 h-100">
            <div className={`fs-1 mb-3 text-warning`}>
              <i className="fas  fa-birthday-cake"></i>
            </div>
            <h3 className="mb-1 fw-bold p-2" style={{ fontSize: '0.85rem' }}>Pâtisserie</h3>
            <p className={`fs-4 fw-bold text-warning mb-1 p-2`}>{totalPatisserie}</p>
            <div className="progress" style={{ height: '3px' }}>
              <div className={`progress-bar bg-warning`} role="progressbar"
                style={{ width: '100%' }} aria-valuenow={total} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
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
            <h6 className="text-primary fw-bold mb-3">Recherche la liste de chaque filière</h6>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label mb-0" htmlFor="typeFormation">Type formation :</label>
                <input type="text" id="typeFormation" className="form-control form-control-sm" />
              </div>
              <div className="col-12">
                <label className="form-label mb-0" htmlFor="classe">Nom Formation :</label>
                <input type="text" id="classe" className="form-control form-control-sm" />
              </div>
              <div className="col-12">
                <label className="form-label mb-0" htmlFor="annee">Année :</label>
                <input type="text" id="annee" className="form-control form-control-sm" />
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="btn btn-warning text-white fw-bold w-100 py-2"
                style={{backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR,
                  boxShadow: '0 4px 6px rgba(20, 60, 120, 0.2)'
                }}>
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

export default DashboadFormation;