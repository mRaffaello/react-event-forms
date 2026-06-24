import { ZodObject } from 'zod';

export const getPropertyValueByDottedPath = (o: any, s: string) => {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (o && k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v) && !(v instanceof Date);

/** Merges partial into target. Only keys present in partial are updated; others are left unchanged. */
export const mergePartialIntoObject = <T extends Record<string, unknown>>(
    target: T,
    partial: Partial<T>
): T => {
    const result = { ...target };
    for (const key of Object.keys(partial) as (keyof T)[]) {
        const partialVal = partial[key];
        if (partialVal === undefined) continue;
        const targetVal = result[key];
        if (isPlainObject(partialVal) && isPlainObject(targetVal)) {
            (result as any)[key] = mergePartialIntoObject(
                (targetVal as Record<string, unknown>) ?? {},
                partialVal as Record<string, unknown>
            );
        } else {
            (result as any)[key] = partialVal;
        }
    }
    return result;
};

export const setObjectNestedProperty = (_obj: any, inputKey: string, inputValue: any): any => {
    const keys = inputKey.split('.'); // Split the inputKey by dot to get nested keys

    // Clone immutably along the path so every touched node (including the root)
    // gets a new reference. Reference identity is what change detection relies on
    // to notify subscribers and trigger re-renders.
    const root = isPlainObject(_obj) ? { ..._obj } : {};

    let currentObj: any = root;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
            // Last key in the chain, update the value
            currentObj[key] = inputValue;
        } else {
            // Shallow clone the next level so we never mutate the previous object
            const next = currentObj[key];
            currentObj[key] = isPlainObject(next) ? { ...next } : {};
            currentObj = currentObj[key];
        }
    }

    return root;
};

export const initializeEmptyObject = (schema: ZodObject<any>): any => {
    if (schema._def.shape && typeof schema._def.shape === 'function') {
        return _initializeEmptyObject(schema._def.shape());
    } else return _initializeEmptyObject((schema._def as any).schema.shape);
};

export const _initializeEmptyObject = (shape: any): any => {
    const obj: any = {};

    for (const [key, value] of Object.entries(shape)) {
        if ((value as any)._def.typeName === 'ZodObject') {
            const res = _initializeEmptyObject((value as any)._def.shape());

            obj[key] = _initializeEmptyObject((value as any)._def.shape());
        }
    }

    return obj;
};
