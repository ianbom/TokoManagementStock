<?php

namespace App\Services\Admin;

abstract class AdminService
{
    /** @return array{value: int|float, change: float|null} */
    protected function metric(int|float $value, int|float $previous): array
    {
        return [
            'value' => $value,
            'change' => $previous == 0
                ? null
                : round((($value - $previous) / $previous) * 100, 1),
        ];
    }
}
