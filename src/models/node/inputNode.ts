import { Node } from "./node";

export class InputNode extends Node {
    constructor() {
        super();
    }
    
    setValue(value: number) {
        this.value = value;
    }
}
