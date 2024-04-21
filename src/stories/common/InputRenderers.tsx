import { useEffect } from 'react';
import { ReInputRendererProps } from '../../lib';

type RenderCountProps = {
    onRenderCount?: () => void;
};

function BaseInputRenderer(
    props: ReInputRendererProps &
        RenderCountProps & { type?: 'email' | 'string' | 'number' | 'password' }
) {
    // Props
    const { value, errors, onChange, onBlur, type } = props;

    // Methods
    const _onChange: React.ChangeEventHandler<HTMLInputElement> = e => onChange(e.target.value);

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
                value={value}
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

export const TextInputRenderer = (props: ReInputRendererProps & RenderCountProps) => (
    <BaseInputRenderer {...props} type='string' />
);

export const EmailInputRenderer = (props: ReInputRendererProps & RenderCountProps) => (
    <BaseInputRenderer {...props} type='email' />
);

export const PasswordInputRenderer = (props: ReInputRendererProps & RenderCountProps) => (
    <BaseInputRenderer {...props} type='password' />
);
