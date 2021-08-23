import { Chars, NodeType } from "./constants";
import { Node } from "./node";

/**
 * Converts a string to an AST/"tree"
 */
export class Lexer {
  protected position = 0;
  protected current = this.createNode(NodeType.Text);
  constructor(protected script: string) {}

  /**
   * Parse the script into a tree used with the interpreter.
   */
  parse() {
    const length = this.script.length;
    const bail = (char: string) => {
      if (this.current.children[0]) this.down(NodeType.Text);
      this.current.text += char;
    };

    while (this.position < length) {
      const char = this.script[this.position];
      switch (char) {
        case Chars.TagOpen:
          this.down(NodeType.Call);
          break;
        case Chars.Separator: {
          const argParent = this.findParent(NodeType.Call);
          if (!argParent) bail(char);
          else {
            this.current = argParent;
            this.down(NodeType.Text);
          }

          break;
        }
        case Chars.TagClose: {
          const closeParent = this.findParent(NodeType.Call);
          if (!closeParent || !closeParent.parent) bail(char);
          else this.current = closeParent.parent;
          break;
        }
        default:
          bail(char);
      }

      this.position += 1;
    }

    while (this.current.parent) this.up();
    return this.current;
  }

  /**
   * Go down in the tree.
   * @param {NodeType} type The type of node to create when moving down.
   * @private
   */
  protected down(type: NodeType) {
    const node = this.createNode(type);
    node.parent = this.current;
    this.current.children.push(node);
    this.current = node;
  }

  /**
   * Go up in the tree.
   * @private
   */
  protected up() {
    if (!this.current.parent) throw new TypeError("Cannot move to non-existent parent node");
    this.current = this.current.parent;
  }

  /**
   * Find a parent node with the given type. Returns undefined if none exist.
   * @param {NodeType} type The type of node to look for
   * @private
   */
  protected findParent(type: NodeType) {
    let curr = this.current;
    while (curr.type !== type && curr.parent) {
      curr = curr.parent;
    }

    if (curr.type !== type) return;
    return curr;
  }

  /**
   * Create a new node.
   * @param {*} type The type of the node
   * @private
   */
  protected createNode(type: NodeType): Node {
    return {
      type: type,
      index: this.position,
      children: [],
      text: "",
    };
  }
}
