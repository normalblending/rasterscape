import * as React from "react";
import {useRef} from "react";

export interface WebWorkerCanvasProps {
    width: number
    height: number

}

export const WebWorkerCanvas: React.FC<WebWorkerCanvasProps> = ({width, height}) => {

    const canvasRef = useRef(null);

    return (
        <canvas
            className={"canvas-image-data"}
            width={width}
            height={height}
            ref={canvasRef}/>
    );
};