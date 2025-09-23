import React, { Component } from 'react';

class FormulaireInscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: 'https://placehold.co/128x128/FFFFFF/000000?text=Photo',
        };
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    }

    render() {
        const { profileImage } = this.state;

        return (
            <div>
                <div className="text-center mb-4">
                    <img src={profileImage} alt="Profil" className="rounded-circle fw-bold border border-primary" 
                        style={{ width: '128px', height: '128px', objectFit: 'cover' }} />
                    <div className="mt-2">
                        <label className="btn btn-sm btn-outline-primary cursor-pointer fw-bold">
                            Sélectionner une photo
                            <input type="file" accept="image/*" className="d-none" onChange={this.handleImageUpload} />
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 mb-3">
                        <label className='form-label'>Numéro Matricule: </label>
                        <input type="text" name="matricule" className="form-control shadow text-center" placeholder='Numéro matricule....'/>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label className='form-label'>Nom: </label>
                        <input type="text" name="nom" className="form-control shadow text-center" placeholder='nom....'/>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label className='form-label'>Prénom: </label>
                        <input type="text" name="prenom" className="form-control shadow text-center" placeholder='prénom....'/>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label className='form-label'>Date de naissance: </label>
                        <input type="date" name="datenaiss" className="form-control shadow text-center" placeholder='La date de naissance..'/>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label className="form-label">Sexe: </label>
                        <select name="sexe" className="form-control text-center">
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                        </select>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label className='form-label'>Adresse: </label>
                        <input type="text" name="adresse" className="form-control shadow text-center" placeholder='adresse actuelle....'/>
                    </div>
                    <div className="col-lg-6 mb-3">
                        <label className='form-label'>CIN: </label>
                        <input type="text" name="cin" className="form-control shadow text-center" placeholder='Numéro CIN....'/>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormulaireInscription;
