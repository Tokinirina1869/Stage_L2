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

    // public function listeFormation()
    // {
    //     $data = FormationModel::with(['inscription.personne', 'parcours'])
    //         ->whereHas('inscription', function ($query) {
    //             $query->whereDoesntHave('inscriptionacademique'); 
    //         })
    //         ->get();

    //     return response()->json([
    //         'Status'  => 'Succès',
    //         'Message' => 'Liste des personnes inscrites à une formation uniquement',
    //         'data'    => $data,
    //     ]);
    // }
    
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
        $totalInscrit = Inscription::count();
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
        // Validation des champs principaux
        $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'nullable|string|max:255',
            'naiss'          => 'required|date',
            'sexe'           => 'required|string|max:10',
            'adresse'        => 'required|string|max:200',
            'dateinscrit'    => 'required|date',
            'anneesco'       => 'required|string|max:20',
            // 'matricule_code' est le préfixe de la formation (e.g., 'INF', 'LAN')
            'matricule_code' => 'required|string|size:3', 
            'parcours'       => 'required|array',
            'cin'            => 'nullable|string|max:12', 
            'photo'          => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // 1. Récupération et nettoyage des données pour la table Personne
            $personneData = $request->only([
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','datedel','lieucin',
                'nompere','nommere','nomtuteur','adressparent','adresstuteur',
                'phoneparent','phonetuteur'
            ]);
            
            // Nettoyage: Supprimer les clés vides ou nulles
            $personneData = array_filter($personneData, function($value) {
                return !is_null($value) && $value !== '';
            });

            $cin_present = !empty($request->cin);
            $personne = null;
            $matricule = null;
            
            // 2. LOGIQUE DE GESTION DE LA PERSONNE ET DU MATRICULE
            if ($cin_present) {
                $personne = Personne::where('cin', $request->cin)->first();
            }

            if ($personne) {
                // Cas A : Personne EXISTE (Mise à jour et réutilisation du matricule)
                $matricule = $personne->matricule;
                
                // Gestion de la photo lors de la mise à jour
                if ($request->hasFile('photo')) {
                    $path = $request->file('photo')->store('photos', 'public');
                    $personneData['photo'] = $path;
                }
                
                $personne->update($personneData);
                
            } 
            else {
                // Cas B : Nouvelle Personne (CIN manquant ou nouveau CIN). Génération du matricule.

                $codeFormation = strtoupper($request->input('matricule_code'));
                
                // 3. Génération du NOUVEAU matricule (Format: XXX00001)
                
                // 🎯 CORRECTION : Récupérer le dernier matricule GLOBAL
                $dernierMatriculeGlobal = Personne::orderBy('matricule', 'desc')->first();

                $numero = 1;
                if ($dernierMatriculeGlobal) {
                    // Extraire le numéro séquentiel (les 5 derniers caractères)
                    $numeroSequence = (int) substr($dernierMatriculeGlobal->matricule, -5); 
                    
                    // Incrémentation du numéro séquentiel global
                    $numero = $numeroSequence + 1;
                }
                
                // Combinaison: Préfixe de la formation + Numéro séquentiel global
                $matricule = $codeFormation . str_pad($numero, 5, '0', STR_PAD_LEFT);
                
                // 4. Création de la nouvelle Personne
                $personneData['matricule'] = $matricule;
                
                // Gestion de la photo
                if ($request->hasFile('photo')) {
                    $path = $request->file('photo')->store('photos', 'public');
                    $personneData['photo'] = $path;
                } else {
                    unset($personneData['photo']);
                }
                
                $personne = Personne::create($personneData);

                if (!$personne || !$personne->exists) {
                    throw new \Exception("Échec de la création de l'enregistrement Personne. Vérifiez \$fillable du modèle.");
                }
            } 
            
            // 5. CRÉATION DE L'INSCRIPTION
            $inscription = Inscription::create([
                'matricule'      => $matricule, 
                'dateinscrit'    => $request->dateinscrit,
                'anneesco'       => $request->anneesco,
                'duree'          => $request->duree ?? null,
                'type_formation' => $request->type_formation,
            ]);
            
            // 6. CRÉATION DE LA FORMATION
            FormationModel::create([
                'no_inscrit'     => $inscription->no_inscrit,
                'duree'          => $request->duree ?? null,
                'type_formation' => $request->type_formation,
            ]);

            // 7. GESTION DES PARCOURS ASSOCIÉS (Table pivot)
            if ($request->has('parcours') && is_array($request->parcours)) {
                foreach ($request->parcours as $p) {
                    if (!empty($p['nomformation'])) {
                        // Trouver ou créer le parcours dans la table 'parcours'
                        $formation = Parcours::firstOrCreate(
                            ['nomformation' => $p['nomformation']], // Conditions de recherche
                            [ // Données de création si non trouvé
                                'code_formation' => 'CF' . strtoupper(uniqid()), 
                                'datedebut' => $p['datedebut'] ?? null,
                            ]
                        );

                        // Attacher l'inscription au parcours
                        $inscription->parcours()->syncWithoutDetaching([$formation->code_formation]);
                    }
                }
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Inscription complète enregistrée'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => "Erreur Ligne {$e->getLine()} : " . $e->getMessage(),
                'line' => $e->getLine(),
                'input' => $request->all()
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
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','datedel','lieucin',
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

