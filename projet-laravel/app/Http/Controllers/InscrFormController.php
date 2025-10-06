<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormationModel;

class InscrFormController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            "no_inscrit"     => "required|exists:inscriptions,no_inscrit",
            "duree"          => "required|integer",
            "type_formation" => "required|string|max:100"
        ]);

        $formation = FormationModel::create($data);

        return response()->json($formation, 201);
    }

    
    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
