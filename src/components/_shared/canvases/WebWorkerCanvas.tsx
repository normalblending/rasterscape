import * as React from "react";
import {useRef, useEffect, useMemo} from "react";
import {imageDataToCanvas} from "utils/canvas/helpers/imageData";
import _throttle from 'lodash/throttle';
import {coordHelper, coordHelper2, coordHelper3} from "../../Area/canvasPosition.servise";

export interface WebWorkerCanvasProps {
    throttled?: boolean
    width: number
    height: number
    params?: any
    imageData?: ImageData
    [x: string]: any
}

export const webWorkerCanvas = <ParamsType extends any>(workerPath: string): React.FC<WebWorkerCanvasProps> => {
    const WebWorkerCanvas: React.FC<WebWorkerCanvasProps> = ({throttled, width, height, params, imageData, ...otherProps}) => {

        const canvasRef = useRef(null);

        const worker = useMemo(() => {
            const worker = new Worker(workerPath);

            console.log(worker)
            let i;
            worker.onmessage = (ev: MessageEvent) => {
                coordHelper.setText('new image', i++);
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

                const context = canvas?.getContext("2d");

                worker.postMessage({
                    imageData: imageData || context?.getImageData(0, 0, width, height) || null,
                    params: {
                        ...otherProps,
                        ...params
                    },
                    width, height
                });
            };
            return !throttled ? _throttle(post, 200) : post;
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

export const Paraboloid = webWorkerCanvas('./workers/paraboloid.js');
export const ChannelImageData = webWorkerCanvas('./workers/channels.js');
export const Saw = webWorkerCanvas('./workers/saw.js');
export const Sin = webWorkerCanvas('./workers/sin.js');
export const Sis2 = webWorkerCanvas('./workers/sis2.js');
export const Noise = webWorkerCanvas('./workers/noise.js');
