import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// To Test
import { AddUserForm } from '../AddUserForm';

describe('Validate form without initial values', () => {
    // Define handles
    let emailField: HTMLInputElement;
    let roleField: HTMLSelectElement;
    let enabledField: HTMLInputElement;
    let firstNameField: HTMLInputElement;
    let lastNameField: HTMLInputElement;
    let ageField: HTMLInputElement;
    let organizationNameField: HTMLInputElement;
    let organizationVatField: HTMLInputElement;
    let submitButton: HTMLButtonElement;
    let emailErrors: HTMLElement;
    let roleErrors: HTMLElement;
    let enabledErrors: HTMLElement;
    let firstNameErrors: HTMLElement;
    let lastNameErrors: HTMLElement;
    let ageErrors: HTMLElement;
    let organizationNameErrors: HTMLElement;
    let organizationVatErrors: HTMLElement;
    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(<AddUserForm onSubmit={onSubmit} defaultEnabled={false} />);

        // Get the inputs
        emailField = getByTestId('email-field') as HTMLInputElement;
        roleField = getByTestId('role-field') as HTMLSelectElement;
        enabledField = getByTestId('enabled-field') as HTMLInputElement;
        firstNameField = getByTestId('anagraphic.firstName-field') as HTMLInputElement;
        lastNameField = getByTestId('anagraphic.lastName-field') as HTMLInputElement;
        ageField = getByTestId('anagraphic.age-field') as HTMLInputElement;
        organizationNameField = getByTestId('organization.name-field') as HTMLInputElement;
        organizationVatField = getByTestId('organization.vat-field') as HTMLInputElement;

        // Get the errors
        emailErrors = getByTestId('email-errors');
        roleErrors = getByTestId('role-errors');
        enabledErrors = getByTestId('enabled-errors');
        firstNameErrors = getByTestId('anagraphic.firstName-errors');
        lastNameErrors = getByTestId('anagraphic.lastName-errors');
        ageErrors = getByTestId('anagraphic.age-errors');
        organizationNameErrors = getByTestId('organization.name-errors');
        organizationVatErrors = getByTestId('organization.vat-errors');

        // Get submit button
        submitButton = getByTestId('submit-button') as HTMLButtonElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should have not popolated initial values', async () => {
        expect(emailField).toHaveValue('');
        expect(enabledField).not.toBeChecked();
        expect(roleField).toHaveValue('no-selection');
        expect(firstNameField).toHaveValue('');
        expect(lastNameField).toHaveValue('');
        expect(ageField).toHaveValue(null);
        expect(organizationNameField).toHaveValue('');
        expect(organizationVatField).toHaveValue('');
    });

    it('Should not have validation errors on initialization', async () => {
        expect(emailErrors.childElementCount).toBe(0);
        expect(roleErrors.childElementCount).toBe(0);
        expect(enabledErrors.childElementCount).toBe(0);
        expect(firstNameErrors.childElementCount).toBe(0);
        expect(lastNameErrors.childElementCount).toBe(0);
        expect(ageErrors.childElementCount).toBe(0);
        expect(organizationNameErrors.childElementCount).toBe(0);
        expect(organizationVatErrors.childElementCount).toBe(0);
    });

    it('Should show nested validation error on first blur', async () => {
        // Type an invalid string in the email field
        await userEvent.type(ageField, '-3');

        // Check that no errors has appeared
        expect(ageErrors.childElementCount).toBe(0);

        // Blur and check for errors
        fireEvent.blur(ageField);
        expect(ageErrors.childElementCount).toBe(1);
    });

    it('Should not show nested validation error on first blur if nothing has been typed', async () => {
        // Focus the element
        fireEvent.focus(firstNameField);

        // Blur and check for errors
        fireEvent.blur(firstNameField);

        expect(firstNameErrors.childElementCount).toBe(0);
    });

    it('Should update realtime validation errors after nested first blur', async () => {
        // Type an invalid string in the email field
        await userEvent.type(lastNameField, 'Ro');

        // Blur
        fireEvent.blur(lastNameField);
        expect(lastNameErrors.childElementCount).toBe(1);

        // Type an invalid string in the lastName field
        await userEvent.type(lastNameField, 'ssi');
        expect(lastNameErrors.childElementCount).toBe(0);
    });

    it('Should validate nested fields', async () => {
        // Type valid top level fields
        await userEvent.type(emailField, 'user@mail.com');
        await userEvent.selectOptions(roleField, 'VIEWER');

        // Check that form is not valid
        expect(submitButton).toBeDisabled();

        // Nested fields validation
        await userEvent.type(firstNameField, 'Mario');
        await userEvent.type(lastNameField, 'Rossi');
        await userEvent.type(ageField, '10');

        // Check that form is valid
        expect(submitButton).toBeEnabled();

        // Delete some chars
        await userEvent.type(firstNameField, '{backspace}{backspace}{backspace}');

        // Check that form is not valid
        expect(submitButton).toBeDisabled();

        // Enable form
        await userEvent.type(firstNameField, 'rio');

        // Check that form is valid and submit works
        expect(submitButton).toBeEnabled();
        await userEvent.keyboard('{enter}');

        // Todo: since form is valid, enter triggers both form submission and onKeyDown submission
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit).toHaveBeenCalledWith({
            anagraphic: {
                age: 10,
                firstName: 'Mario',
                lastName: 'Rossi'
            },
            email: 'user@mail.com',
            enabled: false,
            role: 'VIEWER'
        });
    });
});

