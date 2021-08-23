import { Tag } from "../types";
import data from "../data/tags.json";

const tags = new Map<string, Tag>();
for (const tag of data) {
  tags.set(tag.name.toLowerCase(), tag);
  if (tag.aliases) {
    for (const alias of tag.aliases) {
      tags.set(alias.toLowerCase(), tag);
    }
  }
}

export function getTagByName(name: string) {
  const query = name.toLowerCase();
  return tags.get(name);
}
