import { useEffect } from 'react';
import { ReInputRendererProps } from '../../lib';

type RenderCountProps = {
    onRenderCount?: () => void;
};

export function CheckboxRenderer(props: ReInputRendererProps<boolean> & RenderCountProps) {
    // Props
    const { value, defaultValue, errors, onChange, onBlur } = props;

    // Methods
    const _onChange: React.ChangeEventHandler<HTMLInputElement> = e => onChange(e.target.checked);

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
                    checked={value !== undefined ? value : props.defaultValue ?? false}
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
