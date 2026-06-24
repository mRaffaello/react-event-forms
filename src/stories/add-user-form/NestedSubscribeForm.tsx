import { z } from 'zod';
import { useForm } from '../../lib';
import { TextInputRenderer } from '../common/TextInputRenderers';
import { ButtonRenderer } from '../common/ButtonRenderer';

const NestedSubscribeSchema = z.object({
    anagraphic: z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3)
    })
});

type NestedSubscribeRequest = z.infer<typeof NestedSubscribeSchema>;

export function NestedSubscribeForm(props: { onSubmit?: (value: NestedSubscribeRequest) => void }) {
    // Hooks
    const form = useForm(NestedSubscribeSchema, {
        anagraphic: { firstName: '', lastName: '' }
    });

    // Render
    return (
        <form.context onSubmit={props.onSubmit}>
            <h2>Anagraphic</h2>
            <form.field property='anagraphic.firstName' renderer={TextInputRenderer} />
            <form.field property='anagraphic.lastName' renderer={TextInputRenderer} />

            <h2>Subscription (nested key: anagraphic.lastName)</h2>
            <form.subscribe selector={value => (value?.anagraphic?.lastName?.length ?? 0) > 3}>
                {hasMoreThan3Chars => (
                    <div data-testid='reactive-text'>
                        {hasMoreThan3Chars
                            ? 'Last name has more than 3 characters'
                            : 'Last name has less than 3 characters'}
                    </div>
                )}
            </form.subscribe>

            <form.button renderer={ButtonRenderer} />
        </form.context>
    );
}
