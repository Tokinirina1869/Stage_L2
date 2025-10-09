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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id('no_inscrit');
            $table->char('matricule',7);
            $table->date('dateinscrit');
            $table->string('anneesco',20);
            $table->timestamps();

            $table->foreign('matricule')->references('matricule')->on('personnes');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
