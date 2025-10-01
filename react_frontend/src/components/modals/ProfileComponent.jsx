import React, { useState, useEffect } from 'react';

const ProfileComponent = ({ show, currentUser, handleClose, onUpdateProfile, onBack }) => {
  const [profileImage, setProfileImage] = useState('https://placehold.co/128x128/FFFFFF/000000?text=Photo');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Quand currentUser change, on met à jour les champs
  useEffect(() => {
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
  }, [currentUser]);

  const handleSave = () => {
    onUpdateProfile({ 
      ...currentUser, 
      name, 
      email,
      profilePicture: profileImage,
     });
    handleClose(); // on ferme après sauvegarde si tu veux
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend= () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  }
  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }} >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-center p-2" style={{ marginLeft: "10%" }}>Modifier l'information du profil</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-3">
              { profileImage ? (
                <img src={profileImage} alt="Profile" className="rounded-circle mb-3 border border-primary border-3" width="120"/>
              ): (
                <div className='rounded-circle bg-primary text-white fw-bold d-flex align-items-center mx-auto mb-3'
                  style={{ width: "120px", height: "120px", fontSize: '3rem' }}>
                  { getInitial(name) }    
                </div>
              )}
              <div className="mt-2">
                <label className="btn btn-sm btn-outline-primary cursor-pointer fw-bold">
                    Modifier le photo de Profil
                    <input type="file" accept="image/*" className="d-none" onChange={handleImageUpload} />
                </label>
            </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Nom d'utilisateur</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
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
