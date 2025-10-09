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
use Illuminate\Database\Eloquent\ModelNotFoundException;


class InscriptionCompleteController extends Controller
{
    public function index()
    {
        // ✅ Charger toutes les relations nécessaires en une seule requête
        $inscriptions = Inscription::with(['personne', 'inscriptionformations', 'parcours'])
            ->get();
            // ->each(function ($inscription) {
            //     // Nettoyer localement les matricules au cas où (trim + uppercase)
            //     $inscription->matricule = strtoupper(trim($inscription->matricule));
            // });

        return response()->json($inscriptions);

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


    public function store(Request $request)
    {
        try {
            // 1️⃣ Personne
            \Log::info('Requete reçue : ', $request->all());

            $personne = Personne::create([
                'nom'          => $request->nom,
                'prenom'       => $request->prenom,
                'naiss'        => $request->naiss,
                'sexe'         => $request->sexe,
                'adresse'      => $request->adresse,
                'cin'          => $request->cin,
                'nompere'      => $request->nompere,
                'nommere'      => $request->nommere,
                'nomtuteur'    => $request->nomtuteur,
                'adressparent' => $request->adressparent,
                'adresstuteur' => $request->adresstuteur,
                'phoneparent'  => $request->phoneparent,
                'phonetuteur'  => $request->phonetuteur,
            ]);

            // Photo
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos', 'public');
                $personne->photo = $path;
                $personne->save();
            }

            // 2️⃣ Inscription
            $inscription = Inscription::create([
                'matricule'   => $personne->matricule,
                'dateinscrit' => $request->dateinscrit,
                'anneesco'    => $request->anneesco,
            ]);

            // 3️⃣ Formation / Parcours
            $formation = FormationModel::create([
                'no_inscrit'     => $inscription->no_inscrit,
                'duree'          => $request->duree,
                'type_formation' => $request->type_formation,
            ]);


            // 4️⃣ Parcours
            $parcours = null;

            if ($request->code_formation) {
                // Utiliser un parcours existant
                $parcours = Parcours::find($request->code_formation);
            } 
            elseif ($request->nomformation) {
                // Générer un code aléatoire unique de 5 caractères
                $newCode = strtoupper(substr($request->nomformation, 0, 3)) . rand(10, 99);

                $parcours = Parcours::create([
                    'code_formation' => $newCode,
                    'nomformation'   => $request->nomformation,
                    'datedebut'      => $request->datedebut,
                ]);
            }

            $suivre = Suivre::create([
                'no_inscrit'     => $inscription->no_inscrit,
                'code_formation' => $parcours->code_formation,
            ]);

            return response()->json([
                'message'     => 'Inscription complète réussie',
                'personne'    => $personne,
                'inscription' => $inscription,
                'formation'   => $formation,
                'parcours'    => $parcours,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
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
            // 🔹 1. Récupérer les enregistrements existants
            \Log::info('Requete reçue : ', $request->all());
            
            $personne = Personne::where('matricule', $matricule)->firstOrFail();
            $inscription = Inscription::where('matricule', $matricule)->firstOrFail();

            // 🔹 2. Validation
            $request->validate([
                'datedebut' => 'required|date',
                'nomformation' => 'required|array|min:1',
                'nomformation.*' => 'string',
            ]);

            $datedebut = $request->input('datedebut');
            $nomFormations = $request->input('nomformation', []);

            // 🔹 3. Mise à jour des infos de la personne
            $personne->fill($request->only([
                'nom', 'prenom', 'naiss', 'sexe', 'adresse', 'cin',
                'nompere', 'nommere', 'nomtuteur', 'adressparent',
                'adresstuteur', 'phoneparent', 'phonetuteur'
            ]));

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos', 'public');
                $personne->photo = $path;
            }

            $personne->save();

            // 🔹 4. Mise à jour des infos d’inscription
            $inscription->update($request->only(['dateinscrit', 'anneesco']));

            // 🔹 5. Détection du modèle formation utilisé
            $formationClass = null;
            if (class_exists(\App\Models\FormationModel::class)) {
                $formationClass = \App\Models\FormationModel::class;
            } elseif (class_exists(\App\Models\InscriptionFormation::class)) {
                $formationClass = \App\Models\InscriptionFormation::class;
            }

            if ($formationClass) {
                $formation = $formationClass::where('no_inscrit', $inscription->no_inscrit)->first();
                if ($formation) {
                    $formation->update([
                        'duree' => $request->input('duree', $formation->duree),
                        'type_formation' => $request->input('type_formation', $formation->type_formation),
                    ]);
                }
            }

            // 🔹 6. Supprimer les anciens liens Suivre et Parcours
            $suivres = Suivre::where('no_inscrit', $inscription->no_inscrit)->get();
            $codes = $suivres->pluck('code_formation');

            Suivre::where('no_inscrit', $inscription->no_inscrit)->delete();
            if ($codes->count() > 0) {
                Parcours::whereIn('code_formation', $codes)->delete();
            }

            // 🔹 7. Créer les nouveaux Parcours et liens Suivre
            foreach ($nomFormations as $nomFormation) {
                $parcours = Parcours::create([
                    'nomformation' => $nomFormation,
                    'datedebut' => $datedebut,
                ]);

                Suivre::create([
                    'no_inscrit' => $inscription->no_inscrit,
                    'code_formation' => $parcours->code_formation,
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Modification réussie ✅'], 200);
        } 
        catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'message' => "Données introuvables pour matricule $matricule",
                'error' => $e->getMessage(),
            ], 404);
        } 
        catch (\Exception $e) {
            DB::rollBack();

            // journalisation détaillée
            \Log::error("Erreur serveur update inscription (Matricule: $matricule): " . $e->getMessage());

            $response = ['message' => 'Erreur interne du serveur lors de la modification ❌'];
            if (config('app.debug')) {
                $response['error_detail'] = $e->getMessage();
                $response['file'] = $e->getFile();
                $response['line'] = $e->getLine();
            }

            return response()->json($response, 500);
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

