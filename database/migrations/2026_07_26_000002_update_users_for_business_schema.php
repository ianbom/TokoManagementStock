<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $hasLegacyRole = Schema::hasColumn('users', 'role');

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('business_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->enum('role_dbml', ['admin', 'store', 'supplier'])->default('store')->after('password');
            $table->softDeletes();
        });

        if ($hasLegacyRole) {
            DB::table('users')->where('role', 'admin')->update(['role_dbml' => 'admin']);
            DB::table('users')->where('role', 'supplier')->update(['role_dbml' => 'supplier']);

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('role_dbml', 'role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role_legacy', ['admin', 'toko', 'supplier'])->default('toko');
        });

        DB::table('users')->where('role', 'admin')->update(['role_legacy' => 'admin']);
        DB::table('users')->where('role', 'supplier')->update(['role_legacy' => 'supplier']);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('role_legacy', 'role');
            $table->dropConstrainedForeignId('business_id');
            $table->dropSoftDeletes();
        });
    }
};
