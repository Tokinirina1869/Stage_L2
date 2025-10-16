<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaiementModel extends Model
{
    use HasFactory;
    protected $table = 'paiements';
    protected $primaryKey = 'no_paie';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'no_paie', 'no_inscrit', 'idfrais', 'matricule', 'datepaie', 'modepaie','montantpaie'
    ];

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'matricule', 'matricule');
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class, 'no_inscrit', 'no_inscrit');
    }

    public function frais()
    {
        return $this->belongsTo(FraisModel::class, 'idfrais', 'idfrais');
    }
}
