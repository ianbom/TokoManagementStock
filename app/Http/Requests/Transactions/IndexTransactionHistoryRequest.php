<?php

namespace App\Http\Requests\Transactions;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexTransactionHistoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business_id !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::in(['all', 'in', 'out', 'supplier'])],
            'period' => ['nullable', Rule::in(['today', 'week', 'month'])],
            'sort' => ['nullable', Rule::in(['latest', 'oldest'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
