import { Meta, StoryFn } from '@storybook/react';

import { NestedSubscribeForm } from './NestedSubscribeForm';

export default {
    title: 'NestedSubscribeForm',
    component: NestedSubscribeForm
} as Meta<typeof NestedSubscribeForm>;

const Template: StoryFn<typeof NestedSubscribeForm> = () => (
    <NestedSubscribeForm onSubmit={value => console.log('Submitting', value)} />
);

export const Primary = Template.bind({});
