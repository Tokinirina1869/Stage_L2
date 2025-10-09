<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personne extends Model
{
    use HasFactory;

    protected $table = "personnes";
    protected $primaryKey = 'matricule';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'matricule','nom','prenom','naiss','sexe','adresse','photo',
        'cin','nompere','nommere','nomtuteur','adressparent','adresstuteur',
        'phoneparent','phonetuteur'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($personne) {
            // Récupérer le plus grand numéro existant dans la table
            $latestNumber = Personne::selectRaw('MAX(CAST(SUBSTRING(matricule FROM 4) AS INTEGER)) as max_number')
                ->first()
                ->max_number;

            $number = $latestNumber ? $latestNumber + 1 : 1;

            // Générer le matricule avec remplissage à gauche
            $personne->matricule = 'FMA' . str_pad($number, 4, '0', STR_PAD_LEFT);
        });
    }

    // Nettoie les espaces dans le matricule
    public function setMatriculeAttribute($value)
    {
        $this->attributes['matricule'] = trim($value);
    }

    // Relation : une personne a plusieurs inscriptions
    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'matricule', 'matricule');
    }
}

