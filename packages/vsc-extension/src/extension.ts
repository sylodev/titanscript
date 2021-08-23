import path from "path";
import { ExtensionContext, languages } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";
import { TitanScriptCompletionItemProvider } from "./providers/completion-item.provider";
import { TitanScriptHoverProvider } from "./providers/hover.provider";

let client: LanguageClient;
const TITANSCRIPT_MODE = "titanscript";

export function activate(context: ExtensionContext) {
  languages.registerHoverProvider(TITANSCRIPT_MODE, new TitanScriptHoverProvider());
  languages.registerCompletionItemProvider(TITANSCRIPT_MODE, new TitanScriptCompletionItemProvider(), "{");

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

  client = new LanguageClient(TITANSCRIPT_MODE, "TitanScript", serverOptions, clientOptions);
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) return undefined;
  return client.stop();
}
