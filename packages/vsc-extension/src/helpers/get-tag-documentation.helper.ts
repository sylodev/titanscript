import { Tag } from "@sylo-digital/titanscript-parser";
import { MarkdownString } from "vscode";

export function getTagDocumentation(tag: Tag, withExamples = true, withDependencies = true): MarkdownString {
  const documentation = new MarkdownString();
  documentation.appendMarkdown(tag.description + "\n\n");
  if (tag.aliases[0]) documentation.appendMarkdown(`\nAliases are \`${tag.aliases.join("`, `")}\``);
  if (tag.dependencies[0] && withDependencies) {
    documentation.appendMarkdown(`\nRequires \`${tag.dependencies.join("`, `")}\` to be in context.`);
  }

  if (withExamples) {
    let data = `{note;Examples}\n`;
    for (const example of tag.examples) {
      const output = example.output ? `{note;${example.output}}` : "";
      data += `${example.input} ${output}\n`;
    }

    if (data) {
      documentation.appendCodeblock(data.trim(), "titanscript");
    }
  }

  return documentation;
}
