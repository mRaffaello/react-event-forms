// Helper type to check if a type is a "primitive object" that shouldn't be recursed into
export type IsPrimitiveObject<T> = T extends Date
    ? true
    : T extends Array<any>
    ? true
    : T extends Map<any, any>
    ? true
    : T extends Set<any>
    ? true
    : T extends RegExp
    ? true
    : T extends Function
    ? true
    : false;

// Modified Paths type that doesn't recurse into primitive objects
export type Paths<T> = T extends object
    ? IsPrimitiveObject<T> extends true
        ? never
        : { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T]
    : never;

export type NestedKeyOf<T> = Exclude<Paths<T>, undefined>;

export type ExtractFieldType<T, Path extends NestedKeyOf<T>> = Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? T[K] extends object | undefined
            ? Rest extends NestedKeyOf<NonNullable<T[K]>>
                ? ExtractFieldType<NonNullable<T[K]>, Rest>
                : never
            : never
        : never
    : never;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
