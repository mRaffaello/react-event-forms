import { useContext, useEffect, useState } from 'react';
import { FormContext } from '../components';

function useFormHasChanged() {
    // Hooks
    const { subscribeToFormHasChanged, unsubscribeFromFormHasChanged } = useContext(FormContext);

    // State
    const [changed, setChanged] = useState(false);

    // Methods
    const onFormInputErrorsUpdates = (hasChanged: boolean) => {
        setChanged(hasChanged);
    };

    // Effects
    useEffect(() => {
        subscribeToFormHasChanged(onFormInputErrorsUpdates);

        return () => {
            unsubscribeFromFormHasChanged(onFormInputErrorsUpdates);
        };
    }, []);

    return changed;
}

export default useFormHasChanged;
