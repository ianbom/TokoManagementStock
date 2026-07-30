<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'sort' => ['nullable', 'string', 'max:50', 'alpha_dash'],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /** @return array{search: string, sort: string, direction: 'asc'|'desc'} */
    public function filters(string $defaultSort = 'created_at'): array
    {
        return [
            'search' => trim((string) $this->validated('search', '')),
            'sort' => (string) $this->validated('sort', $defaultSort),
            'direction' => $this->validated('direction') === 'asc' ? 'asc' : 'desc',
        ];
    }
}
