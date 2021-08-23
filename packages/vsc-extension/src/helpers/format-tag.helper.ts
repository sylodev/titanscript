import { Tag } from "@sylo-digital/titanscript-parser/src/types";
import { formatArgs } from "./format-args.helper";

export function formatTag(tag: Tag) {
  const parameters = formatArgs(tag);
  if (parameters) {
    return `{${tag.name};${parameters.join(";")}}`;
  }

  return `{${tag.name}}`;
}
