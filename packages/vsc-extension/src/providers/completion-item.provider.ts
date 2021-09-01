import { Chars, tags } from "@sylo-digital/titanscript-parser";
import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";
import { formatTag } from "../helpers/format-tag.helper";
import { getTagDocumentation } from "../helpers/get-tag-documentation.helper";

export class TitanScriptCompletionItemProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[]> {
    const prefix = document.lineAt(position).text.substr(0, position.character);
    if (prefix.startsWith(Chars.TagOpen)) {
      const query = prefix.slice(Chars.TagOpen.length);
      const matching = tags.filter((tag) => tag.name.startsWith(query));
      return matching.map((tag) => {
        const kind = tag.args[0]
          ? tag.conditionalParsing
            ? CompletionItemKind.Keyword
            : CompletionItemKind.Method
          : CompletionItemKind.Variable;

        const item = new CompletionItem({ label: tag.name }, kind);
        item.detail = formatTag(tag);
        item.documentation = getTagDocumentation(tag);
        const closeChar = tag.args[0] ? Chars.Separator : Chars.TagClose;
        item.insertText = `${tag.name}${closeChar}`;
        return item;
      });
    }
  }
}
