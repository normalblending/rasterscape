import * as React from "react";
import {useRef, useEffect, useMemo} from "react";
import {imageDataToCanvas} from "../../../../utils/canvas/helpers/imageData";

/* eslint import/no-webpack-loader-syntax: off */
const ParaboloidWorker = require("worker-loader?name=dist/[name].js!./workers/paraboloid");
const ChannelsWorker = require("worker-loader?name=dist/[name].js!./workers/channels");
const SawWorker = require("worker-loader?name=dist/[name].js!./workers/saw");
const SinWorker = require("worker-loader?name=dist/[name].js!./workers/sin");
const Sis2Worker = require("worker-loader?name=dist/[name].js!./workers/sis2");

export interface WebWorkerCanvasProps {
    width: number
    height: number
    params?: any
    imageData?: ImageData
    [x: string]: any
}

export const webWorkerCanvas = <ParamsType extends any>(Worker): React.FC<WebWorkerCanvasProps> => {
    const WebWorkerCanvas: React.FC<WebWorkerCanvasProps> = ({width, height, params, imageData, ...otherProps}) => {

        const canvasRef = useRef(null);

        const worker = useMemo(() => {
            const worker = new Worker();

            worker.onmessage = (ev: MessageEvent) => {
                const {imageData} = ev.data;

                const canvas = canvasRef?.current;
                const context = canvas?.getContext("2d");

                context?.clearRect(0, 0, width, height);

                context?.drawImage(imageDataToCanvas(imageData), 0, 0, width, height);
            };

            return worker;
        }, [Worker]);

        useEffect(() => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            worker.postMessage({
                imageData: imageData || context.getImageData(0, 0, width, height),
                params: {
                    ...otherProps,
                    ...params
                },
                width, height
            });
        }, [params, width, height, imageData]);

        return (
            <canvas
                className={"canvas-image-data"}
                width={width}
                height={height}
                ref={canvasRef}/>
        );
    };
    return WebWorkerCanvas;
};

export const Paraboloid = webWorkerCanvas(ParaboloidWorker);
export const ChannelImageData = webWorkerCanvas(ChannelsWorker);
export const Saw = webWorkerCanvas(SawWorker);
export const Sin = webWorkerCanvas(SinWorker);
export const Sis2 = webWorkerCanvas(Sis2Worker);
