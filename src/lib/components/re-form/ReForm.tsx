import { createContext, useRef } from 'react';
import { ReactNode } from 'react';
import { ZodIssue, z } from 'zod';
import { areObjectsEqual } from '../../utils/equals';
import { getPropertyValueByDottedPath, setObjectNestedProperty } from '../../utils/objects';

export type FormInputErrorsObserver = (
    inputKey: string,
    errors?: z.ZodIssue[],
    overrideBlurRequirement?: boolean
) => void;
export type FormValueObserver = () => void;
export type FormForceValueObserver = () => void;

export type ZodDefinition = z.ZodObject<any> | z.ZodEffects<z.ZodObject<any>>;

type AnyObject = { [key: string]: any };

type FormContextType = {
    // Setters
    setDefaultValue: (inputKey: string, inputValue: any) => void;
    setInputValue: (inputKey: string, inputValue: any) => z.ZodIssue[] | undefined;

    // Getters
    getFormValue: () => any;
    getFormInputValue: (inputKey: string) => any;
    getFormErrors: () => z.ZodIssue[] | undefined;

    // Observable
    subscribeToFormInputErrorsUpdates: (observer: FormInputErrorsObserver) => void;
    unsubscribeFromFormInputErrorsUpdates: (observer: FormInputErrorsObserver) => void;
    subscribeToFormValueUpdates: (observer: FormValueObserver) => void;
    unsubscribeFromFormValueUpdates: (observer: FormValueObserver) => void;
    subscribeToFormForceValueUpdates: (observer: FormForceValueObserver) => void;
    unsubscribeFromFormForceValueUpdates: (observer: FormForceValueObserver) => void;
};

export const FormContext = createContext<FormContextType>({} as FormContextType);

// Todo: optional field should not be returned when empty
// Todo: add is loading
// Todo: tests for nested path
// Todo: handle boolean: un campo booleano, se non viene inizializzato causerà un errore di validazione di zod. Dovrebbe invece essere inizializzato a false in quel caso

// Todo: strip undefined properties from unSubmit

export type ReFormProps<I> = {
    children: ReactNode;

    validator: ZodDefinition;
    initialValue?: I;
    requiresFirstChangeToEnable?: boolean;

    // Todo: test re render
    isLoading?: boolean;
    onSubmit?: (value: I) => void;

    renderer?: (props: { children: ReactNode; onSubmit: () => void }) => JSX.Element;
};

const getInitialErrors = <I,>(validator: ZodDefinition, initialValue?: I) => {
    const validationResult = validator.safeParse(initialValue);
    if (!validationResult.success) {
        return validationResult.error.errors;
    } else return undefined;
};

