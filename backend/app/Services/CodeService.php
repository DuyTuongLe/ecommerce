<?php

namespace App\Services;

use Illuminate\Support\Str;

class CodeService
{
    public static function generate(

        string $text,

        string $modelClass,

        string $column = 'code',

        ?int $exceptId = null

    ): string {

        $baseCode = Str::slug($text);

        if (empty($baseCode)) {

            $baseCode = 'n-a';
        }

        $code = $baseCode;

        $counter = 1;

        while (

            $modelClass::query()

                ->where(
                    $column,
                    $code
                )

                ->when(

                    $exceptId,

                    function ($query)
                    use ($exceptId) {

                        $query->where(
                            'id',
                            '!=',
                            $exceptId
                        );
                    }

                )

                ->exists()

        ) {

            $code =
                $baseCode .
                '-' .
                $counter;

            $counter++;
        }

        return $code;
    }
}