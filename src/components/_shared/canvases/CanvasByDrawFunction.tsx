import * as React from "react";
import {bindDrawFunctions} from "../../../utils/bezier";

export interface CanvasByDrawFunctionProps {
    width: number
    height: number
    children({canvas, context, drawFunctions})

}

export interface CanvasByDrawFunctionState {

}

export class CanvasByDrawFunction extends React.Component<CanvasByDrawFunctionProps, CanvasByDrawFunctionState> {

    canvasRef;
    drawFunctions;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    draw = () => {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext("2d");
        this.props.children({canvas, context, drawFunctions: this.drawFunctions});
    };

    componentDidMount(): void {
        if (this.canvasRef.current) {

            this.drawFunctions = bindDrawFunctions(this.canvasRef.current);

            this.draw();
            // handleInteraction(this.canvasRef.current, this.curve).onupdate = this.handleUpdate
        }
    }

    componentDidUpdate(): void {

        this.drawFunctions.reset();
        this.draw();
        // this.canvasRef.current.canvasRef.setImageData(crea)
    }

    render() {
        const {width = 120, height = 100} = this.props;
        return (
            <canvas
                className={"canvas-by-draw-function"}
                width={width}
                height={height}
                ref={this.canvasRef}/>
        );
    }
}