<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscription;
use App\Models\Personne;
use App\Models\Niveau;
use App\Models\InscriptionAcademie;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InscriptionController extends Controller
{

    public function index(Request $request)
    {
        $query = InscriptionAcademie::with('inscription.personne', 'niveau');
        if($request->filled('date_debut') && $request->filled('date_fin'))
        {
            $query->whereHas('inscription', function($q) use ($request) {
                $q->whereBetween('dateinscrit', [$request->date_debut, $request->date_fin]);
            });
        }

        return response()->json([
            'Status' => "Succès",
            "Message" => 'Liste filtée',
            'data'    => $query->get(),
        ]);
    }

    public function searchClasse($classe) 
    {
        if($classe === 'Tous')
        {
            $data = InscriptionAcademie::with('inscription.personne', 'niveau')->get();
        }
        else
        {
            $data = InscriptionAcademie::with('inscription.personne', 'niveau')
                ->whereHas('niveau', function ($query) use ($classe)
                {
                    $query->where('nomniveau', 'ILIKE', "%{$classe}%");
                })->get();
        }

        return response()->json([
            'Status' => 'Succès',
            'Message' => 'Filtrage par classe',
            'data' => $data,
        ]);
    }

    public function listeAcademie()
    {
        $data = InscriptionAcademie::with(['inscription.personne', 'niveau'])
            ->whereDoesntHave('inscription.inscriptionformation')
            ->get();

        return response()->json([
            'Status'  => 'Succès',
            'Message' => 'Liste des personnes inscrites uniquement à une académie',
            'data'    => $data,
        ]);
    }


    public function countNiveau() {
        $nbrNiveau = InscriptionAcademie::count();
        return response()->json(['Status' => 'Succès', 'data' => $nbrNiveau]);

    }

    public function countSeconde() {
        $totalSeconde = DB::table('inscrit_academies as insc')
            ->join('niveaux as niv', 'insc.code_niveau', '=', 'niv.code_niveau')
            ->where('niv.nomniveau', 'like', '%Seconde %')
            ->count();
        
        return response()->json(['Status' => 'Succès', 'data' => $totalSeconde]);
    }

    public function countPremiere() {
        $totalPremiere = DB::table('inscrit_academies as insc')
            ->join('niveaux as niv', 'insc.code_niveau', '=', 'niv.code_niveau')
            ->where('niv.nomniveau', 'like', '%Première %')
            ->count();
        
        return response()->json(['Status' => 'Succès', 'data' => $totalPremiere]);
    }

    public function countTerminalA() {
        $totalTerA = DB::table('inscrit_academies as insc')
            ->join('niveaux as niv', 'insc.code_niveau', '=', 'niv.code_niveau')
            ->where('niv.nomniveau', 'like', '%Terminal A%')
            ->count();
        
        return response()->json(['Status' => 'Succès', 'data' => $totalTerA]);
    }
    public function countTerminalC() {
        $totalTerC = DB::table('inscrit_academies as insc')
            ->join('niveaux as niv', 'insc.code_niveau', '=', 'niv.code_niveau')
            ->where('niv.nomniveau', 'like', '%Terminal C%')
            ->count();
        
        return response()->json(['Status' => 'Succès', 'data' => $totalTerC]);
    }
    public function countTerminalD() {
        $totalTerD = DB::table('inscrit_academies as insc')
            ->join('niveaux as niv', 'insc.code_niveau', '=', 'niv.code_niveau')
            ->where('niv.nomniveau', 'like', '%Terminal D%')
            ->count();
        
        return response()->json(['Status' => 'Succès', 'data' => $totalTerD]);
    }

    public function getEffectifsParClasse() 
    {
        $effectifs = DB::table('inscrit_academies as ia')
            ->join('niveaux as niv', 'ia.code_niveau', '=', 'niv.code_niveau')
            ->select(
                'niv.nomniveau as name',
                DB::raw('COUNT(ia.no_inscrit) as value')
            )
            ->groupBy('niv.nomniveau')
            ->orderByDesc('value') 
            ->get();

        $total = $effectifs->sum('value');

        return response()->json([
            'status' => 'succès',
            'effectifs' => $effectifs,
            'total' => $total
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

    public function totalGeneral()
    {
        $total = DB::table('inscriptions')->distinct('no_inscrit')->count('no_incrit');

        return response()->json([
            'Status' => "Succès",
            'data'  => $total
        ]);
        
    }
    
    public function getEffectifsParAnnee()
    {
        $effectifs = DB::table('inscriptions as i')
            ->join('inscrit_academies as ia', 'i.no_inscrit', '=', 'ia.no_inscrit')
            ->select(
                'i.anneesco as annee',
                DB::raw('COUNT(ia.no_inscrit) as total')
            )
            ->groupBy('annee')
            ->orderBy('annee', 'asc')
            ->get();

        return response()->json([
            'Status' => 'Succès',
            'data'   => $effectifs
        ]);
    }

    public function filter(Request $request)
    {
        $nomNiveau = $request->nomniveau;
        $anneeSco = $request->anneesco;

        $eleves = InscriptionAcademie::select(
            'inscrit_academies.no_inscrit',
            'pe.nom', 'pe.prenom', 'pe.sexe',
            'pe.naiss', 'pe.lieunaiss', 'pe.adresse',
            'niv.nomniveau'
        )
        ->join('inscriptions as i', 'inscrit_academies.no_inscrit', '=', 'i.no_inscrit')
        ->join('personnes as pe', 'i.matricule', '=', 'pe.matricule')
        ->join('niveaux as niv', 'inscrit_academies.code_niveau', '=', 'niv.code_niveau')
        ->where('niv.nomniveau', $nomNiveau)
        ->where('i.anneesco', $anneeSco)
        ->get();

        return response()->json([
            'Status'  => 'Succès',
            'Message' => 'Apprenants filtrés',
            'data'    => $eleves
        ]);
    
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            // Personne
            'nom'           => 'required|string|max:255',
            'prenom'        => 'required|string|max:255',
            'naiss'         => 'required|date',
            'lieunaiss'     => 'required|string|max:255',
            'sexe'          => 'required|string|max:10',
            'adresse'       => 'required|string|max:255',
            'cin'           => 'nullable|string|max:20',
            'datedel'       => 'nullable|date',
            'lieucin'       => 'nullable|string|max:255',
            'nompere'       => 'nullable|string|max:100',
            'nommere'       => 'nullable|string|max:100',
            'nomtuteur'     => 'nullable|string|max:100',
            'adressparent'  => 'nullable|string|max:255',
            'adresstuteur'  => 'nullable|string|max:255',
            'phoneparent'   => 'nullable|string|max:20',
            'phonetuteur'   => 'nullable|string|max:20',
            'photo'         => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            // Inscription
            'dateinscrit'   => 'required|date',
            'anneesco'      => 'required|string|max:20',

            // Academique
            'type_inscrit'  => 'required|string|max:50',
            'code_niveau' => 'required|exists:niveaux,code_niveau',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }


        $personne = null;
        $matricule = null;
        try {
            DB::beginTransaction();

            // Vérifier si la personne existe déjà
            $personne = Personne::where('matricule', $request->matricule)->first();
            $annee = date('y');

            if (!$personne) {
                $prefix = 'LYC';
                $dernier = Personne::orderByRaw("CAST(SPLIT_PART(matricule, '/', 3) AS INTEGER) DESC")->first();
                $numero = 1;

                if ($dernier && preg_match('/\/(\d+)$/', $dernier->matricule, $m)) {
                    $numero = ((int)$m[1]) + 1;
                }

                $matricule = "{$annee}/{$prefix}/" . str_pad($numero, 2, '0', STR_PAD_LEFT);


                $personne = new Personne();
                $personne->matricule = $matricule;
                $personne->nom = $request->nom;
                $personne->prenom = $request->prenom;
                $personne->naiss = $request->naiss;
                $personne->lieunaiss = $request->lieunaiss;
                $personne->sexe = $request->sexe;
                $personne->adresse = $request->adresse;
                $personne->cin = $request->cin;
                $personne->datedel = $request->datedel;
                $personne->lieucin = $request->lieucin;
                $personne->nompere = $request->nompere;
                $personne->nommere = $request->nommere;
                $personne->nomtuteur = $request->nomtuteur;
                $personne->adressparent = $request->adressparent;
                $personne->adresstuteur = $request->adresstuteur;
                $personne->phoneparent = $request->phoneparent;
                $personne->phonetuteur = $request->phonetuteur;

                if ($request->hasFile('photo')) {
                    $path = $request->file('photo')->store('personnes', 'public');
                    $personne->photo = $path;
                }

                $personne->save();
            }

            // Ajouter une inscription liée à cette personne
            $inscription = new Inscription();
            $inscription->matricule = $personne->matricule;
            $inscription->anneesco = $request->anneesco;
            $inscription->dateinscrit = $request->dateinscrit;
            $inscription->save();

            // Ajouter l’inscription académique
            $inscritAcad = new InscriptionAcademie();
            $inscritAcad->no_inscrit = $inscription->no_inscrit;
            $inscritAcad->code_niveau = $request->code_niveau;
            $inscritAcad->type_inscrit = $request->type_inscrit;
            $inscritAcad->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => '✅ Inscription académique ajoutée avec succès',
                'data' => [
                    'personne'               => $personne,
                    'inscription'            => $inscription,
                    'inscription_academique' => $inscritAcad
                ]
            ], 201);

        } 
        catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Erreur inscription académique: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => '❌ Erreur lors de l’ajout de l’inscription académique.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $no_inscrit)
    {
        \Log::info('Reçu: ', $request->all());

        $validator = Validator::make($request->all(), [
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'naiss'     => 'required|date',
            'lieunaiss' => 'required|string|max:255',
            'sexe'      => 'required|string|max:10',
            'adresse'   => 'required|string|max:255',
            'cin'       => 'nullable|string|max:20',
            'datedel'   => 'nullable|date',
            'lieucin'   => 'nullable|string|max:255',
            'nompere'   => 'nullable|string|max:100',
            'nommere'   => 'nullable|string|max:100',
            'nomtuteur' => 'nullable|string|max:100',
            'adressparent'  => 'nullable|string|max:255',
            'adresstuteur'  => 'nullable|string|max:255',
            'phoneparent'   => 'nullable|string|max:20',
            'phonetuteur'   => 'nullable|string|max:20',
            'photo'         => 'nullable|image|mimes:jpeg,png,jpg|max:2048',    
            'dateinscrit'   => 'required|date',
            'anneesco'      => 'required|string|max:20',
            'code_niveau'   => 'required|exists:niveaux,code_niveau',
            'type_inscrit'  => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            \Log::warning('Validation échouée:', $validator->errors()->toArray());
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            $inscription = Inscription::where('no_inscrit', $no_inscrit)->firstOrFail();
            $personne = Personne::where('matricule', $inscription->matricule)->firstOrFail();

            // 🔍 Vérification doublon (autre inscription identique)
            $existe = InscriptionAcademie::whereHas('inscription', function($q) use ($inscription, $request) {
                $q->where('matricule', $inscription->matricule)
                ->where('anneesco', $request->anneesco);
            })
            ->where('code_niveau', $request->code_niveau)
            ->where('no_inscrit', '!=', $no_inscrit)
            ->first();

            if ($existe) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cette personne est déjà inscrite dans ce niveau pour cette année.'
                ], 422);
            }

            // 🧑 Mise à jour de la personne
            $personne->fill($request->only([
                'nom','prenom','naiss','lieunaiss','sexe','adresse','cin','datedel','lieucin',
                'nompere','nommere','nomtuteur','adressparent','adresstuteur','phoneparent','phonetuteur'
            ]));

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('personnes', 'public');
                if ($personne->photo && Storage::disk('public')->exists($personne->photo)) {
                    Storage::disk('public')->delete($personne->photo);
                }
                $personne->photo = $path;
            }

            $personne->save();

            // 🧾 Mise à jour inscription
            $inscription->update([
                'anneesco' => $request->anneesco,
                'dateinscrit' => $request->dateinscrit,
            ]);

            // 🎓 Mise à jour inscription académique
            $inscritAcad = InscriptionAcademie::where('no_inscrit', $no_inscrit)->firstOrFail();
            $inscritAcad->update([
                'code_niveau' => $request->code_niveau,
                'type_inscrit' => $request->type_inscrit,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => '✅ Inscription mise à jour avec succès.',
                'data' => compact('personne', 'inscription', 'inscritAcad')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur Update Inscription:', ['message' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => '❌ Erreur lors de la modification de l’inscription académique.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function destroy(string $no_inscrit)
    {
        \Log::info('Suppression demandée pour no_inscrit: '.$no_inscrit);

        DB::beginTransaction();
        try {
            $inscriptionAcad = InscriptionAcademie::where('no_inscrit', $no_inscrit)->first();
            if ($inscriptionAcad) {
                $inscriptionAcad->delete();
            }

            $inscription = Inscription::find($no_inscrit);
            if ($inscription) {
                $inscription->delete();
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Suppression effectuée avec succès'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => '❌ Erreur lors de la suppression de l’inscription académique.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
