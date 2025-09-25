import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cfp from '../FMA/cfp.jpg';
import lycee from '../FMA/lycee.jpg';
import coupe from "../FMA/Form/Coupe.jpg";
import langue from "../FMA/Form/couture.jpg"
import info from "../FMA/Form/infor.jpg";
import music from "../FMA/Music.jpg";
import patisserie from "../FMA/Form/Patisserie.jpg";
import { FaCheck, FaPen } from 'react-icons/fa';
import Headers from './Header';

// function number() {
//     let n =5 ;
//     return n;
// }

class Accueil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSticky: false,
        }
    };
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if(window.scrollY > 50) {
            this.setState({ isSticky: true });
        }
        else {
            this.setState({ isSticky: false });
        }
    }

    render() {
    return (
        <div>
            <header className={`navbar navbar-expand-lg py-3 px-4 shadow ${
                this.state.isSticky ? 'fixed-top bg-secondary shadow ' : 'bg-default'
                }`}
                style={{ transition: 'all 2s ease-in-out',}}>
                <Headers propos="#propos" service="#service" contact="#contact" cfp="#cfp" lycee="#lycee" />
            </header>
            
            <div className='container-fluid p-5 shadow mt-1 pt-5' id='cfp'>
                <h2 className="text-center text-primary fw-bold position-relative mt-5">
                    Centre de Formation Professionnelle (CFP) Laura Vicuna Anjarasoa Ankofafa Fianarantosa
                    <span style={{ display: 'block', width: '220px',      
                        borderBottom: '4px solid #0d6efd', margin: '0 auto', marginTop: '5px'}}
                    ></span>
                </h2>
                <div className="row mt-5 container-fluid shadow p-4">
                    <div className="col-lg-8 mb-3 p-3 rounded-3" id='propos'>
                        <h3 className="text-center text-primary fw-bold border-primary border-3 mt-1">
                            A propos
                        </h3>
                        <p className='mt-5 ps-2' style={{ textAlign: "justify"}}>
                            Un centre de formation Professionelle qui favorise l'intégration socio-économique et socio-
                            professionnelle des jeunes et de femmes vulnérables au niveau zonal en leur offrant une formation
                            professionnelle de qualité, en les accompagnant dans l'entrepreneuriat durable et en mettant en 
                            place un mécanisme d'auto-financement pérenne. 
                        </p>
                        <p className="text-indent ps-2" style={{ textAlign: "justify"}}>
                            Centre de Formation Professionnelle (CFP) Laura Vicuna Madagascar, Profince de Fianarantsoa, District de Fianarantsoa,
                            Arrondissement Manolafaka ANJARASOA ANKOFAFA. 
                        </p>
                        <Link to="/login">
                            <button className="btn text-white btn-primary btn-lg rounded-pull" style={{marginLeft: "40%"}}>
                                Se Connecter
                            </button>
                        </Link>
                    </div>
                    <div className="col-lg-4">
                        <img src={cfp} alt="FMA" className="img-fluid rounded" />
                    </div>
                </div>
                <div className="row container-fluid shadow g-4">
                    <h2 className="text-primary fw-bold text-center mt-5 card-text">Formation trois mois (ou Formation à court terme) pour tout le monde</h2>
                    <div className="col-lg-4 mb-4 p-4">
                        <div className="card">
                            <div className="card-body shadow-lg">
                                <div className="text-center mb-3">
                                    <img src={info} className="rounded-circle" alt="Informatique" width={200} height={200} style={{border: "5px solid white"}} />
                                    <h2 className='p-2 fw-bold text-success'>Informatique</h2>
                                </div>
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1 feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className='btn btn-primary w-50 fw-bold'>WORD</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-success w-50 fw-bold">EXCEL</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-danger w-50 fw-bold">POWERPOINT</button>
                                    </li>
                                </ul>
                                <p className="text-center mt-3 mb-0">
                                    <span className="fw-bold text-default">Droit:</span> <span className="fs-2 fw-bold text-success">10 000Ar</span>
                                    <br />
                                    <span className="fw-bold mt-2 text-default">Ecolage:</span> <span className="fs-2 fw-bold text-success">15 000Ar</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4 p-4">
                        <div className="card">
                            <div className="card-body shadow-lg">
                                <div className="mb-3 text-center">
                                    <img src={coupe} alt="Langue"  className='rounded-circle' width={200} height={200} style={{ border: "5px solid white" }}/>
                                    <h2 className="p-2 fw-bold text-success">Langue</h2>
                                </div>
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }} >
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1 feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className='btn btn-primary w-50 fw-bold'>FRANCAISE</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-success w-50 fw-bold">ANGLAISE</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-danger w-50 fw-bold">ITALIENNE</button>
                                    </li>
                                </ul>
                                <p className="text-center mt-3 mb-0" style={{ textAlign: "justify" }}>
                                    <span className="fw-bold text-default">Droit:</span> <span className="fs-2 fw-bold text-success">10 000Ar</span>
                                    <br />
                                    <span className="fw-bold mt-2 text-default">Ecolage:</span> <span className="fs-2 fw-bold text-success">10 000Ar</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 mb-4 p-4">
                        <div className="card">
                            <div className="card-body shadow-lg">
                                <div className="text-center mb-3">
                                    <img src={patisserie} alt="Pattisserie" className='rounded-circle' width={200} height={200} style={{ border: "5px solid white" }} />
                                    <h2 className="p-2 fw-bold text-success">Pâtisserie</h2>
                                </div>
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1 feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className='btn btn-primary w-50 fw-bold'>PETIT FOUR</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-success w-50 fw-bold">FAST FOOD</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-danger w-50 fw-bold">GATEAU</button>
                                    </li>
                                </ul>
                                <p className="text-center mt-3 mb-0">
                                    <span className="fw-bold text-default">Droit:</span> <span className="fs-2 fw-bold text-success">10 000Ar</span>
                                    <br />
                                    <span className="fw-bold mt-2 text-default">Ecolage:</span> <span className="fs-2 fw-bold text-success">15 000Ar</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-primary fw-bold text-center card-text">Formation de 2ans (ou Formation à long terme) + Cours de Perfectionnement ciblé pour l'âge de 15 à 25 ans</h2>
                    <div className="col-lg-4 mb-4 p-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="text-center mb-3">
                                    <img src={music} alt="Musique" className="rounded-circle" width={200} height={200} style={{ border: "5px solid white" }} />
                                    <h2 className="p-1 fw-bold text-success">Musique</h2>
                                </div>
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1 feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className='btn btn-primary w-50 fw-bold'>PIANO-CLAVIER</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-success w-50 fw-bold">GUITARE-DANSE</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-danger w-50 fw-bold">FLUITE-BATTERIE</button>
                                    </li>
                                </ul>
                                <p className="text-center mt-3 mb-0">
                                    <span className="fw-bold text-default">Droit:</span> <span className="fs-2 fw-bold text-success">10 000Ar</span>
                                    <br />
                                    <span className="fw-bold mt-2 text-default">Ecolage:</span> <span className="fs-2 fw-bold text-success">15 000Ar</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4 p-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="text-center mb-3">
                                    <img src={langue} alt="Coupe" className="rounded-circle" width={200} height={200} style={{ border: "5px solid white" }} />
                                    <h2 className="p-1 fw-bold text-success">Coupe et Couture</h2>
                                </div>
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1 feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className='btn btn-primary w-50 fw-bold'>PATALON-CHEMISE</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-success w-50 fw-bold">VESTE-BLOUSE</button>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather fw-bold text-success mx-1  feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <button className="btn btn-danger w-50 fw-bold">ROBE - COSTARD ...</button>
                                    </li>
                                </ul>
                                <p className="text-center mt-3 mb-0">
                                    <span className="fw-bold text-default">Droit:</span> <span className="fs-2 fw-bold text-success">10 000Ar</span>
                                    <br />
                                    <span className="fw-bold mt-2 text-default">Ecolage:</span> <span className="fs-2 fw-bold text-success">15 000Ar</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4 p-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="text-center mb-3">
                                    <img src={langue} alt="Coupe" className="rounded-circle" width={200} height={200} style={{ border: "5px solid white" }} />
                                    <h2 className="p-1 fw-bold text-success">Coupe et Couture</h2>
                                </div>
                                <p className="text-secondary text-center">
                                    Le CFP Laura Vicuña s'est progressivement structuré à côté de la
                                    communauté, devenant un pilier de l'éducation professionnelle dans la région.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-5 shadow mt-3 pt-5">
                <div className="row container-fluid shadow p-4" id='lycee'>
                    <h2 className="text-primary text-center position-relative fw-bold mb-5">
                        Lycée Catholique Laura Vicuna Anjarasoa
                        <span style={{ display: "block", borderBottom: '4px solid #0d6efd', 
                            width: '220px', margin: '0 auto', marginTop: '5px' }}></span>
                    </h2>
                    <div className="col-12 col-lg-4">
                        <img src={lycee} height={50} alt="FMA" className="img-fluid rounded" />
                    </div>
                    <div className="col-12 col-lg-8 mb-3">
                        <p className='mt-5 ps-2 p-4' style={{ textAlign: "justify"}}>
                        Au Lycee Laura Vicuna, le lycée se divise en trois niveaux. D'abord, il y a la classe de seconde <strong >2<sup>nde</sup></strong>,
                        qui marque l'entrée au lycée après le collège. C'est une année de transition et de détermination du parcours. Ensuite, on passe en première <strong >1<sup>ère</sup> L et S</strong>. 
                        C'est une année cruciale où les élèves choisissent des spécialités et commencent à préparer le baccalauréat. Finalement, la classe de terminale <strong >T<sup>le</sup> A, D et C </strong>
                        est la dernière année du lycée, consacrée à l'obtention du diplôme du baccalauréat, qui ouvre les portes de l'enseignement supérieur
                        </p>
                    </div>

                    <div className="col-lg-4 mt-5 p-2" >
                        <div className="card card-body">
                            <h2 className="text-primary text-center fw-bold"> <FaPen size={24} className='mx-1 text-danger' />Classe de Seconde(2<sup>nde</sup>)</h2>
                            <div className="mb-3 text-center">
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Droit d'Inscription:<h2 className='fw-bold text-success' style={{ marginLeft: '10%'}}>15 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Frais Scolaires: <h2 className='fw-bold text-success' style={{ marginLeft: '20%'}}>74 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> VRM: <h2 className='fw-bold text-success' style={{ marginLeft: '40%'}}> 6 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Ecolage par mois: <h2 className='fw-bold text-success' style={{ marginLeft: '13%'}}>28 500Ar </h2>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mt-5 p-2">
                        <div className="card card-body">
                            <h2 className="text-primary text-center fw-bold"> <FaPen size={24} className='mx-1 text-danger' /> Classe de Première(1<sup>ère</sup>)</h2>
                            <div className="mb-3 text-center">
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Droit d'Inscription:<h2 className='fw-bold text-success' style={{ marginLeft: '10%'}}>15 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Frais Scolaires: <h2 className='fw-bold text-success' style={{ marginLeft: '20%'}}>74 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> VRM: <h2 className='fw-bold text-success' style={{ marginLeft: '40%'}}> 6 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Ecolage par mois: <h2 className='fw-bold text-success' style={{ marginLeft: '13%'}}>29 000Ar </h2>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mt-5 p-2">
                        <div className="card card-body">
                            <h2 className="text-primary text-center fw-bold"> <FaPen size={24} className='mx-1 text-danger' /> Classe de Terminale(T<sup>le</sup>)</h2>
                            <div className="mb-3 text-center">
                                <ul className='list-unstyled mt-3' style={{ marginLeft: "25%" }}>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Droit d'Inscription:<h2 className='fw-bold text-success' style={{ marginLeft: '10%'}}>15 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Frais Scolaires: <h2 className='fw-bold text-success' style={{ marginLeft: '20%'}}>74 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> VRM: <h2 className='fw-bold text-success' style={{ marginLeft: '40%'}}> 6 000Ar</h2>
                                    </li>
                                    <li className='fw-bold d-flex align-items-center mb-3'>
                                        <FaCheck size={24} className='mx-1 btn btn-warning' /> Ecolage par mois: <h2 className='fw-bold text-success' style={{ marginLeft: '13%'}}>30 000Ar </h2>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Accueil;
