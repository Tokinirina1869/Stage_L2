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

use Barryvdh\DomPDF\Facade\Pdf;

class InscriptionCompleteController extends Controller
{

    public function index(Request $request) 
    {
        $query = Inscription::with(['personne', 'inscriptionformation', 'parcours']); 

        if ($request->filled('date_debut') && $request->filled('date_fin'))
        {
            $query->whereBetween('dateinscrit', [$request->date_debut, $request->date_fin]);
        }

        $inscriptions = $query->get();

        return response()->json([
            'Status' => "Succès",
            "Message" => 'Liste filtrée',
            'data'    => $inscriptions, 
        ]);
    }
    
    public function searchFormation($classe)
    {
        if ($classe === 'Tous') {
            $data = FormationModel::with(['inscription.personne', 'parcours'])->get();
        } 
        else {
            $data = FormationModel::with(['inscription.personne', 'parcours'])
                ->whereHas('parcours', function ($query) use ($classe) {
                    $query->where('nomformation', 'ILIKE', "%{$classe}%");
                })->get();
        }

        return response()->json([
            'Status' => 'Succès',
            'Message' => 'Filtrage par formation effectué avec succès',
            'data' => $data,
        ]);
    }
    
    public function listeFormation()
    {
        $data = FormationModel::with(['inscription.personne', 'parcours'])
            ->whereDoesntHave('inscription', function ($query) {
                $query->whereHas('inscriptionacademique'); 
            })
            ->get();

        return response()->json([
            'Status'  => 'Succès',
            'Message' => 'Liste des personnes inscrites uniquement à une formation',
            'data'    => $data,
        ]);
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

    public function getAllInscriptions() {
        $inscriptions = Inscription::with('inscriptionformation')->get();
        return response()->json($inscriptions);
    }

   public function getByFormation($nomformation)
    {
        $inscriptions = Inscription::with(['personne', 'parcours'])
            
            // 🎯 AJOUTER CETTE LIGNE pour exclure les académiques
            ->whereDoesntHave('inscriptionacademique') 
            
            ->when($nomformation !== 'Tous', function ($query) use ($nomformation) {
                $query->whereHas('parcours', function ($subQuery) use ($nomformation) {
                    $subQuery->where(function($q) use ($nomformation) {
                        $q->where('nomformation', 'ILIKE', '%' . $nomformation . '%')
                        ->orWhere('nomformation', 'ILIKE', '%' . str_replace(' et ', ',', $nomformation) . '%');
                    });
                });
            })
            ->get();

        return response()->json([
            'Status'  => 'Succès',
            'Message' => 'Liste des personnes inscrites uniquement à une formation (Filtrée)',
            'data'    => $inscriptions,
        ]);
    }
    public function countinscription(){
        $totalInscrit = FormationModel::count();
        return response()->json(['total' => $totalInscrit]);
    }

    public function countMusique()
    {
        $totalMusique = DB::table('inscriptions as i')
            ->join('inscrit_formations as insc', 'i.no_inscrit', '=', 'insc.no_inscrit')
            ->join('suivres as s', 's.no_inscrit', '=', 'insc.no_inscrit')
            ->join('parcours as p', 'p.code_formation', '=', 's.code_formation')
            ->where('p.nomformation', 'LIKE', '%Musique%')
            ->count();

        return response()->json(['total' => $totalMusique]);
    }
   
    public function countInformatique()
    {
        $totalInfo = DB::table('inscriptions as i')
            ->join('inscrit_formations as insc', 'i.no_inscrit', '=', 'insc.no_inscrit')
            ->join('suivres as s', 's.no_inscrit', '=', 'insc.no_inscrit')
            ->join('parcours as p', 'p.code_formation', '=', 's.code_formation')
            ->where('p.nomformation', 'LIKE', '%Informatique%')
            ->count();

        return response()->json(['total' => $totalInfo]);
    }
    public function countCoupeEtCouture()
    {
        $totalCoupe = DB::table('inscriptions as i')
            ->join('inscrit_formations as insc', 'i.no_inscrit', '=', 'insc.no_inscrit')
            ->join('suivres as s', 's.no_inscrit', '=', 'insc.no_inscrit')
            ->join('parcours as p', 'p.code_formation', '=', 's.code_formation')
            ->where('p.nomformation', 'LIKE', '%Coupe et Coutûre%')
            ->count();
        return response()->json(['total' => $totalCoupe]);
    }

    public function countLangues()
    {
        $totalLangue = DB::table('inscriptions as i')
            ->join('inscrit_formations as insc', 'i.no_inscrit', '=', 'insc.no_inscrit')
            ->join('suivres as s', 's.no_inscrit', '=', 'insc.no_inscrit')
            ->join('parcours as p', 'p.code_formation', '=', 's.code_formation')
            ->where('p.nomformation', 'LIKE', '%Langues%')
            ->count();
        return response()->json(['total' => $totalLangue]);
    }
    public function countPatisserie()
    {
        $totalPatisserie = DB::table('inscriptions as i')
            ->join('inscrit_formations as insc', 'i.no_inscrit', '=', 'insc.no_inscrit')
            ->join('suivres as s', 's.no_inscrit', '=', 'insc.no_inscrit')
            ->join('parcours as p', 'p.code_formation', '=', 's.code_formation')
            ->where('p.nomformation', 'LIKE', '%Pâtisserie%')
            ->count();
        return response()->json(['total' => $totalPatisserie]);
    }

    public function topParcours()
    {
        $formationTop = DB::table('inscrit_formations as insc')
            ->join('suivres as s', 'insc.no_inscrit', '=', 's.no_inscrit')
            ->join('parcours as p', 'p.code_formation', '=', 's.code_formation')
            ->select('p.nomformation', DB::raw('COUNT(insc.no_inscrit) as total'))
            ->groupBy('p.nomformation')
            ->orderByDesc('total')
            ->limit(1)
            ->first();

        return response()->json([
            'Status' => 'Succès',
            'Message' => 'Formation la plus suivie',
            'Data' => $formationTop,
        ]);

    }



    public function filter(Request $request)
    {
        $typeFormation = $request->type_formation;
        $nomFormation  = $request->nom_formation;
        $anneeScolaire = $request->annee_scolaire;

        $apprenants = FormationModel::select(
                'inscrit_formations.no_inscrit',
                'pe.nom',
                'pe.prenom',
                'pe.naiss',
                'pe.lieunaiss',
                'pe.sexe',
                'pe.adresse',
                'inscrit_formations.type_formation',
                'p.nomformation',
                'inscrit_formations.duree'
            )
            ->join('inscriptions as i', 'inscrit_formations.no_inscrit', '=', 'i.no_inscrit')
            ->join('personnes as pe', 'i.matricule', '=', 'pe.matricule')
            ->join('suivres as s', 'inscrit_formations.no_inscrit', '=', 's.no_inscrit')
            ->join('parcours as p', 's.code_formation', '=', 'p.code_formation')
            ->where('inscrit_formations.type_formation', $typeFormation)
            ->where('p.nomformation', $nomFormation)
            ->where('i.anneesco', $anneeScolaire)
            ->get();

        return response()->json([
            'Status'  => 'Succès',
            'Message' => 'Apprenants filtrés',
            'Data'    => $apprenants
        ]);
    }

    public function getEffectifsParFormation()
    {
        $effectifs = DB::table('inscrit_formations as if')
            ->join('suivres as s', 'if.no_inscrit', '=', 's.no_inscrit')
            ->join('parcours as p', 's.code_formation', '=', 'p.code_formation')
            ->select(
                'p.nomformation as name',
                DB::raw('COUNT(if.no_inscrit) as value')
            )
            ->groupBy('p.nomformation')
            ->orderByDesc('value')
            ->get();

        // Calcul du total général (utile pour résumé côté front)
        $total = $effectifs->sum('value');

        return response()->json([
            'status' => 'succès',
            'effectifs' => $effectifs,
            'total' => $total
        ]);
    }
    
    public function getEffectifsTrimestriels()
    {
        $effectifs = DB::table('inscriptions')
            ->select(
                DB::raw("EXTRACT(YEAR FROM dateinscrit)::int AS annee"),
                DB::raw("
                    CASE 
                        WHEN EXTRACT(MONTH FROM dateinscrit) BETWEEN 9 AND 12 THEN 'T1'
                        WHEN EXTRACT(MONTH FROM dateinscrit) BETWEEN 1 AND 3 THEN 'T2'
                        WHEN EXTRACT(MONTH FROM dateinscrit) BETWEEN 4 AND 7 THEN 'T3'
                    END AS trimestre
                "),
                DB::raw("COUNT(no_inscrit) AS total")
            )
            ->groupBy('annee', 'trimestre')
            ->orderBy('annee', 'asc')
            ->orderBy('trimestre', 'asc')
            ->get();

        return response()->json([
            'Status' => 'Succès',
            'Data'   => $effectifs
        ]);
    }
    
    public function shwoByMatricule($matricule)
    {
        $inscription = Inscription::where('matricule', $matricule)->with(['personne', 'parcours'])->first();

        if(!$inscription){
            return response()->json(['message' => 'Inscription non trouvée'], 404);
        }

        return response()->json($inscription);
    }

    public function store(Request $request)
    {
        // ----------------------------
        // 1️⃣ Validation
        // ----------------------------
        $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'nullable|string|max:255',
            'naiss'          => 'required|date',
            'sexe'           => 'required|string|max:10',
            'adresse'        => 'required|string|max:200',
            'dateinscrit'    => 'required|date',
            'anneesco'       => 'required|string|max:20',
            'duree'          => 'required|string|max:50',
            'type_formation' => 'required|string|max:100',
            'parcours'       => 'required|array',
            'email'          => 'nullable|email',
            'cin'            => 'nullable|string|max:12',
            'photo'          => 'nullable|file|mimes:jpeg,png,jpg,gif',
        ]);

        DB::beginTransaction();

        try {
            $annee = date('y'); // ex: 25
            $personne = null;

            // ----------------------------
            // 2️⃣ Vérifier si la personne existe (via CIN)
            // ----------------------------
            if (!empty($request->cin)) {
                $personne = Personne::where('cin', $request->cin)->first();
            }

            // ----------------------------
            // 3️⃣ Déterminer le numéro unique global
            // ----------------------------
            if ($personne) {
                // Personne existante → récupérer le numéro existant
                if (preg_match('/\/(\d+)$/', $personne->matricule, $matches)) {
                    $numero = (int)$matches[1];
                } else {
                    $numero = 1;
                }
            } else {
                // Nouvelle personne → incrémente le dernier numéro global
                $dernier = Personne::orderByRaw("CAST(SPLIT_PART(matricule, '/', 3) AS INTEGER) DESC")->first();
                if ($dernier && preg_match('/\/(\d+)$/', $dernier->matricule, $matches)) {
                    $numero = (int)$matches[1] + 1;
                } else {
                    $numero = 1;
                }
            }

            // ----------------------------
            // 4️⃣ Gérer la photo si présente
            // ----------------------------
            $personneData = array_filter($request->only([
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','email','datedel','lieucin',
                'nompere','nommere','nomtuteur','adressparent','adresstuteur',
                'phoneparent','phonetuteur'
            ]), fn($v) => !is_null($v) && $v !== '');

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos', 'public');
                $personneData['photo'] = $path;
            }

            // ----------------------------
            // 5️⃣ Création ou mise à jour de la personne
            // ----------------------------
            if ($personne) {
                $personne->update($personneData);
            } else {
                // Générer le matricule pour le premier parcours
                $firstNomFormation = $request->input('parcours')[0]['nomformation'] ?? null;
                $parcours = Parcours::where('nomformation', $firstNomFormation)->first();
                $codeFormation = $parcours ? $parcours->code_formation : 'XXX';
                $matricule = "{$annee}/{$codeFormation}/" . str_pad($numero, 2, '0', STR_PAD_LEFT);

                $personneData['matricule'] = $matricule;
                $personne = Personne::create($personneData);
            }

            // ----------------------------
            // 6️⃣ Création de l'inscription principale
            // ----------------------------
            $inscription = Inscription::create([
                'matricule'      => $personne->matricule, // numéro global avec code formation du premier parcours
                'dateinscrit'    => $request->dateinscrit,
                'anneesco'       => $request->anneesco,
                'duree'          => $request->duree ?? null,
                'type_formation' => $request->type_formation,
            ]);

              // 6️⃣ FORMATION
            FormationModel::create([
                'no_inscrit'     => $inscription->no_inscrit,
                'duree'          => $request->duree ?? null,
                'type_formation' => $request->type_formation,
            ]);
            // ----------------------------
            // 7️⃣ Enregistrer tous les parcours choisis
            // ----------------------------
            foreach ($request->parcours as $p) {
                if (!empty($p['nomformation'])) {
                    $formation = Parcours::firstOrCreate(
                        ['nomformation' => $p['nomformation']],
                        ['datedebut' => $p['datedebut'] ?? null]
                    );

                    // Générer le matricule spécifique à ce parcours
                    $matriculeParcours = "{$annee}/{$formation->code_formation}/" . str_pad($numero, 2, '0', STR_PAD_LEFT);

                    // On peut stocker ce matricule spécifique pour le parcours si besoin
                    $inscription->parcours()->syncWithoutDetaching([$formation->code_formation]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => '✅ Inscription complète enregistrée avec succès.',
                'numero_global' => $numero
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => "❌ Erreur ligne {$e->getLine()} : " . $e->getMessage(),
            ], 500);
        }
    }



