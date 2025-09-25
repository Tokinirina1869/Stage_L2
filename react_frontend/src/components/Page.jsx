import React, { Component } from 'react';
import DashboardPage from './DashboadPage';
import ListeFormation from './liste/ListeFormation';
import ListeEleve from './liste/ListeEleve';
import PaymentPage from './Payement';         
import App from './Accueil';
import NavigationPage from './navigation/NavigationPage';
import LogoutModal from './modals/LogoutModal';
import ProfileComponent from './modals/ProfileComponent';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'dashboard',
      showLogoutModal: false,
      showProfilModal: false,
      currentUser: {
        name: 'Admin Laura Vicuna',
        email: 'admin@gmail.com',
        profilePicture: '/fma.png'
      }
    };
  }

  handleMenuChange = (menu) => {
    this.setState({ currentPage: menu });
  };

  handleLogoutClick = () => {
    this.setState({ showLogoutModal: true });
  };

  handleLogoutClose = () => {
    this.setState({ showLogoutModal: false });
  };

  handleProfilClick = () => {
    this.setState({ showProfilModal: true });
  };

  handleProfilClose = () => {
    this.setState({ showProfilModal: false });
  };

  handleUpdateProfile = (newProfile) => {
    // mettre à jour le profil local
    this.setState({ currentUser: newProfile, showProfilModal: false });
  };
 
  handleLogoutConfirm = () => {
    // Ici tu peux aussi clear un token, etc.
    this.setState({ currentPage: 'accueil', showLogoutModal: false });
    console.log('Déconnexion réussie !');
  };

  render() {
    const { currentPage, showLogoutModal, showProfilModal, currentUser } = this.state;

    const pages = {
      dashboard: <DashboardPage />,
      professionnelle: <ListeFormation />,
      academique: <ListeEleve />,
      paiement: <PaymentPage />,
      accueil: <App />,
    };

    return (
      <div>
        <NavigationPage currentPage={currentPage} handleMenuChange={this.handleMenuChange}  onLogout={this.handleLogoutClick}
          onProfil={this.handleProfilClick} // déclenche ouverture du modal profil
          currentUser={currentUser} // pour afficher l'avatar 
        /> 
        <main className="p-3">{pages[currentPage] || <DashboardPage />}</main>

        <ProfileComponent show={showProfilModal} currentUser={currentUser} handleClose={this.handleProfilClose} 
          onUpdateProfile={this.handleUpdateProfile} onBack={this.handleProfilClose} />

        <LogoutModal show={showLogoutModal} handleClose={this.handleLogoutClose} handleConfirm={this.handleLogoutConfirm} />
      </div>
    );
  }
}

export default Page;
