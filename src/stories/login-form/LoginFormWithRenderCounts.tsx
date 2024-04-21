import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from '../../lib';
import { EmailInputRenderer, PasswordInputRenderer } from '../common/InputRenderers';
import { ButtonRenderer } from '../common/ButtonRenderer';

const LoginFormRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8)
});

type LoginFormRequest = z.infer<typeof LoginFormRequestSchema>;

export function LoginFormWithRenderCounts(props: {
    onContextRenderCount: () => void;
    onEmailFieldRenderCount: () => void;
    onPasswordFieldRenderCount: () => void;
    onSubmit?: (value: LoginFormRequest) => void;
}) {
    // Hooks
    const form = useForm(LoginFormRequestSchema);

    useEffect(() => {
        props.onContextRenderCount();
    });

    // Render
    return (
        <form.context
            onSubmit={props.onSubmit}
            initialValue={{
                email: '',
                password: ''
            }}>
            <form.field
                property='email'
                renderer={_props => (
                    <EmailInputRenderer {..._props} onRenderCount={props.onEmailFieldRenderCount} />
                )}
            />
            <form.field
                property='password'
                renderer={_props => (
                    <PasswordInputRenderer
                        {..._props}
                        onRenderCount={props.onPasswordFieldRenderCount}
                    />
                )}
            />
            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}
