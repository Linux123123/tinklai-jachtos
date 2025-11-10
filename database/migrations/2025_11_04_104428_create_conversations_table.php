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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_one_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('participant_two_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Indexes
            $table->index('participant_one_id');
            $table->index('participant_two_id');
            // Ensure unique conversation between two users
            $table->unique(['participant_one_id', 'participant_two_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
