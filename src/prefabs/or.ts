import { Network } from "../models/network";

export class Or {
    private network = new Network();

    load() { 
        this.network.load("or");
    }

    train() {
        this.network.setNumberOfNodesInInputLayer(2);
        this.network.setNumberOfHiddenLayers(2);
        this.network.setNumberOfNodesInHiddenLayers(3);
        this.network.setNumberOfNodesInOutputLayer(1);
        this.network.build();

        this.network.setLearningRate(0.5);

        for(var k = 0; k < 100000; k++) {
            this.network.setdesiredValues([1]);
            this.network.train([1,1]);
            this.network.setdesiredValues([1]);
            this.network.train([1,0]);
            this.network.setdesiredValues([1]);
            this.network.train([0,1]);
            this.network.setdesiredValues([0]);
            this.network.train([0,0]);
        } 
        
        this.network.save("or");
    }

    test() { 
        this.network.run([1,1]);
        // DEBUG: Change to view weights
        // this.network.print([1]);
        this.network.printValues([1]);

        this.network.run([1,0]);
        // DEBUG: Change to view weights
        // this.network.print([1]);
        this.network.printValues([1]);

        this.network.run([0,1]);
        // DEBUG: Change to view weights
        // this.network.print([1]);
        this.network.printValues([1]);

        this.network.run([0,0]);
        // DEBUG: Change to view weights
        // this.network.print([0]);
        this.network.printValues([0]);
    }
}