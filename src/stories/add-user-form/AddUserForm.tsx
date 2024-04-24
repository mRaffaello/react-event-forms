import { z } from 'zod';
import { useForm } from '../../lib';
import {
    EmailInputRenderer,
    NumberInputRenderer,
    TextInputRenderer
} from '../common/TextInputRenderers';
import { ButtonRenderer } from '../common/ButtonRenderer';
import { CheckboxRenderer } from '../common/CheckboxInputRenderer';
import { SelectRenderer } from '../common/SelectRenderer';

const AddUserFormRequestSchema = z.object({
    email: z.string().email(),
    enabled: z.boolean(),
    role: z.enum(['ADMIN', 'VIEWER']),
    anagraphic: z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        age: z.number().min(0)
    }),
    organization: z
        .object({
            name: z.string(),
            vat: z.string()
        })
        .optional()
});

const options = [
    { value: 'ADMIN' as const, label: 'Admin' },
    { value: 'VIEWER' as const, label: 'Viewer' }
];

type AddUserFormRequest = z.infer<typeof AddUserFormRequestSchema>;

export function AddUserForm(props: {
    initialValue?: AddUserFormRequest;
    defaultEnabled?: boolean;
    onSubmit?: (value: AddUserFormRequest) => void;
}) {
    // Hooks
    const form = useForm(AddUserFormRequestSchema, props.initialValue);

    // Render
    return (
        <form.context onSubmit={props.onSubmit}>
            <h2>General</h2>
            <form.field property='email' renderer={EmailInputRenderer} />
            <form.field
                property='role'
                renderer={_props => <SelectRenderer {..._props} options={options} />}
            />
            <form.field
                property='enabled'
                renderer={CheckboxRenderer}
                defaultValue={props.defaultEnabled}
            />

            <h2>Anagraphic</h2>
            <form.field property='anagraphic.firstName' renderer={TextInputRenderer} />
            <form.field property='anagraphic.lastName' renderer={TextInputRenderer} />
            <form.field property='anagraphic.age' renderer={NumberInputRenderer} />

            <h2>Organization</h2>
            <form.field property='organization.name' renderer={TextInputRenderer} />
            <form.field property='organization.vat' renderer={TextInputRenderer} />

            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}
