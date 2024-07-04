import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ReForm, ReButton, ReSubscribe, ReFormProps, ZodDefinition } from '../components';
import { ReactNode, useMemo, useRef } from 'react';
import { DeepPartial, ExtractFieldType, NestedKeyOf } from '../types/structs';
import { generateRandomString } from '../utils/random';
import useFormActions from './useFormActions';

export function useForm<T extends ZodType<any, any, any>>(validator: T, initialValue?: z.infer<T>) {
    // References
    const formIdRef = useRef(generateRandomString(10));

    return _useForm(formIdRef.current, validator, initialValue);
}

export function useFormWithId<T extends ZodType<any, any, any>>(
    id: string,
    validator: T,
    initialValue?: z.infer<T>
) {
    return _useForm(id, validator, initialValue);
}

function _useForm<T extends ZodType<any, any, any>>(
    id: string,
    validator: T,
    initialValue?: z.infer<T>
) {
    type InferredType = z.infer<T>;

    // Hooks
    const actions = useFormActions(id);

    // Memos
    const Context = useMemo(
        () => (props: Omit<ReFormProps<InferredType>, 'id' | 'validator' | 'initialValue'>) => (
            <ReForm
                {...props}
                id={id}
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

    const Subscribe = useMemo(
        () =>
            <R,>(props: {
                selector: (value: DeepPartial<InferredType> | undefined) => R;
                children: (subscribedValue: R) => ReactNode;
            }) => <ReSubscribe<InferredType, R> {...props} />,
        []
    );

    return {
        ...actions,
        context: Context,
        field: Field,
        subscribe: Subscribe,
        button: ReButton
    };
}
