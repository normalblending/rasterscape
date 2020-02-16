import * as React from "react";
import {bindDrawFunctions} from "../../../utils/bezier";
import {imageDataToCanvas} from "../../../utils/canvas/helpers/imageData";

export interface ImageDataProps {
    width: number
    height: number
    imageData: ImageData
}

export interface ImageDataState {

}

export class ImageDataCanvas extends React.PureComponent<ImageDataProps, ImageDataState> {
    canvasRef;
    drawFunctions;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    draw = () => {
        const {width, height, imageData} = this.props;
        const canvas = this.canvasRef.current;
        const context = canvas.getContext("2d");
        context.drawImage(imageDataToCanvas(imageData), 0, 0, width, height);
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
        const {width, height} = this.props;
        return (
            <canvas
                className={"canvas-by-draw-function"}
                width={width}
                height={height}
                ref={this.canvasRef}/>
        );
    }
}