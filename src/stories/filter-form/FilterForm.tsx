import { z } from 'zod';
import { useForm, ValidationBehaviour } from '../../lib';
import { ButtonRenderer, ButtonRendererWithoutDisable } from '../common/ButtonRenderer';
import { DatePickerRenderer } from '../common/DatePickerRenderer';

const FilterFormRequestSchema = z
    .object({
        startDate: z.date(),
        endDate: z.date()
    })
    .refine(data => data.startDate < data.endDate, {
        message: 'End date must be after start date',
        path: ['endDate']
    });

type FilterFormRequest = z.infer<typeof FilterFormRequestSchema>;

export function FilterForm(props: {
    onSubmit?: (value: FilterFormRequest) => void;
    initiallyDisabled?: boolean;
    validationBehaviour: ValidationBehaviour;
}) {
    // Hooks
    const form = useForm(FilterFormRequestSchema);

    // Render
    return (
        <form.context onSubmit={props.onSubmit}>
            <form.field property='startDate' renderer={DatePickerRenderer} />
            <form.field
                property='endDate'
                renderer={DatePickerRenderer}
                validationBehaviour={props.validationBehaviour}
            />
            {props.initiallyDisabled ? (
                <form.button renderer={ButtonRendererWithoutDisable} />
            ) : (
                <form.button renderer={ButtonRenderer} />
            )}
        </form.context>
    );
}
