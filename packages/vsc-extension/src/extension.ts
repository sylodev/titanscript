import { Chars, getTagByName, tags } from "@sylo-digital/titanscript-parser";
import * as path from "path";
import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  ExtensionContext,
  languages,
  Position,
  TextDocument,
} from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";
import { formatTag } from "./helpers/format-tag.helper";
import { getTagDocumentation } from "./helpers/get-tag-documentation.helper";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  languages.registerHoverProvider("titanscript", {
    provideHover(document: TextDocument, position: Position, token: CancellationToken) {
      const text = document.getText();
      console.log({ text: text.substring(position.character - 5, position.character + 5) });
      const beforePosition = text.lastIndexOf(Chars.TagOpen, position.character);
      const afterPositionClose = text.indexOf(Chars.TagClose, position.character);
      const afterPositionSeparator = text.indexOf(Chars.Separator, position.character);
      const afterPositionClosest = Math.min(afterPositionClose, afterPositionSeparator);
      const name = text.substring(beforePosition + 1, afterPositionClosest).trim();
      const tag = getTagByName(name);
      if (tag && tag.name !== "note") {
        const title = formatTag(tag);
        const documentation = getTagDocumentation(tag);
        const content = `**${title}**\n\n${documentation.value}`;
        return { contents: [content] };
      }
    },
  });

  languages.registerCompletionItemProvider(
    "titanscript",
    {
      provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
      ) {
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
      },
    },
    "{"
  );

  const serverModule = context.asAbsolutePath(path.join("../language-server", "dist", "server.js"));
  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ["--nolazy", "--inspect=6009"],
      },
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      {
        language: "titanscript",
      },
      {
        pattern: "*.titanscript",
      },
    ],
  };

  client = new LanguageClient("titanscript", "TitanScript", serverOptions, clientOptions);
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) return undefined;
  return client.stop();
}
