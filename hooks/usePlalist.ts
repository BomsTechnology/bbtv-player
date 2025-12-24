import { playlistService } from "@/services/playlistService";
import { CategoryList } from "@/types/playlistType";
import { useMutation } from "@tanstack/react-query";
import { PlaylistItem } from "iptv-playlist-parser";

export const useFetchPlaylistUrl = (url: string) => {
    return useMutation({
      mutationFn: () => playlistService.getPlaylistByUrl(url),
      onSuccess: (data, variables, onMutateResult, context) => {
        console.log(data);
      },
    });
};


export const groupPlaylistByCategory = (
  items: PlaylistItem[],
  options?: {
    sortCategories?: boolean;
    sortItems?: boolean;
    defaultCategory?: string;
    includeAll?: boolean; // ✅ Nouvelle option
  }
): CategoryList[] => {
  const { 
    sortCategories = true, 
    sortItems = false,
    defaultCategory = 'Other',
    includeAll = true, // ✅ Par défaut, inclure "All"
  } = options || {};

  if (!items || items.length === 0) return [];

  // Groupement par catégorie
  const groupsMap = items.reduce((acc, item) => {
    const categoryTitle = item.group?.title?.trim() || defaultCategory;
    
    if (!acc[categoryTitle]) {
      acc[categoryTitle] = {
        category: categoryTitle,
        items: [],
      };
    }
    
    acc[categoryTitle].items?.push(item);
    return acc;
  }, {} as Record<string, CategoryList>);

  let groups = Object.values(groupsMap);

  // Tri des catégories
  if (sortCategories) {
    groups = groups.sort((a, b) => {
      // Met "Autre" à la fin
      if (a.category === defaultCategory) return 1;
      if (b.category === defaultCategory) return -1;
      return a.category.localeCompare(b.category);
    });
  }

  if (sortItems) {
    groups.forEach(group => {
      group.items?.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  if (includeAll) {
    const allItems = sortItems 
      ? [...items].sort((a, b) => a.name.localeCompare(b.name))
      : items;

    groups.unshift({
      category: 'All',
      items: allItems,
    });
  }

  return groups;
};

