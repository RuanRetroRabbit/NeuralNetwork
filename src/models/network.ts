import { HiddenLayer } from "./layer/hiddenLayer";
import { InputLayer } from "./layer/inputLayer";
import { InputNode } from "./node/inputNode";
import { HiddenNode } from "./node/hiddenNode";
import { Layer } from "./layer/layer";
import { OutputLayer } from "./layer/outputLayer";
import { OutputNode } from "./node/outputNode";

var fs = require('fs');

export class Network {
    private inputLayer: InputLayer | undefined;
    private outputLayer: OutputLayer | undefined;
    private hiddenLayers: HiddenLayer[] | undefined;

    private desiredValues: number[] | undefined;
    private learningRate: number | undefined;

    private numberOfHiddenLayers: number | undefined; 
    private nodesPerHiddenLayer: number | undefined; 

    private nodesInInputLayer: number | undefined; 
    private nodesInOutputLayer: number | undefined; 
    
    setNumberOfHiddenLayers(value: number) {
        this.numberOfHiddenLayers = value;
    }
    
    setNumberOfNodesInHiddenLayers(value: number) {
        this.nodesPerHiddenLayer = value;
    }
    
    setNumberOfNodesInInputLayer(value: number) {
        this.nodesInInputLayer = value;
    }

    setNumberOfNodesInOutputLayer(value: number) {
        this.nodesInOutputLayer = value;
    }

    build() {
        if(this.nodesInInputLayer == undefined) {
            console.error("set number of nodes in input layer");
            return;
        }
        if(this.numberOfHiddenLayers == undefined) {
            console.error("set number of hidden layers");
            return;
        }
        if(this.nodesPerHiddenLayer == undefined) {
            console.error("set number of nodes per hidden layer");
            return;
        }
        if(this.nodesInOutputLayer == undefined) {
            console.error("set number of nodes in output layer");
            return;
        }

        this.inputLayer = new InputLayer();
        for(var node = 0; node < this.nodesInInputLayer; node++) {
            this.inputLayer.addNode(new InputNode());
        }

        this.hiddenLayers = [];
        var previousLayer: Layer = this.inputLayer;
        for(var layer = 0; layer < this.numberOfHiddenLayers; layer++) {
            var hiddenLayer = new HiddenLayer(previousLayer);
            for(var node = 0; node < this.nodesPerHiddenLayer; node++) {
                hiddenLayer.addNode(new HiddenNode());
            }
            this.hiddenLayers.push(hiddenLayer);
            previousLayer = hiddenLayer;
        }
        
        this.outputLayer = new OutputLayer(previousLayer);
        for(var node = 0; node < this.nodesInOutputLayer; node++) {
            this.outputLayer.addNode(new OutputNode());
        }
    }

    setLearningRate(value: number) {
        this.learningRate = value;
    }

    setdesiredValues(values: number[]) {
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return;
        }
        if(values.length != this.outputLayer.nodes.length) {
            console.error("values must equal number of output nodes");
            return;
        }

