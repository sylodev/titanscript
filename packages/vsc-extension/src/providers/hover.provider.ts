import { getTagFromNode } from "@sylo-digital/titanscript-parser";
import {
  CancellationToken,
  Hover,
  HoverProvider,
  MarkdownString,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";
import { formatTag } from "../helpers/format-tag.helper";
import { getNodeAtPosition } from "../helpers/get-node-at-position.helper";
import { getTagDocumentation } from "../helpers/get-tag-documentation.helper";

export class TitanScriptHoverProvider implements HoverProvider {
  provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover> {
    const { closest } = getNodeAtPosition(document, position);
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
