import { Chars, Tag, tags, getTagByName } from "@sylo-digital/titanscript-parser";
import * as path from "path";
import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  Diagnostic,
  ExtensionContext,
  languages,
  MarkdownString,
  Position,
  TextDocument,
} from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";

let client: LanguageClient;

function getTagDocumentation(tag: Tag): MarkdownString {
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

function formatParameters(tag: Tag) {
  return tag.args.map((arg) => {
    const wrap = arg.required ? ["<", ">"] : ["[", "]"];
    return `${wrap[0]}${arg.name}${wrap[1]}`;
  });
}

function formatTag(tag: Tag) {
  const parameters = formatParameters(tag).join(" ");
  return `${tag.name} ${parameters}`;
}

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
