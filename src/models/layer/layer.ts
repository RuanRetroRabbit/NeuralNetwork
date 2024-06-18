import { Node } from "../node/node";

export class Layer {
    nodes: Node[] = [];
    
    protected _addNode(node: Node) {
        node.setIndex(this.nodes.length);
        this.nodes.push(node);
    }

    protected _print(label: string) {
        console.log("protected Layer._print should be overriden by extended classes");
        return;
    }

    print(label: string) {
        this._print(label);
    }
    
    updateWeights() {
        this.nodes.forEach(node => node.updateWeights());
    }
}