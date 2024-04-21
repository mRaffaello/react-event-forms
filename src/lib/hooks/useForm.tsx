import { ReInput } from '../components';
import { ZodType, z } from 'zod';
import { NestedKeyOfWithOptionals } from '../types/structs';
import { ReForm, ReFormProps, ZodDefinition } from '../components/re-form/ReForm';
import { ReButton } from '../components/re-button/ReButton';
import { ReSubscribe } from '../components/re-subscribe';
import { ReactNode } from 'react';

/* export const schemaForType =
    <T>() =>
    <S extends z.ZodType<T, any, any>>(arg: S) => {
        return arg;
    }; */

/* export function useFormOld<T extends ZodType<any, any, any>>() {
    type InferedType = z.infer<T>;
    return {
        context: ReForm<InferedType>,
        field: ReInput<NestedKeyOfWithOptionals<InferedType>>,
        subscribe: ReSubscribe<InferedType>,
        button: ReButton
    };
} */

export function useForm<T extends ZodType<any, any, any>>(validator: T) {
    type InferedType = z.infer<T>;
    return {
        context: (props: Omit<ReFormProps<InferedType>, 'validator'>) => (
            <ReForm {...props} validator={validator as unknown as ZodDefinition} />
        ),
        field: ReInput<NestedKeyOfWithOptionals<InferedType>>,
        subscribe: <R,>(props: {
            selector: (value: InferedType) => R;
            children: (subscribedValue: R) => ReactNode;
        }) => <ReSubscribe<InferedType, R> {...props} />,
        button: ReButton
    };
}
