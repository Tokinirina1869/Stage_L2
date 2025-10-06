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
            $table->string('matricule', 5)->primary();
            $table->string('nom', 32)->nullable();
            $table->string('prenom', 32)->nullable();
            $table->date('naiss')->nullable();
            $table->string('sexe', 8)->nullable();
            $table->string('adresse', 32)->nullable();
            $table->string('photo')->nullable();
            $table->string('cin', 12)->nullable();
            $table->string('nompere', 32)->nullable();
            $table->string('nommere', 32)->nullable();
            $table->string('nomtuteur', 32)->nullable();
            $table->string('adressparent', 32)->nullable();
            $table->string('adresstuteur', 32)->nullable();
            $table->string('phoneparent', 10)->nullable();
            $table->string('phonetuteur', 10)->nullable();
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
