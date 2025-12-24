import { PlaylistHeader, PlaylistItem } from "iptv-playlist-parser";

export interface MyCustomPlaylist {
    id: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
    type: "upload" | "url" | "text";
    url?: string;
    text?: string;
    filename?: string;
    header: PlaylistHeader
    items: CategoryList[];
}

export interface CategoryList {
    category: string;
    items?: PlaylistItem[]
}