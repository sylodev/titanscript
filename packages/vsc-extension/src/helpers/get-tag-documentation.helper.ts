import { Tag } from "@sylo-digital/titanscript-parser";
import { MarkdownString } from "vscode";

export function getTagDocumentation(tag: Tag): MarkdownString {
  const documentation = new MarkdownString();
  documentation.appendMarkdown(tag.description + "\n\n");
  if (tag.conditionalParsing) documentation.appendMarkdown(`\nUses conditional parsing.`);
  if (tag.aliases[0]) documentation.appendMarkdown(`\nAliases are \`${tag.aliases.join("`, `")}\``);
  if (tag.dependencies[0]) {
    documentation.appendMarkdown(`\nRequires \`${tag.dependencies.join("`, `")}\` to be in context.`);
  }

  for (const example of tag.examples) {
    const output = example.output ? `{note;${example.output}}` : "";
    documentation.appendCodeblock(`${example.input} ${output}`, "titanscript");
  }

  return documentation;
}
