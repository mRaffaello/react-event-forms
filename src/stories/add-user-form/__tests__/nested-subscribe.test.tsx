import { it, describe, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { useForm } from '../../../lib';
import { TextInputRenderer } from '../../common/TextInputRenderers';

const Schema = z.object({
    anagraphic: z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3)
    })
});

function NestedSubscribeForm(props: { onSubscribeRenderCount?: () => void }) {
    const form = useForm(Schema, {
        anagraphic: { firstName: '', lastName: '' }
    });

    return (
        <form.context>
            <form.field property='anagraphic.lastName' renderer={TextInputRenderer} />
            <form.subscribe selector={value => (value?.anagraphic?.lastName?.length ?? 0) > 3}>
                {hasMoreThan3Chars => {
                    props.onSubscribeRenderCount?.();
                    return (
                        <div data-testid='reactive-text'>{hasMoreThan3Chars ? 'more' : 'less'}</div>
                    );
                }}
            </form.subscribe>
        </form.context>
    );
}

describe('Subscribe with nested selector', () => {
    it('Should update the subscribed value when a nested key changes', async () => {
        render(<NestedSubscribeForm />);

        const lastNameField = screen.getByTestId('anagraphic.lastName-field') as HTMLInputElement;
        const reactiveTextDiv = screen.getByTestId('reactive-text');

        expect(reactiveTextDiv).toContainHTML('less');

        await userEvent.type(lastNameField, 'Ross');

        expect(reactiveTextDiv).toContainHTML('more');
    });
});
