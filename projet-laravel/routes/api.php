<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\InscriptionCompleteController;
use App\Http\Controllers\ParcoursController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Personne (CRUD minimal)
Route::get('/personnes', [StudentController::class, 'index']);
Route::post('/personnes', [StudentController::class, 'store']);

// Parcours
Route::get('/parcours', [ParcoursController::class, 'index']);

// Inscription simple
Route::post('/inscription', [InscriptionController::class, 'store']);

// Inscription complète (liste, store, update, delete)
Route::get('/inscriptionComplete', [InscriptionCompleteController::class, 'index']);
Route::post('/inscriptionComplete', [InscriptionCompleteController::class, 'store']);

// Accept both PUT and PATCH for the update (React sends _method=PATCH)
Route::match(['put', 'patch'], '/inscriptionComplete/{matricule}', [InscriptionCompleteController::class, 'update']);
Route::delete('/inscriptionComplete/{matricule}', [InscriptionCompleteController::class, 'destroy']);

// Authenticated routes
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('students', StudentController::class);
});
