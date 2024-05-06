import { it, expect, beforeEach, vi, afterEach, assert, describe } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

// To Test
import userEvent from '@testing-library/user-event';
import { FilterForm } from '../FilterForm';

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
