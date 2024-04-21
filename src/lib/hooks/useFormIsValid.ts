import { useMemo } from 'react';
import { useFormErrors } from './useFormErrors';

export function useFormIsValid() {
    // Hooks
    const errors = useFormErrors();

    // Memos
    const isValid = useMemo(() => !errors || !errors.length, [errors]);

    return isValid;
}
