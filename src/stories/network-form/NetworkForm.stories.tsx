import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { NetworkForm } from './NetworkForm';

export default {
    title: 'NetworkForm',
    component: NetworkForm
} as Meta<typeof NetworkForm>;

const Template: StoryFn<typeof NetworkForm> = () => (
    <NetworkForm onSubmit={value => console.log('Submitting', value)} />
);

export const Primary = Template.bind({});
