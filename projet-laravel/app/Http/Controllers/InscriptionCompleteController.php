<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Personne;
use App\Models\Inscription;
use App\Models\FormationModel;
use App\Models\Parcours;
use App\Models\Suivre;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class InscriptionCompleteController extends Controller
{
    public function index()
    {
        $inscriptions = Inscription::with(['personne', 'inscriptionformations', 'parcours'])
            ->get();
        return response()->json($inscriptions);

    }

    public function show()
    {
        $personne = Personne::all();
        return response()->json($personne);
    }
    public function show1()
    {
        $inscription = Inscription::all();
        return response()->json($inscription);
    }

    public function getByFormation($nomformation)
    {
        $inscriptions = Inscription::with(['personne', 'parcours'])
        ->when($nomformation !== 'Tous', function ($query) use ($nomformation) {
            $query->whereHas('parcours', function ($subQuery) use ($nomformation) {
                $subQuery->where(function($q) use ($nomformation) {
                    $q->where('nomformation', 'ILIKE', '%' . $nomformation . '%')
                    ->orWhere('nomformation', 'ILIKE', '%' . str_replace(' et ', ',', $nomformation) . '%');
                });
            });
        })
        ->get();

        return response()->json($inscriptions);
    }

    public function countinscription(){
        $totalInscrit = Inscription::count();
        return response()->json(['total' => $totalInscrit]);
    }

    public function countMusique()
    {
        $totalMusique = Parcours::where('nomformation', 'LIKE', '%Musique%')->count();

        return response()->json(['total' => $totalMusique]);
    }
   
    public function countInformatique()
    {
        $totalInfo = Parcours::where('nomformation', 'LIKE', '%Informatique%')->count();
        return response()->json(['total' => $totalInfo]);
    }
    public function countCoupeEtCouture()
    {
        $totalCoupe = Parcours::where('nomformation', 'LIKE', '%Coupe et Coutûre%')->count();
        return response()->json(['total' => $totalCoupe]);
    }

    public function countLangues()
    {
        $totalLangue = Parcours::where('nomformation', 'LIKE', '%Langues%')->count();
        return response()->json(['total' => $totalLangue]);
    }
    public function countPatisserie()
    {
        $totalPatisserie = Parcours::where('nomformation', 'LIKE', '%Pâtisserie%')->count();
        return response()->json(['total' => $totalPatisserie]);
    }

    public function topParcours()
    {
        $result = DB::select("
            SELECT 
                TRIM(f.formation) AS formation,
                COUNT(DISTINCT i.matricule) AS total_personnes
            FROM inscriptions i
            JOIN suivres s ON s.no_inscrit = i.no_inscrit
            JOIN parcours p ON p.code_formation = s.code_formation
            CROSS JOIN LATERAL string_to_table(p.nomformation, ',') AS f(formation)
            GROUP BY TRIM(f.formation)
            ORDER BY total_personnes DESC
            LIMIT 1
        ");

        return response()->json($result[0] ?? []);
    }

     public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // 1️⃣ Création ou mise à jour de la personne
            $personneData = $request->only([
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','datedel','lieucin',
                'nompere','nommere','nomtuteur','adressparent','adresstuteur',
                'phoneparent','phonetuteur'
            ]);

            if($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos', 'public');
                $personneData['photo'] = $path;
            }

            $personne = Personne::updateOrCreate(
                ['cin' => $request->cin], 
                $personneData
            );

            // 2️⃣ Création de l'inscription
            $inscription = Inscription::create([
                'matricule' => $personne->matricule,
                'dateinscrit' => $request->dateinscrit,
                'anneesco' => $request->anneesco,
                'duree' => $request->duree ?? null,
                'type_formation' => $request->type_formation,
            ]);

            // 3️⃣ Création des parcours liés
            if($request->has('parcours')) {
                foreach($request->parcours as $p) {
                    if(!empty($p['nomformation'])) {
                        // Vérifie si le parcours existe déjà
                        $parcours = Parcours::firstOrCreate(
                            ['nomformation' => $p['nomformation'], 'datedebut' => $p['datedebut']],
                            ['code_formation' => 'CF'.strtoupper(uniqid())]
                        );

                        // Liaison avec l'inscription
                        $inscription->parcours()->attach($parcours->code_formation);
                    }
                }
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Inscription complète enregistrée']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Mettre à jour une inscription complète
     */
   public function update(Request $request, $matricule)
    {
        DB::beginTransaction();

        try {
            // ✅ Validation
            $request->validate([
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'naiss' => 'nullable|date',
                'lieunaiss' => 'nullable|string',
                'sexe' => 'nullable|string',
                'adresse' => 'nullable|string|max:255',
                'cin' => 'nullable|string|max:20',
                'datedel' => 'nullable|date',
                'lieucin' => 'nullable|string',
                'email' => 'nullable|email',
                'nompere' => 'nullable|string|max:100',
                'nommere' => 'nullable|string|max:100',
                'nomtuteur' => 'nullable|string|max:100',
                'adressparent' => 'nullable|string|max:255',
                'adresstuteur' => 'nullable|string|max:255',
                'phoneparent' => 'nullable|string|max:20',
                'phonetuteur' => 'nullable|string|max:20',
                'dateinscrit' => 'nullable|date',
                'anneesco' => 'nullable|string|max:20',
                'duree' => 'nullable|string|max:50',
                'type_formation' => 'nullable|string|max:50',
                'parcours' => 'nullable|array',
                'parcours.*.nomformation' => 'required_with:parcours|string|max:100',
                'parcours.*.datedebut' => 'required_with:parcours|date',
                'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            // ✅ Récupération des modèles
            $personne = Personne::where('matricule', $matricule)->firstOrFail();
            $inscription = Inscription::where('matricule', $matricule)->firstOrFail();

            // ✅ Mise à jour de la personne
            $personne->fill($request->only([
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','datedel','lieucin',
                'nompere','nommere','nomtuteur','adressparent','adresstuteur',
                'phoneparent','phonetuteur'
            ]));

            // ✅ Gestion de la photo
            if ($request->hasFile('photo')) {
                if ($personne->photo && Storage::exists('public/' . $personne->photo)) {
                    Storage::delete('public/' . $personne->photo);
                }
                $path = $request->file('photo')->store('photos', 'public');
                $personne->photo = $path;
            }

            $personne->save();

            // ✅ Mise à jour de l’inscription
            $inscription->update([
                'dateinscrit' => $request->dateinscrit,
                'anneesco' => $request->anneesco,
            ]);

            // ✅ Mise à jour des parcours (table pivot `suivres`)
            if ($request->has('parcours')) {
                // Supprime les liaisons existantes
                DB::table('suivres')->where('no_inscrit', $inscription->no_inscrit)->delete();

                foreach ($request->parcours as $p) {
                    // Vérifie si le parcours existe déjà (par nom)
                    $parcours = Parcours::firstOrCreate(
                        ['nomformation' => $p['nomformation']],
                        ['datedebut' => $p['datedebut']]
                    );

                    // Crée le lien dans la table pivot
                    DB::table('suivres')->insert([
                        'no_inscrit' => $inscription->no_inscrit,
                        'code_formation' => $parcours->code_formation,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Inscription mise à jour avec succès ✅',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'validation_error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur update inscription: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur interne du serveur lors de la mise à jour.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($matricule)
    {
        try{
            $personne = Personne::where('matricule', $matricule)->firstOrFail();

            $inscription = Inscription::where('matricule', $matricule)->first();

            if($inscription) {
                FormationModel::where('no_inscrit', $inscription->no_inscrit)->delete();
                Suivre::where('no_inscrit', $inscription->no_inscrit)->delete();

                $inscription->delete();
            }

            return response()->json([ 'message' => "Suppression avec succès" ], 200);
        }

        catch(\Exception $e) {
            return response()->json([
                'message' => 'Erreur Serveur',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}

