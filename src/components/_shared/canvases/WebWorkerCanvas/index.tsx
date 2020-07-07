import * as React from "react";
import {useRef, useEffect, useMemo, useCallback} from "react";
import {imageDataToCanvas} from "../../../../utils/canvas/helpers/imageData";
import {throttle} from "../../../../utils/utils";
import _throttle from 'lodash/throttle';
import {coordHelper, coordHelper2, coordHelper3, TextHelper} from "../../../Area/canvasPosition.servise";

/* eslint import/no-webpack-loader-syntax: off */
const ParaboloidWorker = require("worker-loader?name=dist/[name].js!./workers/paraboloid");
const ChannelsWorker = require("worker-loader?name=dist/[name].js!./workers/channels");
const SawWorker = require("worker-loader?name=dist/[name].js!./workers/saw");
const SinWorker = require("worker-loader?name=dist/[name].js!./workers/sin");
const Sis2Worker = require("worker-loader?name=dist/[name].js!./workers/sis2");
const NoiseWorker = require("worker-loader?name=dist/[name].js!./workers/noise");

export interface WebWorkerCanvasProps {
    throttled?: boolean
    width: number
    height: number
    params?: any
    imageData?: ImageData
    [x: string]: any
}


// const post = (canvasRef, width, height, params, otherProps, imageData, worker) => {
//     coordHelper2.setText(+new Date() + ' po');
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//
//     worker.postMessage({
//         imageData: imageData || context.getImageData(0, 0, width, height),
//         params: {
//             ...otherProps,
//             ...params
//         },
//         width, height
//     });
// };
//
// const postThrottled = _throttle(post, 500);

export const webWorkerCanvas = <ParamsType extends any>(Worker): React.FC<WebWorkerCanvasProps> => {
    const WebWorkerCanvas: React.FC<WebWorkerCanvasProps> = ({throttled, width, height, params, imageData, ...otherProps}) => {

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

        const post = React.useMemo(() => {
            const post = (canvasRef, width, height, params, otherProps, imageData, worker) => {
                coordHelper2.setText(+new Date() + ' po');
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
            };
            return !throttled ? _throttle(post, 500) : post;
        }, [throttled]);


        useEffect(() => {
            coordHelper3.setText(+new Date() + ' ef');
            post(canvasRef, width, height, params, otherProps, imageData, worker);
        }, [params, width, height, throttled, imageData]);

        return (
            <canvas
                className={"canvas-image-data"}
                width={width}
                height={height}
                ref={canvasRef}/>
        );
    };
    return React.memo(WebWorkerCanvas);
};

export const Paraboloid = webWorkerCanvas(ParaboloidWorker);
export const ChannelImageData = webWorkerCanvas(ChannelsWorker);
export const Saw = webWorkerCanvas(SawWorker);
export const Sin = webWorkerCanvas(SinWorker);
export const Sis2 = webWorkerCanvas(Sis2Worker);
export const Noise = webWorkerCanvas(NoiseWorker);
