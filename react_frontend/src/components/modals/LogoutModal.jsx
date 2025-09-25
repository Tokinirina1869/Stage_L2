import React from 'react';
import { FaTimes, FaSignOutAlt } from 'react-icons/fa';

const LogoutModal = ({ show, handleClose, handleConfirm }) => (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Déconnexion</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                    <p className="text-center">Voulez-vous vraiment vous déconnecter ?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-light" onClick={handleClose}>
                        <FaTimes size={24} className='mx-1 me-2' /> Annuler
                    </button>
                    <button type="button" className="btn btn-outline-danger" onClick={handleConfirm}>
                        <FaSignOutAlt size={24} className='mx-2' /> Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default LogoutModal;
