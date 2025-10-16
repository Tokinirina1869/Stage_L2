<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaiementModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Exception;

class PaiementController extends Controller
{
    public function index()
    {
        try{
            $listePaie = PaiementModel::with(['personne', 'inscription', 'frais'])->get();
            return response()->json([
                'Status'    => "Succès",
                'Message'   => "Affichage avec succès",
                'data'      => $listePaie,
            ], 200);
        }
        catch(\Exception $e){
            return response()->json([
                'Status'    => "Erreur",
                'Message'   => "Erreur lors de l\'affichage des données",
                'Erreur'    => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
       \Log::info('Requête reçue : ', $request->all());

        $validator = Validator::make($request->all(), [
            'no_paie'      => 'required|max:7|unique:paiements,no_paie',
            'no_inscrit'   => 'required|integer', 
            'idfrais'      => 'required|string', 
            'matricule'    => 'required|string|max:7', 
            'datepaie'     => 'required|date',
            'modepaie'     => 'required|string',
            'montantpaie' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'Status'  => 'error',
                'Message' => 'Données invalides',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = PaiementModel::create([
            'no_paie'      => $request->no_paie,
            'no_inscrit'   => $request->no_inscrit, 
            'idfrais'      => $request->idfrais, 
            'matricule'    => $request->matricule, 
            'datepaie'     => $request->datepaie,
            'modepaie'     => $request->modepaie,
            'montantpaie'  => $request->montantpaie,
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
