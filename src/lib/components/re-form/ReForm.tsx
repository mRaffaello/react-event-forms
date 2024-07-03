import { createContext, FormEventHandler, useRef } from 'react';
import { ReactNode } from 'react';
import { ZodIssue, z } from 'zod';
import { areObjectsEqual } from '../../utils/equals';
import {
    getPropertyValueByDottedPath,
    initializeEmptyObject,
    setObjectNestedProperty
} from '../../utils/objects';
import { ReFormEffect } from './ReFormEffect';

export type FormInputErrorsObserver = (
    inputKey?: string,
    errors?: z.ZodIssue[],
    overrideBlurRequirement?: boolean
) => void;
export type FormValueObserver = () => void;
export type FormForceValueObserver = (inputKeys: string[]) => void;

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

// Todo: optional field should not be returned when empty (strip undefined properties from unSubmit)
// Todo: add is loading
// Todo: useForm value hook should work outside of context

// Todo: refine not working. Fix and test it!!!

// Todo: implement onValid form callback. This is useful for filter form where an action should immediately take place

// Todo: check that react-datepicker is not bundled with the library
// Todo: async validation. When a form is submitted and an api call is made, the user should have the ability to take the output of the api and show it as validation error
export type ReFormRendererProps = {
    children: ReactNode;
    onSubmit: () => void;
};

export type ReFormProps<I> = {
    children: ReactNode;

    validator: ZodDefinition;
    initialValue?: I;
    requiresFirstChangeToEnable?: boolean;

    // Todo: test re render
    isLoading?: boolean;
    onSubmit?: (value: I) => void;

    // Apply some transformation to the form value based on the previous value and the next value compute a transformed value. This gets executed before any UI updates
    effects?: ReFormEffect<I>[];

    renderer?: (props: { children: ReactNode; onSubmit: () => void }) => JSX.Element;
};

const getInitialErrors = <I,>(validator: ZodDefinition, initialValue?: I) => {
    const validationResult = validator.safeParse(initialValue);
    if (!validationResult.success) {
        return validationResult.error.errors;
    } else return undefined;
};

export function ReForm<I>(props: ReFormProps<I>) {
    const _requiresFirstChangeToEnable =
        props.requiresFirstChangeToEnable === undefined ? true : props.requiresFirstChangeToEnable;

    // References
    const formValidatorRef = useRef<ZodDefinition>(props.validator);
    const formValueRef = useRef<I | undefined>(
        props.initialValue ?? initializeEmptyObject(props.validator as any)
    );

    const formIssuesRef = useRef<z.ZodIssue[] | undefined>(
        getInitialErrors(props.validator, props.initialValue)
    );
    const initialValueRef = useRef(props.initialValue);

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
        const prevFormValue = formValueRef.current;
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

        // Apply effects in order
        const updatedProperties: string[] = [];
        for (const effect of props.effects ?? []) {
            // Skip if deps does not contain updated key
            if (!effect.shouldActivate(inputKey, inputValue, prevFormValue, formValueRef.current))
                continue;

            // Apply tranformation
            const effectResult = effect.transformValue(prevFormValue, formValueRef.current);

            // Assign new value
            formValueRef.current = effectResult?.value;

            // Add updated properties to the list
            effectResult?.effectedKeys.forEach(d => {
                if (!updatedProperties.includes(d)) updatedProperties.push(d);
            });
        }

        // Force update effect fields
        if (updatedProperties.length) notifyFormForceValueSubscribers(updatedProperties);

        // Notify subscribers
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
            notifyFormInputErrorsSubscribers(undefined, undefined, true);
            formIssuesRef.current = undefined;
        }
    };

    const getFormErrors = () => {
        let isEqual = false;
        if (_requiresFirstChangeToEnable && initialValueRef.current) {
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
        inputKey?: string,
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

    const notifyFormForceValueSubscribers = (inputKeys: string[]) => {
        formForceValueObserversRef.current.forEach(observer => observer(inputKeys));
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

export const DefaultFormRenderer = (props: ReFormRendererProps) => {
    // Methods
    const onSubmit: FormEventHandler<HTMLFormElement> = e => {
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
