<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('yachts', function (Blueprint $table) {
            $table->string('manufacturer')->after('title')->nullable();
            $table->string('model')->after('manufacturer')->nullable();
            $table->integer('year')->after('model')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('yachts', function (Blueprint $table) {
            $table->dropColumn(['manufacturer', 'model', 'year']);
        });
    }
};
