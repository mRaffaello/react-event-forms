import { z } from 'zod';
import { useForm } from '../../lib';
import { EmailInputRenderer, PasswordInputRenderer } from '../common/TextInputRenderers';
import { ButtonRenderer } from '../common/ButtonRenderer';
import { useEffect } from 'react';

const ProfileFormRequestSchema = z.object({
    email: z.string().email('Invalid email format'),
    firstName: z.string(),
    lastName: z.string(),
    organization: z.string().optional()
});

type ProfileFormRequest = z.infer<typeof ProfileFormRequestSchema>;

export function ProfileFormWithRenderCounts(props: {
    initialValue: ProfileFormRequest;
    onContextRenderCount: () => void;
    onEmailFieldRenderCount: () => void;
    onFirstNameFieldRenderCount: () => void;
    onLastNameFieldRenderCount: () => void;
    onOrganizationFieldRenderCount: () => void;
    onSubscribeRenderCount: () => void;
    onSubmit?: (value: ProfileFormRequest) => void;
}) {
    // Hooks
    const form = useForm(ProfileFormRequestSchema, props.initialValue);

    // Effects
    useEffect(() => {
        props.onContextRenderCount();
    });

    // Render
    return (
        <form.context onSubmit={props.onSubmit}>
            <form.field
                property='email'
                renderer={_props => (
                    <EmailInputRenderer {..._props} onRenderCount={props.onEmailFieldRenderCount} />
                )}
            />
            <form.field
                property='firstName'
                renderer={_props => (
                    <PasswordInputRenderer
                        {..._props}
                        onRenderCount={props.onFirstNameFieldRenderCount}
                    />
                )}
            />
            <form.field
                property='lastName'
                renderer={_props => (
                    <PasswordInputRenderer
                        {..._props}
                        onRenderCount={props.onLastNameFieldRenderCount}
                    />
                )}
            />
            <form.field
                property='organization'
                renderer={_props => (
                    <PasswordInputRenderer
                        {..._props}
                        onRenderCount={props.onOrganizationFieldRenderCount}
                    />
                )}
            />
            <form.subscribe selector={value => (value?.lastName.length ?? 0) > 3}>
                {hasMoreThan3Chars => (
                    <ReactiveText
                        hasMoreThan3Chars={hasMoreThan3Chars}
                        onRenderCount={props.onSubscribeRenderCount}
                    />
                )}
            </form.subscribe>
            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}

const ReactiveText = (props: { hasMoreThan3Chars: boolean; onRenderCount: () => void }) => {
    useEffect(() => {
        props.onRenderCount();
    });

    return (
        <div data-testid='reactive-text'>
            {props.hasMoreThan3Chars ? (
                <div>Last name has more than 3 characters</div>
            ) : (
                <div>Last name has less than 3 characters</div>
            )}
        </div>
    );
};
