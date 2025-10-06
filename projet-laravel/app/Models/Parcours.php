<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parcours extends Model
{
    use HasFactory;

    protected $table = 'parcours';
    protected $primaryKey = 'code_formation';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code_formation',
        'nomformation',
        'datedebut',
    ];

    /**
     * Relation plusieurs parcours ↔ inscriptions (table pivot: suivres)
     */
    public function inscriptions()
    {
        return $this->belongsToMany(
            Inscription::class,
            'suivres',
            'code_formation', // clé étrangère sur suivres pointant vers parcours
            'no_inscrit'      // clé étrangère sur suivres pointant vers inscription
        );
    }

    /**
     * Génère automatiquement un code_formation unique avant insertion
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($parcours) {
            if (empty($parcours->code_formation)) {
                // Exemple: CF20251006113000A1B2C3
                $parcours->code_formation = 'CF' . strtoupper(uniqid());
            }
        });
    }
}
