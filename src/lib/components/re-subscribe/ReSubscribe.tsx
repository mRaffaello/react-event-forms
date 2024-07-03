import { ReactNode, useMemo } from 'react';
import { useFormValue } from '../../hooks';

type ReSubscribeProps<T, R> = {
    selector: (value: T) => R;
    children: (subscribedValue: R) => ReactNode;
};

export function ReSubscribe<T, R>(props: ReSubscribeProps<T, R>) {
    // Hooks
    const value = useFormValue<T>();

    // Memos
    const subscribedValue = useMemo(() => props.selector(value), [value, props.selector]);

    // Render
    return useMemo(() => props.children(subscribedValue), [subscribedValue, props.children]);
}
