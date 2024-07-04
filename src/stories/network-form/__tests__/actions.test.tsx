import { it, expect, beforeEach, vi, afterEach, describe } from 'vitest';
import { act, render } from '@testing-library/react';
import { NetworkForm } from '../NetworkForm';
import userEvent from '@testing-library/user-event';

describe('Validate form actions', () => {
    // Define handles
    let ipField: HTMLInputElement;
    let dhcpField: HTMLInputElement;
    let ipErrors: HTMLElement;
    let submitButton: HTMLButtonElement;
    let setFormButton: HTMLButtonElement;

    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(<NetworkForm onSubmit={onSubmit} />);

        // Get the inputs
        ipField = getByTestId('ip-field') as HTMLInputElement;
        dhcpField = getByTestId('dhcp-field') as HTMLInputElement;

        // Get the errors
        ipErrors = getByTestId('ip-errors');

        // Get buttons
        submitButton = getByTestId('submit-button') as HTMLButtonElement;
        setFormButton = getByTestId('set-form-button') as HTMLButtonElement;

        // Check that there are initially no errors
        expect(ipErrors.childElementCount).toBe(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should update form value after action is dispatched', async () => {
        // Get initial value
        const initialValue = ipField.value;

        // Set form value with button
        await userEvent.click(setFormButton);

        // Make assertions
        expect(initialValue).not.toBe(ipField.value);
        expect(ipErrors.childElementCount).toBe(1);
    });
});
