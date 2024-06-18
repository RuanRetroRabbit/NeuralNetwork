import { Node } from "./node";
import { Connection } from "../connection";

export class HiddenNode extends Node {
    constructor() {
        super();
    }

    protected _activate(value: number) {
        return 1/(1+Math.pow(Math.E, (-1 * value)));
    }

    protected _deriveErrorOverOutput() {
        var result = 0;
        this.connectionsOut.forEach(connection => {
            result += connection.nodeOut.deriveErrorOverOutput() * connection.nodeOut.deriveOutputOverInput() * connection.weight;
        });
        return result;
    }

    protected _deriveOutputOverInput() {
        return this.value * (1 - this.value);
    }

    protected _deriveInputOverWeight(connection: Connection) {
        return connection.nodeIn.getValue();
    }

    protected _deriveErrorOverWeight(connection: Connection) {
        return this._deriveErrorOverOutput() * this._deriveOutputOverInput() * this._deriveInputOverWeight(connection);
    }

    forwardPropogate() {
        super._forwardPropogate();
    }
}
