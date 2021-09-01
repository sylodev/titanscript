import { Lexer, Node } from "@sylo-digital/titanscript-parser";
import { Position, Range, TextDocument } from "vscode";

const padding = 10;

export function getNodeAtPosition(document: TextDocument, position: Position) {
  const start = new Position(position.line, 0);
  const end = new Position(position.line, position.character + padding);
  const range = new Range(start, end);
  const text = document.getText(range);
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

  return { closest, tree };
}
