import { z } from 'zod';
import { useForm } from '../../lib';
import { EmailInputRenderer, PasswordInputRenderer } from '../common/InputRenderers';
import { ButtonRenderer } from '../common/ButtonRenderer';

const ProfileFormRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    firstName: z.string(),
    lastName: z.string(),
    organization: z.string().optional()
});

type ProfileFormRequest = z.infer<typeof ProfileFormRequestSchema>;

export function ProfileForm(props: {
    initialValue: ProfileFormRequest;
    onSubmit?: (value: ProfileFormRequest) => void;
}) {
    // Hooks
    //const form = useForm<typeof ProfileFormRequestSchema>();
    const form = useForm(ProfileFormRequestSchema);

    // Render
    return (
        <form.context onSubmit={props.onSubmit} initialValue={props.initialValue}>
            <form.field property='email' renderer={EmailInputRenderer} />
            <form.field property='firstName' renderer={PasswordInputRenderer} />
            <form.field property='lastName' renderer={PasswordInputRenderer} />
            <form.field property='organization' renderer={PasswordInputRenderer} />
            <form.subscribe selector={value => value.lastName.length > 3}>
                {hasMoreThan3Chars =>
                    hasMoreThan3Chars ? (
                        <div>Last name has more than 3 characters</div>
                    ) : (
                        <div>Last name has less than 3 characters</div>
                    )
                }
            </form.subscribe>
            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}
