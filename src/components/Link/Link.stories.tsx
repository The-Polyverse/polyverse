import type { Meta, StoryObj } from '@storybook/react';

import Link from './Link';

const meta = {
    title: 'Design System/Link',
    component: Link,
    parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
      layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
      children: { control: 'text' },
    },
  } satisfies Meta<typeof Link>;

export default meta;

export const Default: StoryObj<typeof Link> = {
  args: {
    children: 'Link',
  },
};
