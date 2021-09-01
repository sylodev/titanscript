import { Chars, NodeType } from "../constants";
import { Node } from "../node";

export function stringifyNode(node: Node) {
  switch (node.type) {
    case NodeType.Text: {
      let output = node.text;
      for (const child of node.children) {
        output += stringifyNode(child);
      }

      return output;
    }
    case NodeType.Call: {
      let output = Chars.TagOpen + node.text;
      for (const child of node.children) {
        output += Chars.Separator + stringifyNode(child);
      }

      output += Chars.TagClose;
      return output;
    }
  }
}
