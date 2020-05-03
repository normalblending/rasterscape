import * as React from "react";
import {bindDrawFunctions} from "../../../utils/bezier";
import {copyImageData, imageDataToCanvas} from "../../../utils/canvas/helpers/imageData";
// import {} from './WebWorkerCanvas/worker'
import {coordHelper} from "../../Area/canvasPosition.servise";

/* eslint import/no-webpack-loader-syntax: off */
const MyWorker = require("worker-loader?name=dist/[name].js!./WebWorkerCanvas/worker");

export interface ImageDataProps {
    width: number
    height: number
    imageData: ImageData
    channel?: string
    from?: number
    scale?: number
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
        const {width, height, imageData, channel, from, scale} = this.props;
        const canvas = this.canvasRef.current;
        const context = canvas.getContext("2d");


        // let worker = new MyWorker();
        // let message = ';;;;;;';
        // worker.onmessage = (ev: MessageEvent) => {
        //
        //
        //     context.drawImage(imageDataToCanvas(imagD), 0, 0, width, height);
        // };
        // worker.postMessage(message);

        let imagD = imageData;
        if (channel) {
            imagD = copyImageData(imageData);
            for (let i = 0; i < imagD.data.length; i += 4) {
                switch (channel) {
                    case 'r':
                        imagD.data[i] = from * 255 + (imagD.data[i] * scale);
                        imagD.data[i + 1] = 0;
                        imagD.data[i + 2] = 0;
                        imagD.data[i + 3] = 255;
                        break;
                    case 'g':
                        imagD.data[i] = 0;
                        imagD.data[i + 1] = from * 255 + (imagD.data[i + 1] * scale);
                        imagD.data[i + 2] = 0;
                        imagD.data[i + 3] = 255;
                        break;
                    case 'b':
                        imagD.data[i] = 0;
                        imagD.data[i + 1] = 0;
                        imagD.data[i + 2] = from * 255 + (imagD.data[i + 2] * scale);
                        imagD.data[i + 3] = 255;
                        break;
                    case 'a':
                        imagD.data[i] = 0;
                        imagD.data[i + 1] = 0;
                        imagD.data[i + 2] = 0;
                        imagD.data[i + 3] = from * 255 + (imagD.data[i + 3] * scale);
                        break;
                }
            }
        }

        context.drawImage(imageDataToCanvas(imagD), 0, 0, width, height);
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
                className={"canvas-image-data"}
                width={width}
                height={height}
                ref={this.canvasRef}/>
        );
    }
}