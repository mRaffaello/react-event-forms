import { z } from 'zod';
import { useForm } from '../../lib';
import { EmailInputRenderer, PasswordInputRenderer } from '../common/TextInputRenderers';
import { ButtonRenderer } from '../common/ButtonRenderer';

const LoginFormRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8)
});

type LoginFormRequest = z.infer<typeof LoginFormRequestSchema>;

export function LoginForm(props: {
    initialValue?: LoginFormRequest;
    onSubmit?: (value: LoginFormRequest) => void;
}) {
    // Hooks
    const form = useForm(LoginFormRequestSchema, props.initialValue);

    // Render
    return (
        <form.context onSubmit={props.onSubmit}>
            <form.field property='email' renderer={EmailInputRenderer} />
            <form.field property='password' renderer={PasswordInputRenderer} />
            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}
