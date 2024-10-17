import { it, expect, beforeEach, vi, afterEach, assert, describe } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

// To Test
import userEvent from '@testing-library/user-event';
import { FilterForm } from '../FilterForm';
import { NetworkForm } from '../../network-form/NetworkForm';

describe('Validate form with default behaviour', () => {
    // Define handles
    let startDateField: HTMLElement;
    let endDateField: HTMLElement;
    let startDateErrors: HTMLElement;
    let endDateErrors: HTMLElement;

    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        render(<FilterForm onSubmit={onSubmit} validationBehaviour='default' />);

        // Get the inputs
        startDateField = screen.getByTestId('startDate-field');
        endDateField = screen.getByTestId('endDate-field');

        // Get the errors
        startDateErrors = screen.getByTestId('startDate-errors');
        endDateErrors = screen.getByTestId('endDate-errors');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should have no errors upon initialization', async () => {
        expect(startDateErrors.childElementCount).toBe(0);
        expect(endDateErrors.childElementCount).toBe(0);
    });

    it('Should trigger immediate validation upon first input blur', async () => {
        // Get inner picker inputs
        const startDateInput = startDateField.querySelector('input');
        const endDateInput = endDateField.querySelector('input');

        // Expect them to be defined
        assert(startDateInput);
        assert(endDateInput);

        // Check that date selector is not open
        let days = startDateField.querySelectorAll('.react-datepicker__day');
        expect(days.length).toBe(0);

        // Click to open start date selector & select last day of month
        await userEvent.click(startDateInput);
        days = startDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[days.length - 1]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Click to open start date selector & select last day of month
        await userEvent.click(startDateInput);
        days = startDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[days.length - 1]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Open end date selector & select first day of month
        await userEvent.click(endDateInput);
        days = endDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[0]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Blur input
        fireEvent.blur(endDateInput);
        expect(endDateErrors.childElementCount).toBe(1);
    });
});

describe('Validate form with immediate behaviour', () => {
    // Define handles
    let startDateField: HTMLElement;
    let endDateField: HTMLElement;
    let startDateErrors: HTMLElement;
    let endDateErrors: HTMLElement;

    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        render(<FilterForm onSubmit={onSubmit} validationBehaviour='immediate' />);

        // Get the inputs
        startDateField = screen.getByTestId('startDate-field');
        endDateField = screen.getByTestId('endDate-field');

        // Get the errors
        startDateErrors = screen.getByTestId('startDate-errors');
        endDateErrors = screen.getByTestId('endDate-errors');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should have no errors upon initialization', async () => {
        expect(startDateErrors.childElementCount).toBe(0);
        expect(endDateErrors.childElementCount).toBe(0);
    });

    it('Should trigger immediate validation upon first value change', async () => {
        // Get inner picker inputs
        const startDateInput = startDateField.querySelector('input');
        const endDateInput = endDateField.querySelector('input');

        // Expect them to be defined
        assert(startDateInput);
        assert(endDateInput);

        // Check that date selector is not open
        let days = startDateField.querySelectorAll('.react-datepicker__day');
        expect(days.length).toBe(0);

        // Click to open start date selector & select last day of month
        await userEvent.click(startDateInput);
        days = startDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[days.length - 1]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Click to open start date selector & select last day of month
        await userEvent.click(startDateInput);
        days = startDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[days.length - 1]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Open end date selector & select first day of month
        await userEvent.click(endDateInput);
        days = endDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[0]);
        expect(endDateErrors.childElementCount).toBe(1);
    });
});

describe('Validate form with onSubmit behaviour', () => {
    // Define handles
    let startDateField: HTMLElement;
    let endDateField: HTMLElement;
    let submitButton: HTMLButtonElement;
    let startDateErrors: HTMLElement;
    let endDateErrors: HTMLElement;

    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        render(<FilterForm onSubmit={onSubmit} validationBehaviour='onSubmit' initiallyDisabled />);

        // Get the inputs
        startDateField = screen.getByTestId('startDate-field');
        endDateField = screen.getByTestId('endDate-field');

        // Get the errors
        startDateErrors = screen.getByTestId('startDate-errors');
        endDateErrors = screen.getByTestId('endDate-errors');

        // Get submit button
        submitButton = screen.getByTestId('submit-button');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should have no errors upon initialization', async () => {
        expect(startDateErrors.childElementCount).toBe(0);
        expect(endDateErrors.childElementCount).toBe(0);
    });

    it('Should validate only on submit', async () => {
        // Get inner picker inputs
        const startDateInput = startDateField.querySelector('input');
        const endDateInput = endDateField.querySelector('input');

        // Expect them to be defined
        assert(startDateInput);
        assert(endDateInput);

        // Check that date selector is not open
        let days = startDateField.querySelectorAll('.react-datepicker__day');
        expect(days.length).toBe(0);

        // Click to open start date selector & select last day of month
        await userEvent.click(startDateInput);
        days = startDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[days.length - 1]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Click to open start date selector & select last day of month
        await userEvent.click(startDateInput);
        days = startDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[days.length - 1]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Open end date selector & select first day of month
        await userEvent.click(endDateInput);
        days = endDateField.querySelectorAll('.react-datepicker__day');
        await userEvent.click(days[0]);
        expect(endDateErrors.childElementCount).toBe(0);

        // Blur
        fireEvent.blur(endDateInput);
        expect(endDateErrors.childElementCount).toBe(0);

        // Submit
        await userEvent.click(submitButton);
        expect(endDateErrors.childElementCount).toBe(1);
    });
});

describe('Validate pre-compiled form with any behaviour', () => {
    // Define handles
    let ipField: HTMLInputElement;
    let subnetField: HTMLInputElement;
    let ipErrors: HTMLElement;
    let submitButton: HTMLButtonElement;

    const onSubmit = vi.fn();

    beforeEach(() => {
        // Setup
        const { getByTestId } = render(<NetworkForm onSubmit={onSubmit} />);

        // Get the inputs
        ipField = getByTestId('ip-field') as HTMLInputElement;
        subnetField = getByTestId('subnet-field') as HTMLInputElement;

        // Get the errors
        ipErrors = getByTestId('ip-errors');

        // Get buttons
        submitButton = getByTestId('submit-button') as HTMLButtonElement;

        // Check that there are initially no errors
        expect(ipErrors.childElementCount).toBe(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('Should validate after first change', async () => {
        // Button should initially be disabled
        expect(submitButton).toBeDisabled();

        await userEvent.type(ipField, '{backspace}');
        expect(submitButton).toBeEnabled();
    });

    it('Should form be disables if form has not changed ', async () => {
        // Button should initially be disabled
        expect(submitButton).toBeDisabled();

        await userEvent.type(ipField, '{backspace}');
        expect(submitButton).toBeEnabled();

        await userEvent.type(subnetField, '0');
        expect(submitButton).toBeEnabled();

        await userEvent.type(ipField, '0');
        expect(submitButton).toBeEnabled();

        await userEvent.type(subnetField, '{backspace}');
        expect(submitButton).toBeDisabled();
    });
});
