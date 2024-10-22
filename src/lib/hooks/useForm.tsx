import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ReForm, ReButton, ReSubscribe, ReFormProps, ZodDefinition } from '../components';
import { ReactNode, useCallback, useMemo, useRef } from 'react';
import { DeepPartial, ExtractFieldType, NestedKeyOf } from '../types/structs';
import { generateRandomString } from '../utils/random';
import { APP_EVENT } from '../types/events';
import { eventEmitter } from '../utils/events';
import { getPropertyValueByDottedPath } from '../utils/objects';

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
            ) => (
                <ReInput
                    {...props}
                    validationBehaviour={
                        getPropertyValueByDottedPath(initialValue, props.property)
                            ? 'immediate'
                            : props.validationBehaviour
                    }
                />
            ),
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

    // Action copied from useFormAction. Typescript inference was causing problem with nested hooks
    const setFormValue = useCallback((value: InferredType, reset = true) => {
        eventEmitter.emit(APP_EVENT.SET_FORM_VALUE, id, value, reset);
    }, []);

    // Action copied from useFormAction. Typescript inference was causing problem with nested hooks
    const submitForm = useCallback(() => {
        eventEmitter.emit(APP_EVENT.SUBMIT_FORM, id);
    }, []);

    return {
        setFormValue,
        submitForm,
        context: Context,
        field: Field,
        subscribe: Subscribe,
        button: ReButton
    };
}
