<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    use HasFactory;

    protected $table = 'inscriptions';
    protected $primaryKey = 'no_inscrit';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['matricule', 'dateinscrit', 'anneesco'];

    // Nettoie le matricule avant l’enregistrement
    public function setMatriculeAttribute($value)
    {
        $this->attributes['matricule'] = trim($value);
    }

    // Relation vers la personne
    public function personne()
    {
        return $this->belongsTo(Personne::class, 'matricule', 'matricule');
    }

    public function inscriptionformations()
    {
        return $this->hasMany(FormationModel::class, 'no_inscrit', 'no_inscrit');
    }

    public function parcours()
    {
        return $this->belongsToMany(
            Parcours::class,
            'suivres',
            'no_inscrit',
            'code_formation',
            'no_inscrit',
            'code_formation'
        );
    }
}
