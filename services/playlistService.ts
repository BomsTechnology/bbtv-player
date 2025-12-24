import parser, { Playlist } from 'iptv-playlist-parser';
export interface CategoryChannel {
  name: string;
  items: string[];
}

export const playlistService = {

  async getPlaylistByUrl( url: string ): Promise<Playlist> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/x-mpegURL, application/vnd.apple.mpegurl, text/plain, */*',
          'User-Agent': 'bbTV/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const m3uText = await response.text();

      if (!m3uText || m3uText.trim().length === 0) {
        throw new Error('Empty response from server');
      }

      if (!m3uText.includes('#EXTM3U') && !m3uText.includes('#EXTINF')) {
        throw new Error('Invalid M3U file format');
      }

      const data = parser.parse(m3uText);

      if (data.items.length === 0) {
        throw new Error('No channels found in playlist');
      }

      return data;

    } catch (error) {
      throw new Error('Unknown error occurred while fetching playlist');
    }
  },

  getCategoryChannels: async (category: string): Promise<string[]> => {
    return [];
  },

}
