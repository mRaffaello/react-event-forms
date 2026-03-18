type FormValueGetter = () => unknown;

const formValueGetters = new Map<string, FormValueGetter>();

export function registerFormValueGetter(formId: string, getter: FormValueGetter): void {
    formValueGetters.set(formId, getter);
}

export function unregisterFormValueGetter(formId: string): void {
    formValueGetters.delete(formId);
}

export function getFormValueById<T = unknown>(formId: string): T | undefined {
    const getter = formValueGetters.get(formId);
    if (!getter) return undefined;
    return getter() as T | undefined;
}
