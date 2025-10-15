<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\InscriptionCompleteController;
use App\Http\Controllers\ParcoursController;
use App\Http\Controllers\ControllerNiveau;
use App\Http\Controllers\ControllerFrais;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/inscriptions/formation/{nomformation}', [InscriptionCompleteController::class, 'getByFormation']);
Route::get('/inscriptions/count', [InscriptionCompleteController::class, 'countinscription']);
Route::get('/inscriptions/musique', [InscriptionCompleteController::class, 'countMusique']);
Route::get('/inscriptions/info', [InscriptionCompleteController::class, 'countInformatique']);
Route::get('/inscriptions/coupe', [InscriptionCompleteController::class, 'countCoupeEtCouture']);
Route::get('/inscriptions/langues', [InscriptionCompleteController::class, 'countLangues']);
Route::get('/inscriptions/patisserie', [InscriptionCompleteController::class, 'countPatisserie']);
Route::get('/inscriptions/topParcours', [InscriptionCompleteController::class, 'topParcours']);

//Niveau 
Route::get('/niveau', [ControllerNiveau::class, 'index']);
Route::post('/niveaux', [ControllerNiveau::class, 'store']);
Route::put('/updateNiveaux/{code_niveau}', [ControllerNiveau::class, 'update']);
Route::delete('/deleteNiveaux/{code_niveau}', [ControllerNiveau::class, 'destroy']);

// Parcours
Route::get('/parcours', [ParcoursController::class, 'index']);
Route::post('/addParcours', [ParcoursController::class, 'store']);
Route::put('/updateParcours/{code_formation}', [ParcoursController::class, 'update']);
Route::delete('/deleteParcours/{code_formation}', [ParcoursController::class, 'destroy']);

//Frais
Route::get('/frais', [ControllerFrais::class, 'index']);
Route::post('/addfrais', [ControllerFrais::class, 'store']);
Route::put('/updateFrais/{idfrais}', [ControllerFrais::class, 'update']);
Route::delete('/deleteFrais/{idfrais}', [ControllerFrais::class, 'destroy']);

Route::get('/inscriptionComplete', [InscriptionCompleteController::class, 'index']);
Route::post('/inscriptionComplete', [InscriptionCompleteController::class, 'store']);
Route::match(['put', 'patch'], '/inscriptionComplete/{matricule}', [InscriptionCompleteController::class, 'update']);
Route::delete('/inscriptionComplete/{matricule}', [InscriptionCompleteController::class, 'destroy']);

// Authenticated routes
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('students', StudentController::class);
});
