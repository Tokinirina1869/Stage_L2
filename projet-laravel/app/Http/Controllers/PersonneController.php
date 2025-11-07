<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PersonneController extends Controller
{
    public function mineurs() 
    {
        $today = Carbon::today();
        $ageLimit = $today->copy()->subYears(18);

        $mineurs = DB::table('personnes')
                   ->where('naiss', '>', $ageLimit)
                   ->select('matricule', 'nom', 'naiss')
                   ->orderBy('nom')
                   ->get()
                   ->map(function ($p) use ($today) {
                    $p->age = Carbon::parse($p->naiss)->age;

                    return $p;
                   });

        return response()->json([
            'status' => 'succès',
            'total'  => $mineurs->count(),
            'data'   => $mineurs
        ]);
    }

    public function majeurs()
    {
        $today = Carbon::today();
        $ageLimit = $today->copy()->subYears(18);
        $majeurs = DB::table('personnes')
                  ->where('naiss', '<=', $ageLimit)
                  ->select('matricule', 'nom', 'naiss')
                   ->orderBy('nom')
                   ->get()
                   ->map(function ($p) use ($today) {
                    $p->age = Carbon::parse($p->naiss)->age;

                    return $p;
                   });

        return response()->json([
            'status' => 'succès',
            'total'  => $majeurs->count(),
            'data'   => $majeurs
        ]);
    }

    public function statistiqueMineurMajeur()
    {
        $today = Carbon::today();
        $ageLimit = $today->copy()->subYears(18);
        $mineurs = DB::table('personnes')->where('naiss', '>', $ageLimit)->count();
        $majeurs = DB::table('personnes')->where('naiss', '<=', $ageLimit)->count();

        return response()->json([
            'status'  => 'succès',
            'mineurs' => $mineurs,
            'majeurs' => $majeurs,
        ]);
    }
}
