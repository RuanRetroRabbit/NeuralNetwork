import { HiddenNode } from "../node/hiddenNode";
import { ConnectableLayer } from "./connectableLayer";

export class HiddenLayer extends ConnectableLayer {
    nodes: HiddenNode[] = [];
    previousLayer: ConnectableLayer;
    
    constructor(previousLayer: ConnectableLayer) {
        super();
        this.previousLayer = previousLayer;
    }

    protected _print(label: string) {
        var result = label + "\t = ";
        this.nodes.forEach(node => {
            result += "[" + node.getIndex().toString() + ": ";
            result += "w(" + node.getConnections().map(connection => connection.weight.toString()).join(", ") + ")";
            result += "]";
        });
        console.log(result);
    }

    getWeights(): Array<number> {
        var result = new Array<number>();
        this.nodes.forEach(node => {
            node.getConnections().map(connection => connection.weight).forEach((weight) => {
                result.push(weight);
            });
        });
        return result;
    }

    addNode(node: HiddenNode, weights: Array<number> | undefined = undefined) {
        node.connectToAll(this.previousLayer, weights);
        super._addNode(node);
    }

    forwardPropogate() {
        this.nodes.forEach(node => {
            node.forwardPropogate();
        });
    }

    backPropogate(learningRate: number) {
        this.nodes.forEach(node => {
            node.getConnections().forEach(connection => {
                connection.adjustment = (learningRate * node.deriveErrorOverWeight(connection));
            });
        });
    }
}