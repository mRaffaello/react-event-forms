export type ReFormTransformValueResult<I> = {
    value: I;
    effectedKeys: string[];
};

export abstract class ReFormEffect<I> {
    abstract shouldActivate(
        updatedKey: string,
        updatedValue: any,
        previousValue?: I,
        nextValue?: I
    ): boolean;

    abstract transformValue(previousValue?: I, nextValue?: I): ReFormTransformValueResult<I>;
}
