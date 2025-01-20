import { useContext, useEffect, useState, startTransition, useRef } from 'react';
import { FormContext } from '../re-form';
import { z } from 'zod';
import { ValidationBehaviour } from './types';

// Value can be undefined when
// 1. Optional property
// 2. Initial form values not provided
export type ReInputRendererProps<R> = {
    property: string;
    value?: R;
    defaultValue?: R;
    errors?: z.ZodIssue[];
    onChange: (value: R | undefined) => void;
    onBlur: () => void;
};

export type ReInputProps<T, R> = {
    property: T;
    validationBehaviour?: ValidationBehaviour;
    defaultValue?: R;
    renderer: (props: ReInputRendererProps<R>) => JSX.Element;
};

// Todo: add on submit validation
// Todo: should update validation error only on submit
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
        unsubscribeFromFormForceValueUpdates,
        getFormHasChanged
    } = useContext(FormContext);

    // State
    const [value, setValue] = useState<R | undefined>(() => {
        const inputValue = getFormInputValue(props.property as string) as R;
        if (inputValue === undefined) return props.defaultValue as R;
        return inputValue;
    });
    const [errors, setErrors] = useState<z.ZodIssue[]>();

    // References
    const hasBeenBlurredBeforeRef = useRef(false);

    // Methods
    const onChange = (value: R | undefined) => {
        const _errors = setInputValue(props.property as string, value);

        if (typeof document !== 'undefined') {
            startTransition(() => {
                // Immediate validation behaviour should show errors upon first value change
                if (props.validationBehaviour === 'immediate')
                    hasBeenBlurredBeforeRef.current = true;

                // Show errors if necessary
                if (hasBeenBlurredBeforeRef.current && props.validationBehaviour !== 'onSubmit') {
                    setErrors(_errors);
                }

                // Check if the form's value has changed
                getFormHasChanged();

                setValue(value);
            });
        } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
            // Immediate validation behaviour should show errors upon first value change
            if (props.validationBehaviour === 'immediate') hasBeenBlurredBeforeRef.current = true;

            // Show errors if necessary
            if (hasBeenBlurredBeforeRef.current && props.validationBehaviour !== 'onSubmit') {
                setErrors(_errors);
            }

            // Check if the form's value has changed
            getFormHasChanged();

            setValue(value);
        }
    };

    const onBlur = () => {
        if (!hasBeenBlurredBeforeRef.current) {
            const currentValue = getFormInputValue(props.property as string);

            if (currentValue === '' || currentValue === undefined) {
                return;
            }
        }

        hasBeenBlurredBeforeRef.current = true;

        const formErrors = getFormErrors();
        const inputErrors = formErrors?.filter(fe => fe.path.join('.') === props.property);

        if (props.validationBehaviour !== 'onSubmit') {
            setErrors(inputErrors);
        }
    };

    // TODO: this is wrong when called after a form validation
    const onFormInputErrorsUpdate = (inputKey?: string, errors?: z.ZodIssue[], force?: boolean) => {
        // Avoid listening for this input updates if is not forced
        if (inputKey === props.property && !force) return;

        // If force has been specified, remove blur constrain
        if (force) hasBeenBlurredBeforeRef.current = true;

        // Avoid listening if it has not been blurred
        if (!hasBeenBlurredBeforeRef.current) return;

        // Update errors
        const inputErrors = errors?.filter(fe => fe.path.join('.') === props.property);

        if (force && props.validationBehaviour === 'onSubmit') setErrors(inputErrors);
        else if (props.validationBehaviour !== 'onSubmit') setErrors(inputErrors);
    };

    const onForceValueUpdate = (updatedKeys?: string[]) => {
        if (!updatedKeys || updatedKeys.includes(props.property as string))
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
