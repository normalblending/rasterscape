import * as React from "react";
import {CSSProperties} from "react";

const cursorStyle: CSSProperties = {mixBlendMode: 'difference'};

export interface CursorOptions {
    minSize?: number
}

export const circle = (x, y, size, options?: CursorOptions) => {
    const circleSize = options?.minSize ? Math.max(size, options?.minSize) : size;
    return size ? (<>
        <circle
            cx={x}
            cy={y}
            r={circleSize / 2}
            style={cursorStyle}
            stroke={'white'}
            strokeWidth={0.5}
            // stroke={'rgb(0,0,0)'}
            fill="purple"
            fillOpacity="0"
        />

        <circle
            cx={x}
            cy={y}
            r={circleSize / 2}
            style={cursorStyle}
            strokeWidth={1}
            stroke={'black'}
            // stroke={'rgb(0,0,0)'}
            fill="purple"
            fillOpacity="0"
        />
    </>) : null;
};

export const cross = (x, y, size, rotation?, options?: CursorOptions) => {
    const crossSize = options?.minSize ? Math.max(size, options?.minSize) : size;
    return size ? (<>
        <line
            x1={x - crossSize / 2}
            y1={y}
            x2={x + crossSize / 2}
            y2={y}
            style={cursorStyle}
            strokeWidth={1}
            stroke={'black'}
            transform={`rotate(${-(rotation?.angle || 0)} ${x} ${y})`}
        />
        <line
            x1={x}
            y1={y - crossSize / 2}
            x2={x}
            y2={y + crossSize / 2}
            style={cursorStyle}
            strokeWidth={1}
            stroke={'black'}
            transform={`rotate(${-(rotation?.angle || 0)} ${x} ${y})`}
        />

        <line
            x1={x - crossSize / 2}
            y1={y}
            x2={x + crossSize / 2}
            y2={y}

            style={cursorStyle}
            strokeWidth={0.5}
            stroke={'white'}

            transform={`rotate(${-(rotation?.angle || 0)} ${x} ${y})`}
        />
        <line
            x1={x}
            y1={y - crossSize / 2}
            x2={x}
            y2={y + crossSize / 2}

            style={cursorStyle}
            strokeWidth={0.5}
            stroke={'white'}

            transform={`rotate(${-(rotation?.angle || 0)} ${x} ${y})`}
        />
    </>) : null;
};



export const rect = (x, y, width, height, options) => {
    const transform = options.transform || `rotate(${-(options.rotation ? options.rotation.angle : 0)} ${x} ${y})`
    return (width && height) ? (<>

        <rect
            transform={transform}
            x={x - width / 2}
            y={y - height / 2}
            width={width}
            height={height}

            style={cursorStyle}
            strokeWidth={1}
            stroke={'black'}

            fill="purple"
            fillOpacity="0"
        />
        <rect
            transform={transform}
            x={x - width / 2}
            y={y - height / 2}
            width={width}
            height={height}

            style={cursorStyle}
            strokeWidth={0.5}
            stroke={'white'}

            fill="purple"
            fillOpacity="0"
        />
    </>) : null;
};

export const Cursors = {
    circle,
    rect,
    cross,
}