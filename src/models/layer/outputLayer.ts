import { OutputNode } from "../node/outputNode";
import { Layer } from "./layer";
import { ConnectableLayer } from "./connectableLayer";

export class OutputLayer extends Layer {
    nodes: OutputNode[] = [];
    previousLayer: ConnectableLayer;

    constructor(previousLayer: ConnectableLayer) {
        super();
        this.previousLayer = previousLayer;
    }

    protected _print(label: string) {
        var result = label + "\t = ";
        this.nodes.forEach(node => {
            result += "[" + node.getIndex().toString() + ": " + node.getValue().toString();
            result += " w(" + node.getConnections().map(connection => connection.weight.toString()).join(", ") + ")";
            result += "]";
        });
        console.log(result);
    }

    printValues(label: string) {
        var result = label + "\t = ";
        this.nodes.forEach(node => {
            result += "[" + node.getValue().toFixed(3).toString() + "]";
        });
        console.log(result);
    }

    getOutput(): Array<number> {
        var result = new Array<number>();
        this.nodes.forEach(node => {
            result.push(node.getValue());
        });
        return result;
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

    addNode(node: OutputNode, weights: Array<number> | undefined = undefined) {
        node.connectToAll(this.previousLayer, weights);
        super._addNode(node);
    }

    forwardPropogate() {
        this.nodes.forEach(node => {
            node.forwardPropogate();
        }); 
    }

    setDesiredValues(desiredValues: number[]) {
        this.nodes.forEach((node, index) => {
            node.setDesiredValue(desiredValues[index]);
        });
    }
    
    backPropogate(learningRate: number) {
        this.nodes.forEach(node => {
            node.getConnections().forEach(connection => {
                connection.adjustment = (learningRate * node.deriveErrorOverWeight(connection));
            });
        });
    }

    clearValues() {
        this.nodes.forEach(node => {
            node.clearValue();
        });
    }
}