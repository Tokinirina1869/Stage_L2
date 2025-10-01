<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personne extends Model
{
    use HasFactory;
    protected $table = "personnes";
    protected $primarykey = 'matricule';
    public $inscrementing = false;
    protected $keytype = 'string';
    protected $fillable = [
        'matricule', 'nom', 'prenom', 'naiss', 'sexe','adresse','photo',
        'cin', 'nompere','nommere','nomtuteur', 'adressparent', 'adresstuteur',
        "phoneparent", "phonetuteur"
    ];
}
