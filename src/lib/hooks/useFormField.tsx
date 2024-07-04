import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ExtractFieldType, NestedKeyOf } from '../types/structs';
import { useMemo } from 'react';

export function useFormField<T extends ZodType<any, any, any>>() {
    type InferredType = z.infer<T>;

    const Field = useMemo(
        () =>
            <Property extends NestedKeyOf<InferredType>>(
                props: ReInputProps<Property, ExtractFieldType<InferredType, Property>>
            ) => <ReInput {...props} />,
        []
    );

    return {
        field: Field
    };
}
