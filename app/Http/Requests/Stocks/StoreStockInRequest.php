<?php

namespace App\Http\Requests\Stocks;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreStockInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->business_id !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'string', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
        ];
    }

    /** @return array<callable> */
    public function after(): array
    {
        return [function (Validator $validator): void {
            $draft = $this->session()->get('stock_in.draft', []);
            $draftIds = [];

            if (is_array($draft)) {
                foreach ($draft as $item) {
                    if (is_array($item) && isset($item['id'])) {
                        $draftIds[] = (string) $item['id'];
                    }
                }
            }

            $submittedItems = $this->input('items', []);

            if (! is_array($submittedItems)) {
                return;
            }

            foreach ($submittedItems as $index => $item) {
                if (! is_array($item)) {
                    continue;
                }

                if (! in_array($item['id'] ?? null, $draftIds, true)) {
                    $validator->errors()->add("items.{$index}.id", 'Produk draft tidak valid.');
                }
            }
        }];
    }
}
