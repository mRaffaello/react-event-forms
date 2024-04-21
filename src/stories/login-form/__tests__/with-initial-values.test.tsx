import { describe, vi, beforeEach, expect, afterEach, it } from 'vitest';
import { LoginForm } from '../LoginForm';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Validate form with correct initial values', () => {
    // Define handles
    let emailField: HTMLInputElement;
    let passwordField: HTMLInputElement;
    let submitButton: HTMLButtonElement;
    let emailErrors: HTMLElement;
    let passwordErrors: HTMLElement;
    const onSubmit = vi.fn();

    const initialValue = {
        email: 'mario.rossi@mail.co',
        password: 'password'
    };

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(
            <LoginForm onSubmit={onSubmit} initialValue={initialValue} />
        );

        // Get the inputs
        emailField = getByTestId('email-field') as HTMLInputElement;
        passwordField = getByTestId('password-field') as HTMLInputElement;

        // Get the errors
        emailErrors = getByTestId('email-errors');
        passwordErrors = getByTestId('password-errors');

        // Get submit button
        submitButton = getByTestId('submit-buttom') as HTMLButtonElement;

        // Check that there are initially no errors
        expect(emailErrors.childElementCount).toBe(0);
        expect(passwordErrors.childElementCount).toBe(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should have initial values', async () => {
        expect(emailField).toHaveValue(initialValue.email);
        expect(passwordField).toHaveValue(initialValue.password);
    });

    it('Should have button disabled without changes', async () => {
        expect(submitButton).toBeDisabled();
    });

    it('Should enable button on first change', async () => {
        await userEvent.type(emailField, 'm');
        expect(submitButton).toBeEnabled();
    });

    it('Should disable button when, even after user interaction, initial form value and current value are the same', async () => {
        await userEvent.type(emailField, 'm');
        expect(submitButton).toBeEnabled();

        await userEvent.type(emailField, '{backspace}');

        expect(submitButton).toBeEnabled();
    });
});

describe('Validate form with incorrect initial values', () => {
    // Define handles
    let emailField: HTMLInputElement;
    let passwordField: HTMLInputElement;
    let submitButton: HTMLButtonElement;
    let emailErrors: HTMLElement;
    let passwordErrors: HTMLElement;
    const onSubmit = vi.fn();

    const initialValue = {
        email: 'mario.rossi',
        password: 'password'
    };

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(
            <LoginForm onSubmit={onSubmit} initialValue={initialValue} />
        );

        // Get the inputs
        emailField = getByTestId('email-field') as HTMLInputElement;
        passwordField = getByTestId('password-field') as HTMLInputElement;

        // Get the errors
        emailErrors = getByTestId('email-errors');
        passwordErrors = getByTestId('password-errors');

        // Get submit button
        submitButton = getByTestId('submit-buttom') as HTMLButtonElement;

        // Check that there are initially no errors
        expect(emailErrors.childElementCount).toBe(0);
        expect(passwordErrors.childElementCount).toBe(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should have button disabled without changes', async () => {
        expect(submitButton).toBeDisabled();
    });

    it('Should keep button disabled on invalid change', async () => {
        await userEvent.type(emailField, '@');
        expect(submitButton).toBeDisabled();
    });

    it('Should enable button when form is valid', async () => {
        await userEvent.type(emailField, '@mail.com');
        expect(submitButton).toBeEnabled();
    });
});
