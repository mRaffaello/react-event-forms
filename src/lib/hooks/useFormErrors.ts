import { useContext, useEffect, useState } from 'react';
import { FormContext } from '../components';
import { ZodIssue } from 'zod';

export function useFormErrors() {
    // Hooks
    const {
        getFormErrors,
        subscribeToFormInputErrorsUpdates,
        unsubscribeFromFormInputErrorsUpdates
    } = useContext(FormContext);

    // State
    const [errors, setErrors] = useState<ZodIssue[] | undefined>(getFormErrors());

    // Methods
    const onFormInputErrorsUpdates = (_: string, errors?: ZodIssue[]) => {
        setErrors(errors);
    };

    // Effects
    useEffect(() => {
        subscribeToFormInputErrorsUpdates(onFormInputErrorsUpdates);

        return () => {
            unsubscribeFromFormInputErrorsUpdates(onFormInputErrorsUpdates);
        };
    }, []);

    return errors;
}
