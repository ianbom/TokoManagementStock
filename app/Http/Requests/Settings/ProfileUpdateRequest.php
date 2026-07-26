<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $emailRules = $this->emailRules($this->user()->id);
        $emailRules[0] = 'sometimes';

        return [
            'name' => $this->nameRules(),
            'email' => $emailRules,
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
            'current_password' => ['nullable', 'required_with:password', 'string', 'current_password'],
        ];
    }
}
