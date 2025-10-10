<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Parcours;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ParcoursController extends Controller
{
    public function index()
    {
        $parcours = Parcours::all();
        return response()->json($parcours, 201);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code_formation' => 'required|unique:parcours,code_formation',
            'nomformation'   => 'required|string',
            'datedebut'      => 'required|date'
        ]);

        if($validator->fails()){
            return response()->json([
                'Status'    => 'Erreur',
                'Message'   => 'Données invalides',
                'data'      => $validator->errors(),
            ], 422);
        }

        $data = Parcours::create([
            'code_formation' => $request->code_formation,
            'nomformation' => $request->nomformation,
            'datedebut'    => $request->datedebut,
        ]);

        return response()->json([
            'Status'    => 'Succès',
            'Message'   => 'Nouveau Parcours ajouté avec succès',
            'data'      => $data
        ], 200);
    }

}
