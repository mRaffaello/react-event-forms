import { ChangeEventHandler, useEffect } from 'react';
import { ReInputRendererProps } from '../../lib';

type BooleanOrUndefinableBoolean = boolean | (boolean | undefined);

type RenderCountProps = {
    onRenderCount?: () => void;
};

export function CheckboxRenderer<T extends BooleanOrUndefinableBoolean>(
    props: ReInputRendererProps<T> & RenderCountProps
) {
    // Props
    const { value, defaultValue, errors, onChange, onBlur } = props;

    // Methods
    const _onChange: ChangeEventHandler<HTMLInputElement> = e =>
        onChange((e.target as any).checked);

    // Effects
    useEffect(() => {
        props.onRenderCount?.();
    });

    // Render
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                <input
                    type='checkbox'
                    checked={value !== undefined ? value : defaultValue ?? false}
                    onChange={_onChange}
                    onBlur={onBlur}
                    data-testid={`${props.property}-field`}
                />
                <p>{props.property}</p>
            </div>
            <ul data-testid={`${props.property}-errors`}>
                {errors?.map(e => <li key={e.code}>{e.message}</li>)}
            </ul>
        </div>
    );
}
