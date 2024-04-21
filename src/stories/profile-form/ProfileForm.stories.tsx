import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { ProfileForm } from './ProfileForm';

export default {
    title: 'ProfileForm',
    component: ProfileForm
} as Meta<typeof ProfileForm>;

const Template: StoryFn<typeof ProfileForm> = () => (
    <ProfileForm
        onSubmit={value => console.log('Submitting', value)}
        initialValue={{
            email: '',
            firstName: '',
            lastName: ''
        }}
    />
);

export const Primary = Template.bind({});
