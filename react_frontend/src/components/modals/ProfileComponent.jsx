import React, { useState, useEffect } from 'react';

const ProfileComponent = ({
  show,
  currentUser,
  handleClose,
  onUpdateProfile,
  onBack
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Quand currentUser change, on met à jour les champs
  useEffect(() => {
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
  }, [currentUser]);

  const handleSave = () => {
    onUpdateProfile({ ...currentUser, name, email });
    handleClose(); // on ferme après sauvegarde si tu veux
  };

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-center p-2" style={{ marginLeft: "10%" }}>Modifier l'information du profil</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              <img
                src={currentUser?.profilePicture || 'https://placehold.co/120'}
                alt="Profile"
                className="rounded-circle mb-3"
                width="120"
                height="120"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onBack}>
              Retour
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
