<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->text('message')->nullable()->change();
            $table->text('media')->nullable()->after('message');
            $table->enum('media_type', ['image', 'video'])->nullable()->after('media');
        });
    }

    public function down(): void
    {
        DB::table('messages')->whereNull('message')->update(['message' => '']);

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['media', 'media_type']);
            $table->text('message')->nullable(false)->change();
        });
    }
};
