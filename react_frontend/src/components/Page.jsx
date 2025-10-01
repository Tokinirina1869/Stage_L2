import React, { useEffect, useState } from 'react';
import DashboardPage from "./DashboadPage";
import ListeEleve from './liste/ListeEleve';
import ListeFormation from './liste/ListeFormation'
import PaymentPage from './Paiement/Payement';  
import NavigationPage from './navigation/NavigationPage';
import LogoutModal from './modals/LogoutModal';
import ProfileComponent from './modals/ProfileComponent';
import DashboadEleve from './liste/Dash_Eleve';
import DashboadFormation from './liste/Dash_Formation';

function Page() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfilModal, setShowProfilModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saveUser = localStorage.getItem("user");
    if(saveUser) {
      setCurrentUser(JSON.parse(saveUser));
    }
  }, []);

  // === Handlers ===
  const handleMenuChange = (menu) => {
    setCurrentPage(menu);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutClose = () => {
    setShowLogoutModal(false);
  };

  const handleProfilClick = () => {
    setShowProfilModal(true);
  };

  const handleProfilClose = () => {
    setShowProfilModal(false);
  };

  const handleUpdateProfile = (newProfile) => {
    setCurrentUser(newProfile);
    setShowProfilModal(false);
  };

  const handleLogoutConfirm = () => {
    // Ici tu peux aussi clear un token, etc.
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);

    setCurrentPage('accueil');
    setShowLogoutModal(false);
  };

  // === Pages disponibles ===
  const pages = {
    dashboard: <DashboardPage />,
    eleve: <DashboadEleve onViewList={() => setCurrentPage('listeEleve')} />,
    formation: <DashboadFormation onViewListPro={() => setCurrentPage('listeFormation')} />,
    listeEleve: <ListeEleve onViewDash={() => setCurrentPage('eleve')}/>,
    listeFormation: <ListeFormation onViewDashPro={() => setCurrentPage('formation')}  /> ,
    paiement: <PaymentPage />,
  };

  return (
    <div>
      <NavigationPage currentPage={currentPage} handleMenuChange={handleMenuChange} onLogout={handleLogoutClick} 
        onProfil={handleProfilClick} currentUser={currentUser} // déclenche ouverture du modal profil currentUser={currentUser} // pour afficher l'avatar
      />

      <main className="p-3">
        {pages[currentPage] || <DashboardPage />}
      </main>

      <ProfileComponent show={showProfilModal} currentUser={currentUser} handleClose={handleProfilClose} onUpdateProfile={handleUpdateProfile} onBack={handleProfilClose}/>

      <LogoutModal show={showLogoutModal} handleClose={handleLogoutClose} handleConfirm={handleLogoutConfirm}/>
    </div>
  );
}

export default Page;
