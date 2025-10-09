<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\InscriptionCompleteController;
use App\Http\Controllers\ParcoursController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/inscriptions/formation/{nomformation}', [InscriptionCompleteController::class, 'getByFormation']);

// Parcours
Route::get('/parcours', [ParcoursController::class, 'index']);

Route::get('/inscriptionComplete', [InscriptionCompleteController::class, 'index']);
Route::post('/inscriptionComplete', [InscriptionCompleteController::class, 'store']);
Route::match(['put', 'patch'], '/inscriptionComplete/{matricule}', [InscriptionCompleteController::class, 'update']);
Route::delete('/inscriptionComplete/{matricule}', [InscriptionCompleteController::class, 'destroy']);

// Authenticated routes
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('students', StudentController::class);
});
