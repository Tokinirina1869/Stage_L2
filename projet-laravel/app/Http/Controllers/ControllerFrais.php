<?php

namespace App\Http\Controllers;
use App\Models\FraisModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
}
