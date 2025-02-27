// Helper type for handling strings, numbers, and symbols as object keys
type PathKey = string | number | symbol;

// Helper to make all properties in an object and its nested objects non-nullable
type DeepNonNullable<T> = T extends object
    ? { [K in keyof T]-?: DeepNonNullable<NonNullable<T[K]>> }
    : NonNullable<T>;

// Limit recursion depth with explicit depth parameter
type PathsWithDepth<T, Depth extends number> = [Depth] extends [never]
    ? never
    : T extends object
    ? {
          [K in keyof T]-?: K extends PathKey
              ? `${K & string}${
                    | ''
                    | (T[K] extends object
                          ? `.${PathsWithDepth<NonNullable<T[K]>, Prev[Depth]>}`
                          : '')}`
              : never;
      }[keyof T]
    : never;

// Previous number implementation to help limit recursion depth
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Public API with reasonable default depth
export type NestedKeyOf<T> = PathsWithDepth<DeepNonNullable<T>, 6>;

// Efficient field type extraction
export type ExtractFieldType<T, Path extends string> = Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? T[K] extends object | undefined
            ? ExtractFieldType<NonNullable<T[K]>, Rest>
            : never
        : never
    : never;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Additional utilities for better type handling
export type PathValue<T, P extends string> = P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? T[K] extends object | undefined
            ? PathValue<NonNullable<T[K]>, Rest>
            : never
        : never
    : never;
