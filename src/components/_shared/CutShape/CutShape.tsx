import React, {useCallback, useEffect, useRef} from "react";
import {Canvas, CanvasEvent} from "components/_shared/Canvas";
import './CutShape.scss';
import {coordHelper5} from "../../Area/canvasPosition.servise";

const fByPoints = (x1, y1, x2, y2) => {
    const k = (y1 - y2) / (x1 - x2);
    const b = y2 - k * x2;

    return x => k * x + b;
};

export interface CutShapeProps {
    name?: string
    width: number
    height: number
    value: number[]
    valueWidth: number
    valueHeight: number
    onChange: (name: string, value: number[]) => void
    center?: number
    drawAxis?: (ctx: CanvasRenderingContext2D) => void
    inverse?: boolean
    changeOnUp?: boolean
}

export const CutShape: React.FC<CutShapeProps> = (props) => {

    const {
        width,
        height,
        valueWidth,
        valueHeight,
        value,
        center,
        onChange,
        changeOnUp,
        name,
        drawAxis,
        inverse
    } = props;

    const [_value, set_value] = React.useState(value);

    const getValueCoordinates = React.useCallback((x, y) => {
        return {
            x: Math.floor(x / width * valueWidth),
            y: Math.floor(y / height * valueHeight) + 1,
        }
    }, [width, height, valueWidth, valueHeight]);

    const canvasRef = useRef<Canvas>();
    useEffect(() => {
        const img = canvasRef.current.getImageData();

        const ordinateAxisY = (1 - (center || 0)) * height;

        for (let i = 0; i < img.data.length; i += 4) {

            var x = (i / 4) % img.width;
            var y = Math.floor((i / 4) / img.width);

            const {x: xv, y: yv} = getValueCoordinates(
                x,
                inverse
                    ? y
                    : height - y
            );

            // if (inverse ? value[xv] >= yv - 1 : value[xv] <= yv -1) {
            if (inverse ? _value[xv] >= yv - 1 : _value[xv] <= yv - 1) {
                if (y <= ordinateAxisY) {
                    img.data[i] = 211;
                    img.data[i + 1] = 211;
                    img.data[i + 2] = 211;
                    img.data[i + 3] = 255;
                } else {
                    img.data[i] = 0;
                    img.data[i + 1] = 0;
                    img.data[i + 2] = 0;
                    img.data[i + 3] = 255;
                }
            } else {
                if (y < ordinateAxisY) {
                    img.data[i] = 0;
                    img.data[i + 1] = 0;
                    img.data[i + 2] = 0;
                    img.data[i + 3] = 255;
                } else {
                    img.data[i] = 211;
                    img.data[i + 1] = 211;
                    img.data[i + 2] = 211;
                    img.data[i + 3] = 255;
                }
            }
        }

        canvasRef.current.setImageData(img);
        const ctx = canvasRef.current.canvasRef.current.getContext("2d");

        ctx && drawAxis?.(ctx);

    }, [_value, canvasRef, width, height, getValueCoordinates, drawAxis, inverse, center]);

    const clickProcessing = useCallback((canvasE: CanvasEvent) => {

        const {
            e,
        } = canvasE;
        const x = e.offsetX, y = inverse
            ? e.offsetY
            : height - e.offsetY;
        // const newValue = [...value];
        const newValue = [..._value];

        const {x: xv, y: yv} = getValueCoordinates(x, y);

        newValue[xv] = yv;

        set_value(newValue);

        !changeOnUp && onChange(name, newValue);

    }, [_value, onChange, changeOnUp, name, inverse]);

    const drawProcessing = useCallback((canvasE: CanvasEvent) => {

        const e = canvasE.e;
        const prevE = canvasE.pre || canvasE.e;
        if (!e) return;

        const x = e.offsetX,
            y = inverse
                ? e.offsetY
                : height - e.offsetY;
        const x0 = prevE.offsetX,
            y0 = inverse
                ? prevE.offsetY
                : height - prevE.offsetY;

        // const newValue = [...value];
        const newValue = [..._value];


        const {x: xv, y: yv} = getValueCoordinates(x, y);
        const {x: x0v, y: y0v} = getValueCoordinates(x0, y0);

        const f = fByPoints(xv, yv, x0v, y0v);

        const start = Math.min(x0v, xv);
        const finish = Math.max(x0v, xv);

        newValue[xv] = Math.min(Math.max(yv, 0), valueHeight);

        for (let i = start; i < finish; i++) {
            newValue[i] = Math.round(Math.min(Math.max(f(i), 0), valueHeight));
        }

        set_value(newValue);

        !changeOnUp && onChange(name, newValue);
    }, [_value, onChange, changeOnUp, name, width, height, getValueCoordinates, inverse]);

    const handleUp = React.useCallback(() => {
        changeOnUp && onChange(name, _value);
    }, [_value, name, onChange, changeOnUp]);
    return (
        <div>
            <Canvas
                className={'cut-shape'}
                // drawOnMove
                ref={canvasRef}
                onClick={clickProcessing}
                onDraw={drawProcessing}
                onUp={handleUp}
                width={width}
                height={height}/>
        </div>
    );

}
