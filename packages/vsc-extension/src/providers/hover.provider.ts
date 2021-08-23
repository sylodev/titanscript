import { getTagFromNode, Lexer, Node } from "@sylo-digital/titanscript-parser";
import {
  CancellationToken,
  Hover,
  HoverProvider,
  Position,
  ProviderResult,
  TextDocument,
  Range,
  MarkdownString,
} from "vscode";
import { formatTag } from "../helpers/format-tag.helper";
import { getTagDocumentation } from "../helpers/get-tag-documentation.helper";

export class TitanScriptHoverProvider implements HoverProvider {
  provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
    // const text = document.getText();
    // console.log({ text: text.substring(position.character - 10, position.character + 10) });
    const padding = 10;
    const text = document.getText(
      new Range(new Position(position.line, 0), new Position(position.line, position.character + padding))
    );
    const lexer = new Lexer(text);
    const tree = lexer.parse();
    const nodes: Node[] = [];
    const add = (node: Node) => {
      nodes.push(node);
      if (node.children) {
        node.children.forEach(add);
      }
    };

    add(tree);
    const closest = nodes.find((node) => {
      const startIndex = node.index;
      const endIndex = node.index + node.text.length;
      return startIndex <= position.character && position.character <= endIndex;
    });

    if (closest) {
      const tag = getTagFromNode(closest);
      if (tag && tag.name !== "note") {
        const title = formatTag(tag);
        const documentation = getTagDocumentation(tag, false, false);
        const content = new MarkdownString();
        content.appendCodeblock(title, "titanscript");
        content.appendMarkdown(documentation.value);
        return { contents: [content] };
      }
    }
  }
}
