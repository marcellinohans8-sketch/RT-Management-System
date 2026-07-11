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
    Schema::create('residents', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        $table->string('ktp_number')->unique();
        $table->enum('resident_status', [
            'permanent',
            'contract'
        ]);
        $table->string('phone_number');
        $table->boolean('is_married')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};