import { NodeType } from "./constants";

export interface Node {
  text: string;
  type: NodeType;
  index: number;
  parent?: Node;
  children: Node[];
}
