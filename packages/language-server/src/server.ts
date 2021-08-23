import { getNodeDepth, getTagFromNode, Lexer, Node, NodeType } from "@sylo-digital/titanscript-parser";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  createConnection,
  Diagnostic,
  DiagnosticSeverity,
  InitializeParams,
  ProposedFeatures,
  TextDocumentChangeEvent,
  TextDocuments,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const text = textDocument.getText();
  const diagnostics: Diagnostic[] = [];
  const lexer = new Lexer(text);
  const result = lexer.parse();

  const handle = (node: Node) => {
    if (node.type === NodeType.Call) {
      const tag = getTagFromNode(node);
      if (!tag) {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          message: `Unknown tag "${node.text.toLowerCase()}"`,
          range: {
            start: textDocument.positionAt(node.index + 1),
            end: textDocument.positionAt(node.index + node.text.length + 1),
          },
        });
      } else {
        const hasSpreadArg = tag.args.some((tag) => tag.spread);
        const required = tag.args.filter((arg) => arg.required);
        const minimumArgs = required.length;
        const maximumArgs = tag.args.length;
        const actualArgs = node.children.length;
        if (!hasSpreadArg && (minimumArgs > actualArgs || maximumArgs < actualArgs)) {
          const areAllRequired = required.length !== tag.args.length;
          const expected = areAllRequired ? `${required.length}-${tag.args.length}` : tag.args.length;
          diagnostics.push({
            severity: DiagnosticSeverity.Error,
            message: `Expected ${expected} arguments, got ${actualArgs}`,
            range: {
              start: textDocument.positionAt(node.index + 1),
              end: textDocument.positionAt(node.index + node.text.length + 1),
            },
          });
        }
      }
    }

    for (const child of node.children) {
      handle(child);
    }
  };

  handle(result);
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onInitialize((params: InitializeParams) => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
    },
  };
});

documents.onDidChangeContent((change: TextDocumentChangeEvent<TextDocument>) => {
  validateTextDocument(change.document);
});

documents.listen(connection);
connection.listen();
