import { ChangeEventHandler, useEffect } from 'react';
import { ReInputRendererProps } from '../../lib';

type StringOrUndefinableString = string | (string | undefined);
type NumberOrUndefinableNumber = number | (number | undefined);

type RenderCountProps = {
    onRenderCount?: () => void;
};

function BaseInputRenderer<T extends StringOrUndefinableString>(
    props: ReInputRendererProps<T> &
        RenderCountProps & { type?: 'email' | 'string' | 'password'; disabled?: boolean }
) {
    // Props
    const { value, errors, onChange, onBlur, type } = props;

    // Methods
    const _onChange: ChangeEventHandler<HTMLInputElement> = e => onChange(e.target.value as T);

    // Effects
    useEffect(() => {
        props.onRenderCount?.();
    });

    // Render
    return (
        <div>
            <p>{props.property}</p>
            <input
                type={type}
                disabled={props.disabled}
                value={value === undefined ? '' : value}
                onChange={_onChange}
                onBlur={onBlur}
                data-testid={`${props.property}-field`}
            />
            <ul data-testid={`${props.property}-errors`}>
                {errors?.map(e => <li key={e.code}>{e.message}</li>)}
            </ul>
        </div>
    );
}

export const TextInputRenderer = <T extends StringOrUndefinableString>(
    props: ReInputRendererProps<T> & RenderCountProps & { disabled?: boolean }
) => <BaseInputRenderer {...props} type='string' />;

export const EmailInputRenderer = <T extends StringOrUndefinableString>(
    props: ReInputRendererProps<T> & RenderCountProps & { disabled?: boolean }
) => <BaseInputRenderer {...props} type='email' />;

export const PasswordInputRenderer = <T extends StringOrUndefinableString>(
    props: ReInputRendererProps<T> & RenderCountProps & { disabled?: boolean }
) => <BaseInputRenderer {...props} type='password' />;

export function NumberInputRenderer<T extends NumberOrUndefinableNumber>(
    props: ReInputRendererProps<T> & RenderCountProps & { disabled?: boolean }
) {
    // Props
    const { value, errors, onChange, onBlur } = props;

    // Methods
    const _onChange: React.ChangeEventHandler<HTMLInputElement> = e =>
        onChange(Number(e.target.value) as T);

    // Effects
    useEffect(() => {
        props.onRenderCount?.();
    });

    // Render
    return (
        <div>
            <p>{props.property}</p>
            <input
                type='number'
                value={value !== undefined ? value : ''}
                onChange={_onChange}
                onBlur={onBlur}
                data-testid={`${props.property}-field`}
            />
            <ul data-testid={`${props.property}-errors`}>
                {errors?.map(e => <li key={e.code}>{e.message}</li>)}
            </ul>
        </div>
    );
}
