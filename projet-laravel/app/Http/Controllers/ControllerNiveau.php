<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Niveau;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ControllerNiveau extends Controller
{

   public function index()
{
    try {
        $liste = Niveau::all();

        return response()->json([
            'Status'  => $liste->isEmpty() ? 'warning' : 'Succes',
            'Message' => $liste->isEmpty() ? 'Aucun niveau trouvé' : 'Liste des niveaux récupérée avec succes.',
            'data'    => $liste
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Erreur lors du listage des niveaux : ' . $e->getMessage());
        
        return response()->json([
            'Status'  => 'error',
            'Message' => 'Erreur interne du serveur lors du chargement des niveaux.',
            'details' => $e->getMessage()
        ], 500);
    }
}



    public function store(Request $request)
    {
        \Log::info('Requête reçue : ', $request->all());

        $validator = Validator::make($request->all(), [
            'code_niveau' => 'required|max:10|unique:niveaux,code_niveau',
            'nomniveau'   => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'Status'  => 'error',
                'Message' => 'Données invalides',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = Niveau::create([
            'code_niveau' => $request->code_niveau,
            'nomniveau'   => $request->nomniveau,
        ]);

        return response()->json([
            'Status'  => 'Succès',
            'Message' => 'Niveau ajouté avec succès',
            'data'    => $data,
        ], 201);
    
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
