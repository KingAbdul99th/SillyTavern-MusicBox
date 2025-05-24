import type { Meta, StoryObj } from "@storybook/react";

import { DrawerContent } from "@/components/DrawerContent";
import { defaultExtensionSettings } from "@/models/ExtensionSettings";

const meta = {
  component: DrawerContent
} satisfies Meta<typeof DrawerContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    extensionSettings: defaultExtensionSettings,
    setExtensionSettings: () => {}
  }
};
