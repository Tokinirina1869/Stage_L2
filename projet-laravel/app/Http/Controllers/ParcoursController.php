<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Parcours;
class ParcoursController extends Controller
{
    public function index()
    {
        $parcours = Parcours::all();
        return response()->json($parcours, 201);
    }

}
