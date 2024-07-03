import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ReForm, ReButton, ReSubscribe, ReFormProps, ZodDefinition } from '../components';
import { ReactNode, useMemo } from 'react';
import { DeepPartial, ExtractFieldType, NestedKeyOf } from '../types/structs';

export function useForm<T extends ZodType<any, any, any>>(validator: T, initialValue?: z.infer<T>) {
    type InferredType = z.infer<T>;

    // Memos
    const Context = useMemo(
        () => (props: Omit<ReFormProps<InferredType>, 'validator' | 'initialValue'>) => (
            <ReForm
                {...props}
                validator={validator as unknown as ZodDefinition}
                initialValue={initialValue}
            />
        ),
        []
    );

    const Field = useMemo(
        () =>
            <Property extends NestedKeyOf<InferredType>>(
                props: ReInputProps<Property, ExtractFieldType<InferredType, Property>>
            ) => <ReInput {...props} />,
        []
    );

    const SafeField = useMemo(
        () =>
            <Property extends NestedKeyOf<InferredType>>(
                props: ReInputProps<Property, NonNullable<ExtractFieldType<InferredType, Property>>>
            ) => <ReInput {...props} />,
        []
    );

    const Subscribe = useMemo(
        () =>
            <R,>(props: {
                selector: (value: DeepPartial<InferredType> | undefined) => R;
                children: (subscribedValue: R) => ReactNode;
            }) => <ReSubscribe<InferredType, R> {...props} />,
        []
    );

    console.log('JDOISJDOISAJOIDSAJOIDSJAOI');
    return {
        context: Context,
        field: Field,
        safeField: SafeField,
        subscribe: Subscribe,
        button: ReButton
    };
}
