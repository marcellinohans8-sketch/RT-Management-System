<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('house_id')
                ->nullable()
                ->after('resident_id')
                ->constrained()
                ->nullOnDelete();

            $table->enum('period_type', ['monthly', 'annual'])
                ->default('monthly')
                ->after('year');

            $table->unsignedTinyInteger('period_start_month')
                ->default(1)
                ->after('period_type');

            $table->unsignedTinyInteger('period_end_month')
                ->default(1)
                ->after('period_start_month');

            $table->text('notes')->nullable()->after('paid_at');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['house_id']);
            $table->dropColumn([
                'house_id',
                'period_type',
                'period_start_month',
                'period_end_month',
                'notes',
            ]);
        });
    }
};
