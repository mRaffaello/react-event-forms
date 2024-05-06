type Paths<T> = T extends object
    ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T]
    : never;

type RecursiveNonNullable<T> = { [K in keyof T]-?: RecursiveNonNullable<NonNullable<T[K]>> };

export type NestedKeyOf<T> = Paths<RecursiveNonNullable<T>>;

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
