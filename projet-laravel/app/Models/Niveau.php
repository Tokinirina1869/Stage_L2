<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// class Niveau extends Model
// {
//     use HasFactory;
//     protected $table = 'niveaux';
//     protected $primaryKey = 'code_niveau';
//     public $incrementing = false;
//     protected $keyType = 'string';

//     protected $fillable = ['code_niveau', 'nomniveau'];

// }

class Niveau extends Model
{
    use HasFactory;
    protected $table = 'niveaux';
    protected $primaryKey = 'code_niveau';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['code_niveau', 'nomniveau'];
}
