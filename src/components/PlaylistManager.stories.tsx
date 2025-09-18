import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { PlaylistManager } from "@/components/PlaylistManager";
import { defaultPlaylist } from "@/models/Playlist";

const meta = {
  component: PlaylistManager
} satisfies Meta<typeof PlaylistManager>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { playlists: [defaultPlaylist], selectedPlaylist: defaultPlaylist.id }
};
