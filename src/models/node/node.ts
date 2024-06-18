import { Connection } from "../connection";
import { ConnectableLayer } from "../layer/connectableLayer";

export class Node {
    //j
    protected index: number = 0;
    //a_j^l
    //activation output of node j in given layer l
    protected value: number = 0;
    //w_j^l
    //total weight of all connections to node j in a given layer l
    //z_j^l
    //total weighted sum of all nodes connected to node j in a given layer l
    protected input: number = 0;
    protected connectionsIn: Connection[];
    protected connectionsOut: Connection[];
    
    protected constructor() {
        this.connectionsIn = [];
        this.connectionsOut = [];
    }

    protected _connectTo(nodeIn: Node, weight: number | undefined = undefined) {
        var connection = new Connection((weight != undefined ? weight : Math.random()), nodeIn, this);
        this.connectionsIn.push(connection);
        nodeIn.connectionsOut.push(connection);
    }

    //g^l
    //activation function used for nodes in given layer l
    protected _activate(value: number) {
        console.log("protected Node._activate should be overriden in extended classed");
        return value;
    }

    protected _forwardPropogate() {
        this.input = 0;
        this.connectionsIn.forEach(connection => {
            this.input += connection.getValue();
        });
        this.value = this._activate(this.input);
    }

    protected _deriveErrorOverWeight(connection: Connection) {
        console.log("protected Node._derivativeErrorOverWeight should be overriden in extended classed");
        return 0;
    }

    //change in C_0
    //_______________
    //change in a_j^L
    //
    //derivative of change in cost over change in activation
    //for given node j in output layer
    protected _deriveErrorOverOutput() {
        console.log("private Node._deriveErrorOverOutput should be overriden in extended classed");
        return 0;
    }

    //change in a_j^L
    //________________
    //change in z_j^L
    //
    //derivative of change in activation over change in input
    //for given node j in output layer
    protected _deriveOutputOverInput() {
        console.log("protected Node._deriveOutputOverInput should be overriden in extended classed");
        return 0;
    }

    //change in z_j^L
    //________________
    //change in w_kj^L
    //
    //derivative of change in input over change in weight
    //for given node j in output layer, and node k in layer L - 1
    protected _deriveInputOverWeight(connection: Connection) {
        console.log("protected Node._deriveInputOverWeight should be overriden in extended classed");
        return 0;
    }

    deriveErrorOverOutput() {
        return this._deriveErrorOverOutput();
    }

    deriveOutputOverInput() {
        return this._deriveOutputOverInput();
    }

    deriveInputOverWeight(connection: Connection) {
        return this._deriveInputOverWeight(connection);
    }

    deriveErrorOverWeight(connection: Connection) {
        return this._deriveErrorOverWeight(connection);
    }

    getValue() {
        return this.value;
    }

    setIndex(value: number) {
        if(value >= 0) {
            this.index = value;
        }
    }

    getIndex() {
        return this.index;
    }

    getConnections() {
        return this.connectionsIn;
    }

    updateWeights() {
        this.connectionsIn.forEach(connection => {
            connection.updateWeight();
        });
    }
    
    connectToAll(previousLayer: ConnectableLayer, weights: Array<number> | undefined = undefined) {
        if(weights == undefined) {
            previousLayer.nodes.forEach(nodeIncoming => {
                this._connectTo(nodeIncoming);
            });
        } else {
            if(weights.length != previousLayer.nodes.length) {
                console.error("number of weights must equal number of nodes");
                return;
            } else {
                previousLayer.nodes.forEach((nodeIncoming, index) => {
                    this._connectTo(nodeIncoming, weights[index]);
                });
            }
        }
    }
}
