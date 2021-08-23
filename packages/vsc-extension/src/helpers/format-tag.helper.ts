import { Tag } from "@sylo-digital/titanscript-parser/src/types";
import { formatParameters } from "./format-parameter.helper";

export function formatTag(tag: Tag) {
  const parameters = formatParameters(tag).join(" ");
  return `${tag.name} ${parameters}`;
}
