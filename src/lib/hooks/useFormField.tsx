import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ExtractFieldType, NestedKeyOf } from '../types/structs';

export function useFormField<T extends ZodType<any, any, any>>() {
    type InferedType = z.infer<T>;
    return {
        field: <Property extends NestedKeyOf<InferedType>>(
            props: ReInputProps<Property, ExtractFieldType<InferedType, Property>>
        ) => <ReInput {...props} />,
        safeField: <Property extends NestedKeyOf<InferedType>>(
            props: ReInputProps<Property, NonNullable<ExtractFieldType<InferedType, Property>>>
        ) => <ReInput {...props} />
    };
}
