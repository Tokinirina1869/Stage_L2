<?php

namespace App\Http\Controllers;
use App\Models\FraisModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ControllerFrais extends Controller
{
    public function index()
    {
        try{
                $data = FraisModel::all();
                return response()->json($data, 200);
        }

        catch(\Exception $e){
                return response()->json(["Erreur lors de la récupération des données!!", 500]);
        }
    }

    public function store(Request $request)
    {
        \Log::info('Requête reçue : ', $request->all());

        $Validator = Validator::make($request->all(), [
            'idfrais'   => 'required|string|unique:frais,idfrais',
            'nomfrais'  => 'required|string|max:100',
            'montant'   => 'required|integer'
        ]);
        if($Validator->fails()) {
            return response()->json([
                "Status"  => "Erreur",
                "Message" => "Données invalides",
                'errors'  => $Validator->errors(),
            ], 422);
        }

        $data = FraisModel::create([
            'idfrais'   => $request->idfrais,
            'nomfrais'  => $request->nomfrais,
            'montant'   => (int) $request->montant,
        ]);

        return response()->json([
            "Status" => "Succès",
            "Message" => "Frais ajoutés avec succès!!!",
            'data'    => $data
        ], 200);

    }
}
