import { useMemo } from 'react';
import { useFormErrors } from './useFormErrors';
import useFormHasChanged from './useFormHasChanged';

export function useFormIsValid() {
    // Hooks
    const errors = useFormErrors();
    const hasFormChanged = useFormHasChanged();

    // Memos
    const isValid = useMemo(
        () => (!errors || !errors.length) && hasFormChanged,
        [errors, hasFormChanged]
    );

    return isValid;
}
