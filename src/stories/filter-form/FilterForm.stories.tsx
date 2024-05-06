import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { FilterForm } from './FilterForm';

export default {
    title: 'FilterForm',
    component: FilterForm
} as Meta<typeof FilterForm>;

const Template: StoryFn<typeof FilterForm> = () => (
    <FilterForm
        onSubmit={value => console.log('Submitting', value)}
        validationBehaviour='onSubmit'
        initiallyDisabled
    />
);

export const Primary = Template.bind({});
