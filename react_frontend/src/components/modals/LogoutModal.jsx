import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

                <div className="modal-footer justify-content-center mb-3">
                    <button type="button" className="btn btn-outline-secondary w-25 mx-4 p-2" onClick={handleClose}> 
                        <FaTimes size={24} className='mx-1 me-2' />
                        Annuler
                    </button>
                    <Link to="/" className='text-decoration-none'>
                        <button type="submit" className="btn btn-outline-danger w-30 mx-4 p-2" onClick={handleConfirm} >
                            <i className="fa-solid fa-sign-out-alt me-2"></i> Se déconnecter
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default LogoutModal;
