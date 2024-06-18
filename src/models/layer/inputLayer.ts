import { InputNode } from "../node/inputNode";
import { ConnectableLayer } from "./connectableLayer";

export class InputLayer extends ConnectableLayer {
    nodes: InputNode[] = [];

    protected _print(label: string) {
        var result = label + "\t = ";
        this.nodes.forEach(node => {
            result += "[" + node.getIndex().toString() + ": " + node.getValue().toString();
            result += "]";
        });
        console.log(result);
    }

    printValues(label: string) {
        var result = label + "\t = ";
        this.nodes.forEach(node => {
            result += "[" + node.getValue().toString() + "]";
        });
        console.log(result);
    }
    
    addNode(node: InputNode) {
        super._addNode(node);
    }
}