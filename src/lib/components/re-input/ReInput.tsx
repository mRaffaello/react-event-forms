import { useContext, useEffect, useState, startTransition, useRef } from 'react';
import { FormContext } from '../re-form';
import { z } from 'zod';

// Value can be undefined when
// 1. Optional property
// 2. Initial form values not provided
export type ReInputRendererProps<R> = {
    value: R;
    property: string;
    defaultValue?: R;
    errors?: z.ZodIssue[];
    onChange: (value: R) => void;
    onBlur: () => void;
};

export type ReInputProps<T, R> = {
    property: T;
    defaultValue?: R;
    renderer: (props: ReInputRendererProps<R>) => JSX.Element;
};

export function ReInput<T, R>(props: ReInputProps<T, R>) {
    // Hooks
    const {
        setDefaultValue,
        setInputValue,
        getFormInputValue,
        getFormErrors,
        subscribeToFormInputErrorsUpdates,
        subscribeToFormForceValueUpdates,
        unsubscribeFromFormInputErrorsUpdates,
        unsubscribeFromFormForceValueUpdates
    } = useContext(FormContext);

    // State
    const [value, setValue] = useState(() => {
        const inputValue = getFormInputValue(props.property as string) as R;
        if (inputValue === undefined) return props.defaultValue as R;
        return inputValue;
    });
    const [errors, setErrors] = useState<z.ZodIssue[]>();

    // References
    const hasBeenBlurredBeforeRef = useRef(false);

    // Methods
    const onChange = (value: R) => {
        const _errors = setInputValue(props.property as string, value);

        startTransition(() => {
            hasBeenBlurredBeforeRef.current && setErrors(_errors);
            setValue(value);
        });
    };

    const onBlur = () => {
        if (!hasBeenBlurredBeforeRef.current) {
            const currentValue = getFormInputValue(props.property as string);
            if (currentValue === '') {
                return;
            }
        }

        hasBeenBlurredBeforeRef.current = true;

        const formErrors = getFormErrors();
        const inputErrors = formErrors?.filter(fe => fe.path.join('.') === props.property);

        setErrors(inputErrors);
    };

    // TODO: this is wrong when called after a form validation
    const onFormInputErrorsUpdate = (inputKey: string, errors?: z.ZodIssue[], force?: boolean) => {
        // Avoid listening for this input updates if is not forced
        if (inputKey === props.property && !force) return;

        // If force has been specified, remove blur constrain
        if (force) hasBeenBlurredBeforeRef.current = true;

        // Avoid listening if has not been blurred
        if (!hasBeenBlurredBeforeRef.current) return;

        // Update errors
        const inputErrors = errors?.filter(fe => fe.path.join('.') === props.property);

        setErrors(inputErrors);
    };

    const onForceValueUpdate = () => {
        setValue(getFormInputValue(props.property as string));
    };

    // Effects
    useEffect(() => {
        if (props.defaultValue !== undefined) {
            setDefaultValue(props.property as string, value);
        }

        subscribeToFormInputErrorsUpdates(onFormInputErrorsUpdate);
        subscribeToFormForceValueUpdates(onForceValueUpdate);

        return () => {
            unsubscribeFromFormInputErrorsUpdates(onFormInputErrorsUpdate);
            unsubscribeFromFormForceValueUpdates(onForceValueUpdate);
        };
    }, []);

    // Render
    return (
        <props.renderer
            property={props.property as string}
            value={value}
            errors={errors}
            defaultValue={props.defaultValue}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}
