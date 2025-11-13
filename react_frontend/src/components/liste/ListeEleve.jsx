import React, { useState } from 'react';
import AffichageEleve from '../Académique/AffichageEleve';
import NouvelleInscription from '../modals/NouvelleInscription';
import { FaGraduationCap } from 'react-icons/fa';
import { Plus } from 'lucide-react';

const ListeEleve = ({ onViewDash }) => {
    const [showInscription, setShowInscription] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false); // trigger pour rafraîchir AffichageEleve

    const handleRefresh = () => {
        setRefreshTrigger(prev => !prev); // change la valeur pour déclencher le useEffect de fetch dans AffichageEleve
    };

    return (
        <div className="container-fluid mt-2 shadow p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="50" onClick={onViewDash} viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle text-primary fw-bold">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 8 8 12 12 16"></polyline>
                    <line x1="16" y1="12" x2="8" y2="12"></line>
                </svg>
                <div className="flex items-center text-xl md:text-2xl font-bold space-x-3 mb-6 text-default">
                    <FaGraduationCap className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold">Lycée Catholique FMA Laura Vicuna Anjarasoa Ankofafa Fianarantsoa</h1>
                </div>
                <button onClick={() => setShowInscription(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Nouvelle Inscription
                </button>
            </div>

            <div className="card shadow-sm p-2 rounded-3">
                <AffichageEleve refreshTrigger={refreshTrigger} />
            </div>


            <NouvelleInscription 
                show={showInscription} 
                handleClose={() => setShowInscription(false)} 
                refreshList={handleRefresh} // déclenche le refresh
            />
        </div>
    );
};

export default ListeEleve;

                
