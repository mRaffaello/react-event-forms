import { it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// To Test
import { ProfileFormWithRenderCounts } from '../ProfileFormWithRenderCounts';
import userEvent from '@testing-library/user-event';

// Define handles
let emailField: HTMLInputElement;
let lastNameField: HTMLInputElement;
let submitButton: HTMLButtonElement;
let reactiveTextDiv: HTMLDivElement;
let emailErrors: HTMLElement;
let lastNameErrors: HTMLElement;
const onSubmit = vi.fn();

let contextRenderCount = 0;
let emailFieldRenderCount = 0;
let firstNameFieldRenderCount = 0;
let lastNameFieldRenderCount = 0;
let organizationFieldRenderCount = 0;
let subscribeFieldRenderCount = 0;
const onContextRenderCount = () => contextRenderCount++;
const onEmailFieldRenderCount = () => emailFieldRenderCount++;
const onFirstNameFieldRenderCount = () => firstNameFieldRenderCount++;
const onLastNameFieldRenderCount = () => lastNameFieldRenderCount++;
const onOrganizationFieldRenderCount = () => organizationFieldRenderCount++;
const onSubscribeRenderCount = () => subscribeFieldRenderCount++;

beforeEach(() => {
    // Setup
    render(
        <ProfileFormWithRenderCounts
            onSubmit={onSubmit}
            initialValue={{
                email: '',
                firstName: '',
                lastName: ''
            }}
            onContextRenderCount={onContextRenderCount}
            onEmailFieldRenderCount={onEmailFieldRenderCount}
            onFirstNameFieldRenderCount={onFirstNameFieldRenderCount}
            onLastNameFieldRenderCount={onLastNameFieldRenderCount}
            onOrganizationFieldRenderCount={onOrganizationFieldRenderCount}
            onSubscribeRenderCount={onSubscribeRenderCount}
        />
    );

    // Get the inputs
    emailField = screen.getByTestId('email-field');
    lastNameField = screen.getByTestId('lastName-field');

    // Get the errors
    emailErrors = screen.getByTestId('email-errors');
    lastNameErrors = screen.getByTestId('lastName-errors');

    // Get submit button
    submitButton = screen.getByTestId('submit-button');

    // Get submit button
    reactiveTextDiv = screen.getByTestId('reactive-text');

    // Check that there are initially no errors
    expect(emailErrors.childElementCount).toBe(0);
    expect(lastNameErrors.childElementCount).toBe(0);
});

afterEach(() => {
    vi.restoreAllMocks();
    contextRenderCount = 0;
    emailFieldRenderCount = 0;
    firstNameFieldRenderCount = 0;
    lastNameFieldRenderCount = 0;
    organizationFieldRenderCount = 0;
    subscribeFieldRenderCount = 0;
});

it('Should update the subscribed field according to selector', async () => {
    // Check initial state
    expect(reactiveTextDiv).toContainHTML('less');

    // Inser characters inside last name field
    await userEvent.type(lastNameField, 'Ross');

    // Subscribed field should be updated
    expect(reactiveTextDiv).toContainHTML('more');
});

it('Should render ony one time upon initialization', async () => {
    expect(contextRenderCount).toBe(1);
    expect(emailFieldRenderCount).toBe(1);
    expect(firstNameFieldRenderCount).toBe(1);
    expect(lastNameFieldRenderCount).toBe(1);
    expect(organizationFieldRenderCount).toBe(1);
    expect(subscribeFieldRenderCount).toBe(1);
});

it('Should render subscribed field only when evaluated selector changes', async () => {
    // Type inside the input
    const inputString = 'email';
    await userEvent.type(emailField, 'email');

    // Check render counts
    expect(contextRenderCount).toBe(1);
    expect(emailFieldRenderCount).toBe(1 + inputString.length);
    expect(subscribeFieldRenderCount).toBe(1);

    // Write 3 letters ensure subscribed field has not re rendered
    await userEvent.type(lastNameField, 'Ros');
    expect(subscribeFieldRenderCount).toBe(1);

    // Write one more letter and check that subscribed field has been re rendered
    await userEvent.type(lastNameField, 's');
    expect(subscribeFieldRenderCount).toBe(2);

    // Check that inserting another character will not cause a re render
    await userEvent.type(lastNameField, 's');
    expect(subscribeFieldRenderCount).toBe(2);
});
