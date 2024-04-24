import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { LoginForm } from './LoginForm';
import { LoginFormWithSubComponent } from './LoginFormWithSubComponent';

export default {
    title: 'LoginForm',
    component: LoginForm
} as Meta<typeof LoginForm>;

const TemplatePrimary: StoryFn<typeof LoginForm> = () => (
    <LoginForm onSubmit={value => console.log('Submitting', value)} />
);
const TemplateWithSubComponent: StoryFn<typeof LoginFormWithSubComponent> = () => (
    <LoginFormWithSubComponent />
);

export const Primary = TemplatePrimary.bind({});
export const WithSubComponent = TemplateWithSubComponent.bind({});
