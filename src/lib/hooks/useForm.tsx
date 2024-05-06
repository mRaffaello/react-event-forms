import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ReForm, ReButton, ReSubscribe, ReFormProps, ZodDefinition } from '../components';
import { ReactNode } from 'react';
import { DeepPartial, ExtractFieldType, NestedKeyOf } from '../types/structs';

// Todo: memoize result
export function useForm<T extends ZodType<any, any, any>>(validator: T, initialValue?: z.infer<T>) {
    type InferredType = z.infer<T>;

    return {
        context: (props: Omit<ReFormProps<InferredType>, 'validator' | 'initialValue'>) => (
            <ReForm
                {...props}
                validator={validator as unknown as ZodDefinition}
                initialValue={initialValue}
            />
        ),
        field: <Property extends NestedKeyOf<InferredType>>(
            props: ReInputProps<Property, ExtractFieldType<InferredType, Property>>
        ) => <ReInput {...props} />,
        safeField: <Property extends NestedKeyOf<InferredType>>(
            props: ReInputProps<Property, NonNullable<ExtractFieldType<InferredType, Property>>>
        ) => <ReInput {...props} />,
        subscribe: <R,>(props: {
            selector: (value: DeepPartial<InferredType> | undefined) => R;
            children: (subscribedValue: R) => ReactNode;
        }) => <ReSubscribe<InferredType, R> {...props} />,
        button: ReButton
    };
}