        this.desiredValues = values;
        this.outputLayer.setDesiredValues(this.desiredValues);
    }

    run(values: number[]) {
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return;
        }
        if(values.length != this.inputLayer.nodes.length) {
            console.error("values must equal number of input nodes");
            return;
        }

        for(var i = 0; i < values.length; i++) {
            this.inputLayer.nodes[i].setValue(values[i]);
        }
        this.hiddenLayers.forEach(layer => {
            layer.forwardPropogate();
        });
        this.outputLayer.forwardPropogate();
    }

    getOutput(): Array<number> | undefined {
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return undefined;
        }

        return this.outputLayer?.getOutput();
    }

    train(values: number[]) {
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return;
        }
        if(this.desiredValues == undefined || this.desiredValues.length != this.outputLayer.nodes.length) {
            console.error("set desired values");
            return;
        }
        if(this.learningRate == undefined || this.learningRate == 0) {
            console.error("set learning rate");
            return;
        }

        this.run(values);
        this.outputLayer.backPropogate(this.learningRate);
        this.hiddenLayers.reverse().forEach(layer => {
            layer.backPropogate(this.learningRate || 0);
        });
        this.outputLayer.updateWeights();
        this.hiddenLayers.reverse().forEach(layer => {
            layer.updateWeights();
        });
        this.outputLayer.clearValues();
    }

    print(expectedValues: Array<number> | undefined = undefined) {
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return;
        }
        if(expectedValues != undefined) {
            if(expectedValues.length != this.outputLayer.nodes.length) {
                console.error("expected values must equal number of output nodes");
                return;
            }
        }

        this.inputLayer.print("(I)");
        this.hiddenLayers.forEach((hiddenLayer, index) => {
            hiddenLayer.print("(H:" + (index + 1) + ")");
        });
        this.outputLayer.print("(O)");
        if(expectedValues != undefined) {
            var result = "(E)\t = ";
            expectedValues.forEach((value, index) => {
                result += "[" + index.toString() + ": " + value.toString() + "]";
            });
            console.log(result);
        }
        console.log("");
    }
    
    printValues(expectedValues: Array<number> | undefined = undefined) {
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return;
        }
        if(expectedValues != undefined) {
            if(expectedValues.length != this.outputLayer.nodes.length) {
                console.error("expected values must equal number of output nodes");
                return;
            }
        }

        this.inputLayer.printValues("(I)");
        this.outputLayer.printValues("(O)");
        if(expectedValues != undefined) {
            var result = "(E)\t = ";
            expectedValues.forEach((value) => {
                result += "[" + value.toString() + "]"
            });
            console.log(result);
        }
        console.log("");
    }
    
    save(modelName: string): string {   
        if(this.inputLayer == undefined || this.hiddenLayers == undefined || this.outputLayer == undefined) {
            console.error("build or load network");
            return "";
        }

        try {
            if (fs.existsSync("models/" + modelName+".model")) {
                var exists = true;
                var counter = 2;
                while(exists) {
                    if (fs.existsSync("models/" + modelName+" ("+counter.toString()+").model")) {
                        counter++;
                    } else {
                        modelName += " ("+counter.toString()+")";
                        exists = false;
                    }
                }
            }
        } catch(err) {
            console.error(err)
        }
        
        var filename = "models/" + modelName;
        filename += ".model";

        var content = "";

        content += [this.learningRate, this.numberOfHiddenLayers, this.nodesPerHiddenLayer, this.nodesInInputLayer, this.nodesInOutputLayer].join("\n");

        this.hiddenLayers.forEach((layer) => {
            content += "\n" + layer.getWeights().join("\n");
        });

        content += "\n" + this.outputLayer.getWeights().join("\n");

        try {  
            fs.writeFileSync(filename, content);
        } catch(err) {
            if (err) throw err;
        }
        
        console.log('Saved ' + modelName);

        return modelName;
    }

    load(modelName: string) {   
        if(this.inputLayer != undefined || this.hiddenLayers != undefined || this.outputLayer != undefined) {
            console.error("model already built");
            return;
        }

        var filename = "models/" + modelName;
        filename += ".model";

        var values: Array<number> = [];

        try {  
            var data = fs.readFileSync(filename, 'utf8');
            data.toString().split("\n").map((value: string, index: number) => {
                var numericValue = Number(value);
                if(!Number.isNaN(numericValue)) {
                    values.push(numericValue);
                } else {
                    console.error("value is not a number (Line " + index + ")");
                    return;
                }
            });
            console.log('Loaded ' + modelName);
        } catch(err) {
            if (err) throw err;
        }

        var expectedSize = 5;
        expectedSize += values[3] * values[2];
        for(var h = 1; h < values[1]; h++) {
            expectedSize += values[2] * values[2];
        }
        expectedSize += values[2] * values[4];

        if(values.length != expectedSize) {
            console.log("data is corrupted");
            return;
        }

        this.learningRate = values[0];
        this.numberOfHiddenLayers = values[1];
        this.nodesPerHiddenLayer = values[2];
        this.nodesInInputLayer = values[3];
        this.nodesInOutputLayer = values[4];

        var position = 5;

        this.inputLayer = new InputLayer();
        for(var node = 0; node < this.nodesInInputLayer; node++) {
            this.inputLayer.addNode(new InputNode());
        }

        this.hiddenLayers = [];
        var previousLayer: Layer = this.inputLayer;
        for(var layer = 0; layer < this.numberOfHiddenLayers; layer++) {
            var hiddenLayer = new HiddenLayer(previousLayer);

            for(var node = 0; node < this.nodesPerHiddenLayer; node++) {
                var weights: Array<number> = [];
                for(var w = 0; w < previousLayer.nodes.length; w++) {
                    weights.push(values[position + w]);
                }
                position += previousLayer.nodes.length;
                hiddenLayer.addNode(new HiddenNode(), weights);
            }
            this.hiddenLayers.push(hiddenLayer);
            previousLayer = hiddenLayer;
        }
        
        this.outputLayer = new OutputLayer(previousLayer);
        for(var node = 0; node < this.nodesInOutputLayer; node++) {
            var weights: Array<number> = [];
            for(var w = 0; w < previousLayer.nodes.length; w++) {
                weights.push(values[position + w]);
            }
            position += previousLayer.nodes.length;
            this.outputLayer.addNode(new OutputNode(), weights);
        }
    }
}
