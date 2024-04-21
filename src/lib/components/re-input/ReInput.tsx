import { useContext, useEffect, useState, startTransition, useRef } from 'react';
import { FormContext } from '../re-form';
import { z } from 'zod';

export type ReInputRendererProps = {
    value: any;
    property: string;
    errors?: z.ZodIssue[];
    onChange: (value: string) => void;
    onBlur: () => void;
};

type ReInputProps<T> = {
    property: T;
    renderer: (props: ReInputRendererProps) => JSX.Element;
};

export function ReInput<T>(props: ReInputProps<T>) {
    // Hooks
    const {
        setInputValue,
        getFormInputValue,
        getFormErrors,
        subscribeToFormInputErrorsUpdates,
        subscribeToFormForceValueUpdates,
        unsubscribeFromFormInputErrorsUpdates,
        unsubscribeFromFormForceValueUpdates
    } = useContext(FormContext);

    // State
    const [value, setValue] = useState(getFormInputValue(props.property as string));
    const [errors, setErrors] = useState<z.ZodIssue[]>();

    // References
    const hasBeenBlurredBeforeRef = useRef(false);

    // Methods
    const onChange = (value: string) => {
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
        const inputErrors = formErrors?.filter(fe => fe.path[0] === props.property);

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
        const inputErrors = errors?.filter(fe => fe.path[0] === props.property);

        setErrors(inputErrors);
    };

    const onForceValueUpdate = () => {
        setValue(getFormInputValue(props.property as string));
    };

    // Effects
    useEffect(() => {
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
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}
