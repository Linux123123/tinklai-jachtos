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
        Schema::create('yachts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('type'); // e.g., 'Sailing', 'Motor'
            $table->unsignedInteger('capacity');
            $table->string('location');
            $table->enum('status', ['available', 'unavailable', 'under_maintenance'])->default('available');
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('location');
            $table->index('type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('yachts');
    }
};
