import { Node } from "../node";

export function getNodeDepth(node: Node) {
  let depth = 0;
  let current = node.parent;
  while (current) {
    depth += 1;
    current = current.parent;
  }

  return depth;
}
