import { Node } from "./node";
import { Connection } from "../connection";

export class OutputNode extends Node {
    desiredValue: number = 0;

    constructor() {
        super();
    }

    protected _activate(value: number) {
        return 1/(1+Math.pow(Math.E, (-1 * value)));
    }

    protected _deriveErrorOverOutput() {
        return (this.value - this.desiredValue);
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

    setDesiredValue(desiredValue: number) {
        this.desiredValue = desiredValue;
    }

    clearValue() {
        this.value = 0;
    }
}
