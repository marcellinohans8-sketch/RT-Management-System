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
    Schema::create('payments', function (Blueprint $table) {

        $table->id();

        $table->foreignId('resident_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->unsignedTinyInteger('month');

        $table->year('year');

        $table->decimal('security_fee',10,2);

        $table->decimal('cleaning_fee',10,2);

        $table->decimal('total',10,2);

        $table->enum('status',[
            'paid',
            'unpaid'
        ])->default('unpaid');

        $table->date('paid_at')->nullable();

        $table->timestamps();

        $table->unique([
            'resident_id',
            'month',
            'year'
        ]);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};