import { Component } from "react";
import Navigation from "./Navigation";

class DashboardPage extends Component {

    constructor(props){
        super(props);
        this.state = { 
            data: {
                totalStudents: 1500,
                professionalTraining: 550,
                newRegistrations: 75,
            }
        };
    } 

    render() {
        const { data } = this.state;
        return (
            <div className="d-flex flex-column min-vh-100">
                <div className="container">
                    <div className="container">
                        <h1 className="text-center fw-bold mb-5 mt-3">
                            Tableau de Bord de Gestion d'Inscription
                        </h1>
                        
                        <div className="row g-4 mb-5">
                            <div className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 border-0 rounded-4">
                                <div className="card-body text-center p-4">
                                <div className="fs-1 text-primary mb-3">
                                    <i className="fas fa-users"></i>
                                </div>
                                <h5 className="card-title text-muted">Total Élèves</h5>
                                <p className="card-text fw-bold fs-2 text-primary">{data.totalStudents}</p>
                                </div>
                            </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 border-0 rounded-4">
                                <div className="card-body text-center p-4">
                                <div className="fs-1 text-success mb-3">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                                <h5 className="card-title text-muted">Formation Pro</h5>
                                <p className="card-text fw-bold fs-2 text-success">{data.professionalTraining}</p>
                                </div>
                            </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 border-0 rounded-4">
                                <div className="card-body text-center p-4">
                                <div className="fs-1 text-warning mb-3">
                                    <i className="fas fa-user-plus"></i>
                                </div>
                                <h5 className="card-title text-muted">Nouvelles Inscriptions</h5>
                                <p className="card-text fw-bold fs-2 text-warning">{data.newRegistrations}</p>
                                </div>
                            </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 border-0 rounded-4">
                                <div className="card-body text-center p-4">
                                <div className="fs-1 text-danger mb-3">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <h5 className="card-title text-muted">Demandes en Attente</h5>
                                <p className="card-text fw-bold fs-2 text-danger">{data.pendingApplications}</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DashboardPage;