import { it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// To Test
import { LoginFormWithRenderCounts } from '../LoginFormWithRenderCounts';
import userEvent from '@testing-library/user-event';

// Define handles
let emailField: HTMLInputElement;
let passwordField: HTMLInputElement;
let submitButton: HTMLButtonElement;
let emailErrors: HTMLElement;
let passwordErrors: HTMLElement;
const onSubmit = vi.fn();

let contextRenderCount = 0;
let emailFieldRenderCount = 0;
let passwordFieldRenderCount = 0;
const onContextRenderCount = () => contextRenderCount++;
const onEmailFieldRenderCount = () => emailFieldRenderCount++;
const onPasswordFieldRenderCount = () => passwordFieldRenderCount++;

beforeEach(() => {
    // Setup
    render(
        <LoginFormWithRenderCounts
            onSubmit={onSubmit}
            onContextRenderCount={onContextRenderCount}
            onEmailFieldRenderCount={onEmailFieldRenderCount}
            onPasswordFieldRenderCount={onPasswordFieldRenderCount}
        />
    );

    // Get the inputs
    emailField = screen.getByTestId('email-field');
    passwordField = screen.getByTestId('password-field');

    // Get the errors
    emailErrors = screen.getByTestId('email-errors');
    passwordErrors = screen.getByTestId('password-errors');

    // Get submit button
    submitButton = screen.getByTestId('submit-button');

    // Check that there are initially no errors
    expect(emailErrors.childElementCount).toBe(0);
    expect(passwordErrors.childElementCount).toBe(0);
});

afterEach(() => {
    vi.restoreAllMocks();
    contextRenderCount = 0;
    emailFieldRenderCount = 0;
    passwordFieldRenderCount = 0;
});

it('Should render ony one time upon initialization', async () => {
    expect(contextRenderCount).toBe(1);
    expect(emailFieldRenderCount).toBe(1);
    expect(passwordFieldRenderCount).toBe(1);
});

it('Should render only effected input once per keystroke', async () => {
    // Type inside the input
    const inputString = 'email';
    await userEvent.type(emailField, 'email');

    // Check render counts
    expect(contextRenderCount).toBe(1);
    expect(emailFieldRenderCount).toBe(1 + inputString.length);
    expect(passwordFieldRenderCount).toBe(1);
});

it.skip('Should render only two times when loading');