describe('Validate empty form with default values', () => {
    // Define handles
    let enabledField: HTMLInputElement;
    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(<AddUserForm onSubmit={onSubmit} defaultEnabled={true} />);

        // Get the inputs
        enabledField = getByTestId('enabled-field') as HTMLInputElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should respect default value', async () => {
        expect(enabledField).toBeChecked();
    });
});

describe('Validate form with initially disabled property', () => {
    // Define handles
    let emailField: HTMLInputElement;
    let roleField: HTMLSelectElement;
    let enabledField: HTMLInputElement;
    let firstNameField: HTMLInputElement;
    let lastNameField: HTMLInputElement;
    let ageField: HTMLInputElement;
    let organizationNameField: HTMLInputElement;
    let organizationVatField: HTMLInputElement;
    let submitButton: HTMLButtonElement;
    let emailErrors: HTMLElement;
    let roleErrors: HTMLElement;
    let enabledErrors: HTMLElement;
    let firstNameErrors: HTMLElement;
    let lastNameErrors: HTMLElement;
    let ageErrors: HTMLElement;
    let organizationNameErrors: HTMLElement;
    let organizationVatErrors: HTMLElement;
    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(
            <AddUserForm onSubmit={onSubmit} defaultEnabled={false} initiallyDisabled />
        );

        // Get the inputs
        emailField = getByTestId('email-field') as HTMLInputElement;
        roleField = getByTestId('role-field') as HTMLSelectElement;
        enabledField = getByTestId('enabled-field') as HTMLInputElement;
        firstNameField = getByTestId('anagraphic.firstName-field') as HTMLInputElement;
        lastNameField = getByTestId('anagraphic.lastName-field') as HTMLInputElement;
        ageField = getByTestId('anagraphic.age-field') as HTMLInputElement;
        organizationNameField = getByTestId('organization.name-field') as HTMLInputElement;
        organizationVatField = getByTestId('organization.vat-field') as HTMLInputElement;

        // Get the errors
        emailErrors = getByTestId('email-errors');
        roleErrors = getByTestId('role-errors');
        enabledErrors = getByTestId('enabled-errors');
        firstNameErrors = getByTestId('anagraphic.firstName-errors');
        lastNameErrors = getByTestId('anagraphic.lastName-errors');
        ageErrors = getByTestId('anagraphic.age-errors');
        organizationNameErrors = getByTestId('organization.name-errors');
        organizationVatErrors = getByTestId('organization.vat-errors');

        // Get submit button
        submitButton = getByTestId('submit-button') as HTMLButtonElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should show immediate validation on enter', async () => {
        // Type valid top level fields
        await userEvent.type(emailField, 'user');
        await userEvent.keyboard('{enter}');

        // Expect errors on all required fields
        expect(emailErrors.childElementCount).toBe(1);
        expect(roleErrors.childElementCount).toBe(1);
        expect(firstNameErrors.childElementCount).toBe(1);
        expect(lastNameErrors.childElementCount).toBe(1);
        expect(ageErrors.childElementCount).toBe(1);
    });
});
