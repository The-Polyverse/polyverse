import type { Meta, StoryObj } from "@storybook/react";

import TextField from "./TextField";

const meta = {
    title: "Design System/TextField",
    component: TextField,
    parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
      layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
      label: { control: "text" },
      description: { control: "text" },
      isRequired: { control: "boolean" },
      isDisabled: { control: "boolean" },
      isReadOnly: { control: "boolean" },
      isInvalid: { control: "boolean" },
    },
  } satisfies Meta<typeof TextField>;

export default meta;

export const Default: StoryObj<typeof TextField> = {
  args: {
    label: "Label",
    description: "Description",
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
  },
};
