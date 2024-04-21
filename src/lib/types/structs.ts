type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type OptionalPropertyOf<T extends object> = Exclude<
    {
        [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    }[keyof T],
    undefined
>;

export type NestedKeyOfWithOptionals<T> = (
    T extends object
        ? {
              [K in Exclude<keyof T, symbol | 'length'>]: `${K}${DotPrefix<NestedKeyOf<T[K]>>}`;
          }[Exclude<keyof T, symbol | 'length'>]
        : ''
) extends infer D
    ? Extract<D, string>
    : never;

export type NestedKeyOf<T> = (
    T extends object
        ? {
              [K in Exclude<keyof T, symbol | OptionalPropertyOf<T> | 'length'>]: `${K}${DotPrefix<
                  NestedKeyOf<T[K]>
              >}`;
          }[Exclude<keyof T, symbol | OptionalPropertyOf<T> | 'length'>]
        : ''
) extends infer D
    ? Extract<D, string>
    : never;
