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
        'matricule','nom','prenom','naiss','lieunaiss','sexe','adresse','photo',
        'cin','lieucin','datedel','nompere','nommere','nomtuteur','adressparent','adresstuteur',
        'phoneparent','phonetuteur'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($personne) {

            $latestNumber = Personne::selectRaw('MAX(CAST(SUBSTRING(matricule FROM 4) AS INTEGER)) as max_number')
                ->first()
                ->max_number;

            $number = $latestNumber ? $latestNumber + 1 : 1;

            $personne->matricule = 'FMA' . str_pad($number, 4, '0', STR_PAD_LEFT);
        });
    }

    public function setMatriculeAttribute($value)
    {
        $this->attributes['matricule'] = trim($value);
    }

    // Relation : une personne a plusieurs inscriptions
    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'matricule', 'matricule');
    }

    // public function paiement()
    // {
    //     return $this->hasMany(PaiementModel::class, 'matricule', 'matricule');
    // }
}

