import { Tag } from "@sylo-digital/titanscript-parser";

export function formatArgs(tag: Tag) {
  return tag.args.map((arg) => {
    const wrap = arg.required ? ["<", ">"] : ["[", "]"];
    return `${wrap[0]}${arg.name}${wrap[1]}`;
  });
}
