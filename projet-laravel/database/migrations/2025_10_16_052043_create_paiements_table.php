<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->string('no_paie',7)->primary();
            $table->string('idfrais', 7);
            $table->unsignedBigInteger('no_inscrit');
            $table->char('matricule', 7);
            $table->date('datepaie');
            $table->string('modepaie', 50);
            $table->integer('montantpaie');
            $table->timestamps();

            $table->foreign('matricule')->references('matricule')->on('personnes')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('no_inscrit')->references('no_inscrit')->on('inscriptions')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('idfrais')->references('idfrais')->on('frais')->onDelete('restrict')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
