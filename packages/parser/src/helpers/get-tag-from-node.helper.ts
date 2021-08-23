import { NodeType } from "../constants";
import { Node } from "../node";
import { Tag } from "../types";
import { getTagByName } from "./get-tag-by-name.helper";

export function getTagFromNode(node: Node): Tag | null | undefined {
  if (node.type !== NodeType.Call) return null;
  return getTagByName(node.text);
}
