import { ReInput, ReInputProps } from '../components';
import { ZodType, z } from 'zod';
import { ReForm, ReFormProps, ZodDefinition } from '../components/re-form/ReForm';
import { ReButton } from '../components/re-button/ReButton';
import { ReSubscribe } from '../components/re-subscribe';
import { ReactNode } from 'react';
import { ExtractFieldType, NestedKeyOf } from '../types/structs';

export function useForm<T extends ZodType<any, any, any>>(validator: T, initialValue?: z.infer<T>) {
    type InferedType = z.infer<T>;

    return {
        context: (props: Omit<ReFormProps<InferedType>, 'validator' | 'initialValue'>) => (
            <ReForm
                {...props}
                validator={validator as unknown as ZodDefinition}
                initialValue={initialValue}
            />
        ),
        field: <Property extends NestedKeyOf<InferedType>>(
            props: ReInputProps<Property, ExtractFieldType<InferedType, Property>>
        ) => <ReInput {...props} />,
        safeField: <Property extends NestedKeyOf<InferedType>>(
            props: ReInputProps<Property, NonNullable<ExtractFieldType<InferedType, Property>>>
        ) => <ReInput {...props} />,
        subscribe: <R,>(props: {
            selector: (value: InferedType) => R;
            children: (subscribedValue: R) => ReactNode;
        }) => <ReSubscribe<InferedType, R> {...props} />,
        button: ReButton
    };
}
