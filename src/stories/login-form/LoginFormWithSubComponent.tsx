import { z } from 'zod';
import { useForm } from '../../lib';
import { useFormField } from '../../lib/hooks/useFormField';
import { EmailInputRenderer, PasswordInputRenderer } from '../common/InputRenderers';

const LoginFormRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8)
});

type LoginFormRequest = z.infer<typeof LoginFormRequestSchema>;

export function LoginFormWithSubComponent() {
    // Hooks
    const form = useForm(LoginFormRequestSchema);

    // Methods
    const onSubmit = (value: LoginFormRequest) => {
        console.log('Submitting', value);
    };

    // Render
    return (
        <form.context
            onSubmit={onSubmit}
            initialValue={{
                email: '',
                password: ''
            }}>
            <LoginFormEmailField />
            <p>Password</p>
            <form.field property='password' renderer={PasswordInputRenderer} />
        </form.context>
    );
}

export function LoginFormEmailField() {
    // Hooks
    const form = useFormField<typeof LoginFormRequestSchema>();

    // Render
    return (
        <>
            <p>Email</p>
            <form.field property='email' renderer={EmailInputRenderer} />
        </>
    );
}
