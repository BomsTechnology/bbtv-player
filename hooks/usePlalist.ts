import { CategoryList } from "@/types/playlistType";
import { PlaylistItem } from "iptv-playlist-parser";

type Options = {
  sortCategories?: boolean;
  sortItems?: boolean;
  defaultCategory?: string;
  includeAll?: boolean;
  categorySeparator?: string;
};

export const groupPlaylistByCategory = (
  items: PlaylistItem[],
  options: Options = {}
): CategoryList[] => {
  const {
    sortCategories = true,
    sortItems = false,
    defaultCategory = "Other",
    includeAll = true,
    categorySeparator = ";",
  } = options;

  if (!items?.length) return [];

  const groupsMap = new Map<string, CategoryList>();
  const allItems: PlaylistItem[] = [];

  for (const item of items) {
    allItems.push(item);

    const raw = item.group?.title?.trim() || defaultCategory;

    // FIX: split multi-categories correctly
    const categories = raw
      .split(categorySeparator)
      .map(c => c.trim().toLowerCase())
      .filter(Boolean);

    const finalCategories = categories.length ? categories : [defaultCategory.toLowerCase()];

    for (const category of finalCategories) {
      let group = groupsMap.get(category);
      if (!group) {
        group = { category, items: [] };
        groupsMap.set(category, group);
      }
      group.items?.push(item);
    }
  }

  let groups = Array.from(groupsMap.values());

  // Sort categories alphabetically (keep "other" last)
  if (sortCategories) {
    groups.sort((a, b) => {
      if (a.category === defaultCategory.toLowerCase()) return 1;
      if (b.category === defaultCategory.toLowerCase()) return -1;
      return a.category.localeCompare(b.category, undefined, { sensitivity: "base" });
    });
  }

  // Sort items inside categories
  if (sortItems) {
    for (const g of groups) {
      g.items?.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
      );
    }
  }

  // Add "All" category safely
  if (includeAll) {
    const all = sortItems
      ? [...allItems].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
        )
      : [...allItems];

    groups.unshift({
      category: "All",
      items: all,
    });
  }

  return groups;
};