export function ReForm<I>(props: ReFormProps<I>) {
    // References
    const formValueRef = useRef<I | undefined>(props.initialValue);
    const formIssuesRef = useRef<z.ZodIssue[] | undefined>(
        getInitialErrors(props.validator, props.initialValue)
    );
    const initialValueRef = useRef(props.initialValue);

    const formValidatorRef = useRef<ZodDefinition>(props.validator);

    const formInputErrorsObserversRef = useRef<FormInputErrorsObserver[]>([]);
    const formValueObserversRef = useRef<FormValueObserver[]>([]);
    const formForceValueObserversRef = useRef<FormForceValueObserver[]>([]);

    // Methods
    const onSubmit = () => {
        // Check form errors
        const formErrors = validateFormValue();
        if (formErrors) return;

        // Get form value
        const formValue = getFormValue();
        if (!formValue) return;

        // Submit
        props.onSubmit?.(formValue);
    };

    const setFormValue = (value: any) => {
        formValueRef.current = value;
        notifyFormValueSubscribers();
        notifyFormForceValueSubscribers();
    };

    const clearForm = () => {
        // Remove values
        formValueRef.current = undefined;

        // Remove results
        formIssuesRef.current = undefined;
    };

    // Set a default value without re-renders
    const setDefaultValue = (inputKey: string, inputValue: any) => {
        // Check if validator is defined
        const validator = formValidatorRef.current;
        if (!validator) throw new Error('Form not initialized');

        // Set default value only if specified value is undefined
        const currentInputValue = getFormInputValue(inputKey);
        if (currentInputValue !== undefined) return;

        // Update form values
        if (inputKey.includes('.')) {
            formValueRef.current = setObjectNestedProperty(
                formValueRef.current,
                inputKey,
                inputValue
            );
        } else {
            formValueRef.current = {
                ...formValueRef.current,
                [inputKey]: inputValue
            } as I;
        }
    };

    const setInputValue = (inputKey: string, inputValue: any) => {
        // Check if validator is defined
        const validator = formValidatorRef.current;
        if (!validator) throw new Error('Form not initialized');

        // Update form values
        if (inputKey.includes('.')) {
            formValueRef.current = setObjectNestedProperty(
                formValueRef.current,
                inputKey,
                inputValue
            );
        } else {
            formValueRef.current = {
                ...formValueRef.current,
                [inputKey]: inputValue
            } as I;
        }

        // Notify subcriber
        notifyFormValueSubscribers();

        // Parse
        const validationResult = validator.safeParse(formValueRef.current);

        // Return error if present
        if (!validationResult.success) {
            formIssuesRef.current = validationResult.error.errors;
            notifyFormInputErrorsSubscribers(inputKey, validationResult.error.errors);
            return validationResult.error.errors.filter(e => e.path.join('.') === inputKey);
        } else {
            formIssuesRef.current = undefined;
        }

        // Todo: notify only if previous state was right
        notifyFormInputErrorsSubscribers(inputKey);
    };

    const validateFormValue = () => {
        // Check if it's already present
        const validator = formValidatorRef.current;
        if (!validator) throw new Error('Form not initialized');

        // Parse
        const formValue = formValueRef.current ?? ({} as AnyObject);
        const validationResult = validator.safeParse(formValue);

        // Return error if present
        if (!validationResult.success) {
            formIssuesRef.current = validationResult.error.errors;

            const keys = validationResult.error.errors.map(e => e.path.join('.')) as string[];

            keys.forEach(key =>
                notifyFormInputErrorsSubscribers(key, validationResult.error.errors, true)
            );

            return validationResult.error.errors;
        } else {
            formIssuesRef.current = undefined;
        }
    };

    const getFormErrors = () => {
        let isEqual = false;
        if (props.requiresFirstChangeToEnable && initialValueRef.current) {
            isEqual = areObjectsEqual(formValueRef.current, initialValueRef.current);
        }

        return isEqual
            ? [
                  ...(formIssuesRef.current ?? []),
                  {
                      path: ['global'],
                      message: 'At least one change is required to activate the form'
                  } as ZodIssue
              ]
            : formIssuesRef.current;
    };

    const getFormValue = () => {
        return formValueRef.current;
    };

    const getFormInputValue = (inputKey: string) => {
        // Search nested value
        if (inputKey.includes('.'))
            return getPropertyValueByDottedPath(formValueRef.current, inputKey);

        // Search top level value
        return (formValueRef.current as any)?.[inputKey];
    };

    // Form input errors updated
    const subscribeToFormInputErrorsUpdates = (observer: FormInputErrorsObserver) => {
        formInputErrorsObserversRef.current.push(observer);
    };

    const unsubscribeFromFormInputErrorsUpdates = (observerToRemove: FormInputErrorsObserver) => {
        formInputErrorsObserversRef.current = formInputErrorsObserversRef.current.filter(
            observer => observerToRemove !== observer
        );
    };

    const notifyFormInputErrorsSubscribers = (
        inputKey: string,
        errors?: z.ZodIssue[],
        force?: boolean
    ) => {
        formInputErrorsObserversRef.current.forEach(observer => observer(inputKey, errors, force));
    };

    // Form force value updated
    const subscribeToFormValueUpdates = (observer: FormValueObserver) => {
        formValueObserversRef.current.push(observer);
    };

    const unsubscribeFromFormValueUpdates = (observerToRemove: FormValueObserver) => {
        formValueObserversRef.current = formValueObserversRef.current.filter(
            observer => observerToRemove !== observer
        );
    };

    const notifyFormValueSubscribers = () => {
        formValueObserversRef.current.forEach(observer => observer());
    };

    // Form force value updated
    const subscribeToFormForceValueUpdates = (observer: FormForceValueObserver) => {
        formForceValueObserversRef.current.push(observer);
    };

    const unsubscribeFromFormForceValueUpdates = (observerToRemove: FormForceValueObserver) => {
        formForceValueObserversRef.current = formForceValueObserversRef.current.filter(
            observer => observerToRemove !== observer
        );
    };

    const notifyFormForceValueSubscribers = () => {
        formForceValueObserversRef.current.forEach(observer => observer());
    };

    // Render
    return (
        <FormContext.Provider
            value={{
                setDefaultValue,
                setInputValue,
                getFormValue,
                getFormInputValue,
                getFormErrors,
                subscribeToFormInputErrorsUpdates,
                unsubscribeFromFormInputErrorsUpdates,
                subscribeToFormValueUpdates,
                unsubscribeFromFormValueUpdates,
                subscribeToFormForceValueUpdates,
                unsubscribeFromFormForceValueUpdates
            }}>
            {props.renderer ? (
                <props.renderer onSubmit={onSubmit}>{props.children}</props.renderer>
            ) : (
                <DefaultFormRenderer onSubmit={onSubmit}>{props.children}</DefaultFormRenderer>
            )}
        </FormContext.Provider>
    );
}

ReForm.defaultProps = {
    requiresFirstChangeToEnable: true
};

export const DefaultFormRenderer = (props: { children: ReactNode; onSubmit: () => void }) => {
    // Methods
    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        props.onSubmit();
    };

    // Render
    return (
        <form onSubmit={onSubmit} noValidate>
            {props.children}
        </form>
    );
};
