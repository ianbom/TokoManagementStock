<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'account_type' => ['required', Rule::in(['store', 'supplier'])],
            'business_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:1000'],
            'owner_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'business_category' => ['required', 'string', 'max:255'],
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $business = Business::create([
                'code' => (string) Str::uuid(),
                'name' => $input['business_name'],
                'business_type' => $input['account_type'],
                'owner_name' => $input['owner_name'],
                'address' => $input['address'],
                'phone' => $input['phone'],
                'business_category' => $input['business_category'],
            ]);

            $prefix = $input['account_type'] === 'supplier' ? 'SUP' : 'TOKO';

            $business->forceFill([
                'code' => $prefix.'-'.str_pad((string) $business->id, 4, '0', STR_PAD_LEFT),
            ])->save();

            return $business->users()->create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => $input['account_type'],
            ]);
        });
    }
}
