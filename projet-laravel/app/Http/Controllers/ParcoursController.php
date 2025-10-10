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

    public function store(Request $request)
    {
        $request->validate([
           'code_formation' => 'required',
           'nomformation' => 'required',
           'datedebut'    => 'required',
        ]);

        $data = Parcours::create([
            'code_formation' => $request->code_formation,
            'nomformation' => $request->nomformation,
            'datedebut'    => $request->datedebut,
        ]);

        return response()->json($data, 200);
    }

}
