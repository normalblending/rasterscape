import * as React from "react";
import {MouseEventHandler} from "react";
import {Vector} from "../../../utils/vector";


export type CrossSVGProps = {
    x: number
    y: number
    size: number
    rectSize?: Vector
    angle?: number
    onMouseDown?: (e: MouseEvent, data: any) => void
    onMouseEnter?: (e: MouseEvent, data?: any) => void
    cursor?: string
    data?: any
    stroke?: string
    strokeWidth?: number
    pointerEvents?: string
};

export const CrossSVG: React.FC<CrossSVGProps> = (props) => {
    const {
        x, y,
        size,
        angle,
        onMouseDown,
        onMouseEnter,
        cursor,
        rectSize = {
            x: props.size,
            y: props.size,
        },
        data,
        ...otherProps
    } = props;



    return size ? (<>
        <line
            x1={x - size / 2}
            y1={y}
            x2={x + size / 2}
            y2={y}
            transform={`rotate(${-(angle || 0)} ${x} ${y})`}
            cursor={cursor}
            {...otherProps}
        />
        <line
            x1={x}
            y1={y - size / 2}
            x2={x}
            y2={y + size / 2}
            transform={`rotate(${-(angle || 0)} ${x} ${y})`}
            cursor={cursor}
            {...otherProps}
        />
    </>) : null;
};

export const rbAngle = (x, y, size, color?, angle?) => {
    return size ? (<>
        <line
            x1={x}
            y1={y}
            x2={x + size}
            y2={y}
            strokeWidth={1}
            stroke={color}
            transform={`rotate(${-(angle || 0)} ${x} ${y})`}
        />
        <line
            x1={x}
            y1={y}
            x2={x}
            y2={y + size}
            strokeWidth={1}
            stroke={color}
            transform={`rotate(${-(angle || 0)} ${x} ${y})`}
        />
    </>) : null;
};

export const useMouseDrag = () => {};