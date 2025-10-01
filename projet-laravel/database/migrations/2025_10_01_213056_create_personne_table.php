<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personnes', function (Blueprint $table) {
            $table->char('matricule', 5)->primary();
            $table->char('nom', 32)->nullable();
            $table->char('prenom', 32)->nullable();
            $table->date('naiss')->nullable();
            $table->char('sexe', 8)->nullable();
            $table->char('adresse', 32)->nullable();
            $table->char('photo')->nullable();
            $table->char('cin', 12)->nullable();
            $table->char('nompere', 32)->nullable();
            $table->char('nommere', 32)->nullable();
            $table->char('nomtuteur', 32)->nullable();
            $table->char('adressparent', 32)->nullable();
            $table->char('adresstuteur', 32)->nullable();
            $table->char('phoneparent', 10)->nullable();
            $table->char('phonetuteur', 10)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnes');
    }
};
