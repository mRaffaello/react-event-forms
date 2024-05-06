import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';
import { ReInputRendererProps } from '../../lib';
import ReactDatePicker from 'react-datepicker';

type RenderCountProps = {
    onRenderCount?: () => void;
};

export function DatePickerRenderer(props: ReInputRendererProps<Date> & RenderCountProps) {
    // Props
    const { value, errors, onChange, onBlur } = props;

    // Methods
    const _onChange = (date: Date | null) => {
        if (!date) onChange(undefined);
        else onChange(date);
    };

    // Effects
    useEffect(() => {
        props.onRenderCount?.();
    });

    // Render
    return (
        <div data-testid={`${props.property}-field`}>
            <p>{props.property}</p>
            <ReactDatePicker selected={value} onChange={_onChange} onBlur={onBlur} />
            <ul data-testid={`${props.property}-errors`}>
                {errors?.map(e => <li key={e.code}>{e.message}</li>)}
            </ul>
        </div>
    );
}
