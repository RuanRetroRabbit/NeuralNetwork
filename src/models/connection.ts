import { Node } from "./node/node";

export class Connection {
    //j
    nodeIn: Node;
    //k
    nodeOut: Node;
    //w_jk^(l)
    //weight of connection between node j and node k for a given layer l
    weight: number;
    adjustment: number;

    constructor(weight: number, nodeIn: Node, nodeOut: Node) {
        this.nodeIn = nodeIn;
        this.nodeOut = nodeOut;
        this.weight = weight;
        this.adjustment = 0;
    }

    getValue() {
        return this.nodeIn.getValue() * this.weight;
    }
    
    updateWeight() {
        this.weight -= this.adjustment;
        this.adjustment = 0;
    }
}
