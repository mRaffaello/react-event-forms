import { useContext, useEffect, useState } from 'react';
import { FormContext } from '../components';

export function useFormValue<T>() {
    // Hooks
    const { getFormValue, subscribeToFormValueUpdates, unsubscribeFromFormValueUpdates } =
        useContext(FormContext);

    // State
    const [value, setValue] = useState<T>(getFormValue());

    // Methods
    const onFormValueUpdate = () => {
        setValue(getFormValue());
    };

    // Effects
    useEffect(() => {
        subscribeToFormValueUpdates(onFormValueUpdate);

        return () => {
            unsubscribeFromFormValueUpdates(onFormValueUpdate);
        };
    }, []);

    return value;
}
