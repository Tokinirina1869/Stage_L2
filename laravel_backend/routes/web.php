<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test-db', function() {
    try {
        DB::connection()->getPdo();
        return 'Connecté: ' . DB::connection()->getDatabaseName();
    }
    catch(\Exception $e) {
        return 'Erreur de connexion :' .$e->getMessage();
    }
});

Route::get('/', function() {
    return view("welcome");
});