    public function update(Request $request, $matricule)
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'naiss' => 'nullable|date',
                'lieunaiss' => 'nullable|string',
                'sexe' => 'nullable|string',
                'adresse' => 'nullable|string|max:255',
                'cin' => 'nullable|string|max:20',
                'datedel' => 'nullable|date',
                'lieucin' => 'nullable|string',
                'email' => 'nullable|email',
                'nompere' => 'nullable|string|max:255',
                'nommere' => 'nullable|string|max:255',
                'nomtuteur' => 'nullable|string|max:255',
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

            $personne = Personne::where('matricule', $matricule)->firstOrFail();
            $inscription = Inscription::where('matricule', $matricule)->firstOrFail();

            $personne->fill($request->only([
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','email','datedel','lieucin',
                'nompere','nommere','nomtuteur','adressparent','adresstuteur',
                'phoneparent','phonetuteur'
            ]));

            if ($request->hasFile('photo')) {
                if ($personne->photo && Storage::exists('public/' . $personne->photo)) {
                    Storage::delete('public/' . $personne->photo);
                }
                $personne->photo = $request->file('photo')->store('photos', 'public');
            }

            $personne->save();

            $inscription->update([
                'dateinscrit' => $request->dateinscrit,
                'anneesco' => $request->anneesco,
                'duree' => $request->duree ?? $inscription->duree,
                'type_formation' => $request->type_formation ?? $inscription->type_formation,
            ]);

            if ($request->has('parcours') && is_array($request->parcours)) {
                $idsFormations = [];

                foreach ($request->parcours as $p) {
                    if (!empty($p['nomformation'])) {
                        $formation = Parcours::firstOrCreate(
                            ['nomformation' => $p['nomformation']],
                            ['datedebut' => $p['datedebut']]
                        );

                        $idsFormations[] = $formation->code_formation;
                    }
                }

                // Sync : supprime les liens non présents et ajoute les nouveaux
                $inscription->parcours()->sync($idsFormations);
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
        try {
            $personne = Personne::where('matricule', $matricule)->first();
            if (!$personne) {
                return response()->json([
                    'message' => "Personne avec le matricule $matricule introuvable"
                ], 404);
            }

            $inscription = Inscription::where('matricule', $matricule)->first();
            if ($inscription) {
                FormationModel::where('no_inscrit', $inscription->no_inscrit)->delete();
                Suivre::where('no_inscrit', $inscription->no_inscrit)->delete();

                $inscription->delete();
            }

            return response()->json([
                'message' => "Suppression effectuée avec succès"
            ], 200);

        } catch (\Exception $e) {
            \Log::error("Erreur suppression pour matricule $matricule : " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur serveur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}

