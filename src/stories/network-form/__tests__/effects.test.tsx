import { it, expect, beforeEach, vi, afterEach, describe } from 'vitest';
import { render } from '@testing-library/react';
import { NetworkForm, networkFormEffect, defaultValue } from '../NetworkForm';
import userEvent from '@testing-library/user-event';

describe('Validate form with effects', () => {
    // Define handles
    let ipField: HTMLInputElement;
    let dhcpField: HTMLInputElement;
    let ipErrors: HTMLElement;
    let submitButton: HTMLButtonElement;

    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(<NetworkForm onSubmit={onSubmit} />);

        // Get the inputs
        ipField = getByTestId('ip-field') as HTMLInputElement;
        dhcpField = getByTestId('dhcp-field') as HTMLInputElement;

        // Get the errors
        ipErrors = getByTestId('ip-errors');

        // Get submit button
        submitButton = getByTestId('submit-button') as HTMLButtonElement;

        // Check that there are initially no errors
        expect(ipField.childElementCount).toBe(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should run effects only when needed', async () => {
        // Setup spies
        const shouldActivateSpy = vi.spyOn(networkFormEffect, 'shouldActivate');
        const transformValueSpy = vi.spyOn(networkFormEffect, 'transformValue');
        expect(shouldActivateSpy).not.toHaveBeenCalled();
        expect(transformValueSpy).not.toHaveBeenCalled();

        // Type some invalid values to ip field
        const invalidString = 'invalid';
        await userEvent.type(ipField, invalidString);

        // Make assertions
        expect(shouldActivateSpy).toHaveBeenCalledTimes(invalidString.length);
        expect(transformValueSpy).not.toHaveBeenCalled();

        // Click the dhpc input that should trigger the effect
        await userEvent.click(dhcpField);

        // Check the last returned value of transformValueSpy
        const lastCall = transformValueSpy.mock.results[transformValueSpy.mock.results.length - 1];
        const lastReturnedValue = lastCall.value;
        expect(transformValueSpy).toHaveBeenCalledTimes(1);
        expect(transformValueSpy).toHaveBeenCalledWith(
            {
                ip: defaultValue.ip + invalidString,
                subnet: defaultValue.subnet,
                gateway: defaultValue.gateway,
                dhcp: false
            },
            {
                ip: defaultValue.ip + invalidString,
                subnet: defaultValue.subnet,
                gateway: defaultValue.gateway,
                dhcp: true
            }
        );

        expect(lastReturnedValue).toEqual({
            value: {
                ...defaultValue,
                dhcp: true
            },
            effectedKeys: ['ip', 'subnet', 'gateway']
        });
    });
});
