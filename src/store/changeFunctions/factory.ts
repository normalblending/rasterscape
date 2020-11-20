import {changeFunctionByType} from "./helpers";

export class ChangeFunctionFactory {

    functions = {};

    getFunction = (id, type) => {
        if (!this.functions[id]) {
            this.functions[id] = changeFunctionByType[type]();
        }

        return this.functions[id];
    };

}


export const changeFunctionFactory = new ChangeFunctionFactory();