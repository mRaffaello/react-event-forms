import { useMemo } from 'react';
import { eventEmitter } from '../utils/events';
import { APP_EVENT } from '../types/events';

function useFormActions<T>(formId: string) {
    // Methods
    const setFormValue = (value: T, reset = true) => {
        eventEmitter.emit(APP_EVENT.SET_FORM_VALUE, formId, value, reset);
    };

    const submitForm = () => {
        eventEmitter.emit(APP_EVENT.SUBMIT_FORM, formId);
    };

    return useMemo(
        () => ({
            setFormValue,
            submitForm
        }),
        []
    );
}

export default useFormActions;
