import { it, expect, beforeEach, vi, afterEach, describe } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// To Test
import { LoginForm } from '../LoginForm';

describe('Validate form without initial values', () => {
    // Define handles
    let emailField: HTMLInputElement;
    let passwordField: HTMLInputElement;
    let submitButton: HTMLButtonElement;
    let emailErrors: HTMLElement;
    let passwordErrors: HTMLElement;
    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(<LoginForm onSubmit={onSubmit} />);

        // Get the inputs
        emailField = getByTestId('email-field') as HTMLInputElement;
        passwordField = getByTestId('password-field') as HTMLInputElement;

        // Get the errors
        emailErrors = getByTestId('email-errors');
        passwordErrors = getByTestId('password-errors');

        // Get submit button
        submitButton = getByTestId('submit-button') as HTMLButtonElement;

        // Check that there are initially no errors
        expect(emailErrors.childElementCount).toBe(0);
        expect(passwordErrors.childElementCount).toBe(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should show validation error on first blur', async () => {
        // Type an invalid string in the email field
        await userEvent.type(emailField, 'invalid.email');

        // Check that no errors has appeared
        expect(emailErrors.childElementCount).toBe(0);

        // Blur and check for errors
        fireEvent.blur(emailField);
        expect(emailErrors.childElementCount).toBe(1);

        // Check that password has still no errors
        expect(passwordErrors.childElementCount).toBe(0);
    });

    it('Should not show validation error on first blur if nothing has been typed', async () => {
        // Focus the element
        fireEvent.focus(emailField);

        // Blur and check for errors
        fireEvent.blur(emailField);

        // Expect element to not have been validated
        expect(emailErrors.childElementCount).toBe(0);

        // Type a password
        await userEvent.type(passwordField, 'invalid');
        fireEvent.blur(emailField);

        // Email should still not be validated
        expect(emailErrors.childElementCount).toBe(0);
    });

    it('Should show validation error on first blur using tab key', async () => {
        // Type an invalid string in the email field
        await userEvent.type(emailField, 'invalid.email');

        // Check that no errors has appeared
        expect(emailErrors.childElementCount).toBe(0);

        // Tab and check for errors
        await userEvent.tab();
        expect(emailErrors.childElementCount).toBe(1);

        // Check that password has still no errors
        expect(passwordErrors.childElementCount).toBe(0);
    });

    it('Should update realtime validation errors after first blur', async () => {
        // Type an invalid string in the email field
        await userEvent.type(emailField, 'invalid.email');

        // Blur
        fireEvent.blur(emailField);
        expect(emailErrors.childElementCount).toBe(1);

        // Type an invalid string in the email field
        await userEvent.type(emailField, '@valid.com');
        expect(emailErrors.childElementCount).toBe(0);
    });

    it('Should validate immediately upon render', async () => {
        expect(submitButton).toBeDisabled();
    });

    it('Should trigger validation only with form complete', async () => {
        // Check initial state
        expect(submitButton).toBeDisabled();
        expect(onSubmit).not.toHaveBeenCalled();

        // Submit form
        fireEvent.focus(emailField);
        await userEvent.keyboard('{enter}');

        // Check state after submission
        expect(submitButton).toBeDisabled();
        expect(onSubmit).not.toHaveBeenCalled();
        expect(emailErrors.childElementCount).toBe(0);
        expect(passwordErrors.childElementCount).toBe(0);
    });

    it('Should disable submit button when necessary', async () => {
        // Button should initially be disabled
        expect(submitButton).toBeDisabled();

        // After an invalid input is compiled, button should still be disabled
        await userEvent.type(emailField, 'invalid.email');
        expect(submitButton).toBeDisabled();

        // After only one input is valid, button should still be disabled
        await userEvent.type(emailField, '@valid.com');
        expect(submitButton).toBeDisabled();

        // After second input is valid, button should be enabled
        await userEvent.type(passwordField, 'supersecret');
        expect(submitButton).toBeEnabled();

        // Removing characters should invalidate
        await userEvent.type(passwordField, '{backspace}{backspace}{backspace}{backspace}');
        expect(submitButton).toBeDisabled();

        // Typing characters againg should validate
        await userEvent.type(passwordField, 'cret');
        expect(submitButton).toBeEnabled();
    });

    it('Should be valid after correct submission', async () => {
        // Type a valid email
        await userEvent.type(emailField, 'myname@mail.com');
        await userEvent.type(passwordField, 'supersecret');

        // Check form status
        expect(submitButton).toBeEnabled();
        expect(emailErrors.childElementCount).toBe(0);
        expect(emailErrors.childElementCount).toBe(0);
    });

    it('Should trigger submit function on press when form is valid', async () => {
        // Check that onSubmit has not been called
        expect(onSubmit).not.toHaveBeenCalled();

        // Type a valid email
        await userEvent.type(emailField, 'myname@mail.com');
        await userEvent.type(passwordField, 'supersecret');

        // Check form status
        expect(submitButton).toBeEnabled();
        expect(emailErrors.childElementCount).toBe(0);
        expect(emailErrors.childElementCount).toBe(0);

        // Submit
        await userEvent.keyboard('{enter}');

        // Check onSubmit
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit).toHaveBeenCalledWith({
            email: 'myname@mail.com',
            password: 'supersecret'
        });
    });

    it('Should submit function after button click', async () => {
        // Check that onSubmit has not been called
        expect(onSubmit).not.toHaveBeenCalled();

        // Click when invalid and expect not to have been called
        await userEvent.click(submitButton);
        expect(onSubmit).not.toHaveBeenCalled();

        // Type a valid email
        await userEvent.type(emailField, 'myname@mail.com');
        await userEvent.type(passwordField, 'supersecret');

        // Submit
        await userEvent.click(submitButton);

        // Check onSubmit
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit).toHaveBeenCalledWith({
            email: 'myname@mail.com',
            password: 'supersecret'
        });
    });
});
