import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { AddUserForm } from './AddUserForm';

export default {
    title: 'AddUserForm',
    component: AddUserForm
} as Meta<typeof AddUserForm>;

const Template: StoryFn<typeof AddUserForm> = () => (
    <AddUserForm onSubmit={value => console.log('Submitting', value)} />
);

export const Primary = Template.bind({});
