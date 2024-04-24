import { useEffect } from 'react';
import { ReInputRendererProps } from '../../lib';

type RenderCountProps = {
    onRenderCount?: () => void;
};

export function SelectRenderer<T>(
    props: ReInputRendererProps<T> &
        RenderCountProps & {
            options: {
                value: T;
                label: string;
            }[];
        }
) {
    // Props
    const { value, errors, onChange, onBlur } = props;

    // Methods
    const _onChange: React.ChangeEventHandler<HTMLSelectElement> = e =>
        onChange(e.target.value as T);

    // Effects
    useEffect(() => {
        props.onRenderCount?.();
    });

    // Render
    return (
        <div>
            <p>{props.property}</p>
            <select
                value={value as string}
                onChange={_onChange}
                onBlur={onBlur}
                defaultValue='no-selection'
                data-testid={`${props.property}-field`}>
                <option disabled value='no-selection'>
                    -- select an option --
                </option>
                {props.options.map(option => (
                    <option key={option.value as string} value={option.value as string}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ul data-testid={`${props.property}-errors`}>
                {errors?.map(e => <li key={e.code}>{e.message}</li>)}
            </ul>
        </div>
    );
}
