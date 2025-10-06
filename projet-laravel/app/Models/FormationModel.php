<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationModel extends Model
{
    use HasFactory;
    protected $table = 'inscrit_formations';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $fillable = [
        'no_inscrit',
        'duree',
        'type_formation',
    ];
    

    public function inscription()
    {
        return $this->belongsTo(Inscription::class, 'no_inscrit', 'no_inscrit');
    }

}
