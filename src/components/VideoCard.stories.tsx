import type { Meta, StoryObj } from '@storybook/react';

import { VideoCard } from './VideoCard';

const meta = {
  component: VideoCard,
} satisfies Meta<typeof VideoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Shokran',
    videoId: 'ubjrUqGJC6s',
    thumbnails: {
      default: {
        "url": "https://i.ytimg.com/vi/ubjrUqGJC6s/default.jpg",
        "width": 120,
        "height": 90
      }
    }
  }
};
