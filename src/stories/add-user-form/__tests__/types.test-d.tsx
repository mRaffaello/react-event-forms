import { renderHook } from '@testing-library/react';
import { assertType, expectTypeOf, it } from 'vitest';
import { useForm } from '../../../lib';
import { z } from 'zod';
import { ExtractFieldType, NestedKeyOf } from '../../../lib/types/structs';

export const TestSchema = z.object({
    email: z.string().email(),
    enabled: z.boolean(),
    role: z.enum(['ADMIN', 'VIEWER']),
    anagraphic: z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        age: z.number().min(0)
    })
});
type InferedType = z.infer<typeof TestSchema>;
type ExpectedNestedKeyOfResult =
    | 'email'
    | 'enabled'
    | 'role'
    | 'anagraphic'
    | 'anagraphic.firstName'
    | 'anagraphic.lastName'
    | 'anagraphic.age';

// Todo: this expect types are not working on test
it('Should type useForm hook correctly', () => {
    const { result } = renderHook(() => useForm(TestSchema));

    // Check that nested type inference is correct
    expectTypeOf<NestedKeyOf<InferedType>>().toEqualTypeOf<ExpectedNestedKeyOfResult>();

    // Validate field type extraction
    expectTypeOf<ExtractFieldType<InferedType, 'email'>>().toEqualTypeOf<string>();
    expectTypeOf<ExtractFieldType<InferedType, 'enabled'>>().toEqualTypeOf<boolean>();
    expectTypeOf<ExtractFieldType<InferedType, 'role'>>().toEqualTypeOf<'ADMIN' | 'VIEWER'>();
    expectTypeOf<ExtractFieldType<InferedType, 'anagraphic.firstName'>>().toEqualTypeOf<string>();
    expectTypeOf<ExtractFieldType<InferedType, 'anagraphic.lastName'>>().toEqualTypeOf<string>();
    expectTypeOf<ExtractFieldType<InferedType, 'anagraphic.age'>>().toEqualTypeOf<number>();
    expectTypeOf<ExtractFieldType<InferedType, 'anagraphic'>>().toEqualTypeOf<{
        firstName: string;
        lastName: string;
        age: number;
    }>();

    // Check form.context types
    // Todo

    // Check form.field types
    expectTypeOf(result.current.field)
        .parameter(0)
        .toHaveProperty('property')
        .toEqualTypeOf<ExpectedNestedKeyOfResult>();

    // Check form.subscribe types
    // Todo

    // Check form.button types
    // Todo
});
