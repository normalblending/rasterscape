import * as React from "react";
import {createVector, Vector, vectorAdd, vectorMul} from "../../../utils/vector";


export interface CrossSVGProps {
    position: Vector
    size: number
    minSize?: number
    minStrokeWidth?: number
    angle?: number
    onMouseDown?: (e: MouseEvent, data: any) => void
    onMouseEnter?: (e: MouseEvent, data?: any) => void
    cursor?: string
    data?: any
    stroke?: string
    strokeWidth?: number
    pointerEvents?: string
    opacity?: number

    strokeDasharray?: number
    strokeDashoffset?: number
}

export const cross = (zero: Vector, scale: number, offset: Vector): React.FC<CrossSVGProps> => (props) => {
    const {
        position,
        size,
        angle,
        onMouseDown,
        onMouseEnter,
        cursor,
        data,
        strokeWidth,
        minSize,
        minStrokeWidth = 0,
        ...otherProps
    } = props;

    const _size = scale === 0 ? 0 : Math.max(minSize || 0, size * scale);

    const _strokeWidth = Math.max(minStrokeWidth, +strokeWidth * scale);
    const _position = React.useMemo(() => {
        return vectorAdd(offset, vectorMul(vectorAdd(position, zero), scale));
    }, [offset, zero, scale, position]);


    const {x, y} = _position;

    return _size ? (<>
        <line
            x1={x - _size / 2}
            y1={y}
            x2={x + _size / 2}
            y2={y}
            transform={`rotate(${-(angle || 0)} ${x} ${y})`}
            cursor={cursor}
            strokeWidth={_strokeWidth}
            {...otherProps}
        />
        <line
            x1={x}
            y1={y - _size / 2}
            x2={x}
            y2={y + _size / 2}
            transform={`rotate(${-(angle || 0)} ${x} ${y})`}
            cursor={cursor}
            strokeWidth={_strokeWidth}
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



export interface RectProps extends React.SVGAttributes<SVGRectElement> {
    start: Vector;
    size: Vector;
    minStrokeWidth?: number
    minSize?: number
}

export const rectSVG = (zero: Vector, scale: number, offset: Vector): React.FC<RectProps> =>
    (props) => {
        const {
            start,
            size,
            strokeWidth,
            minStrokeWidth = 0,
            ...otherProps
        } = props;

        const _strokeWidth = Math.max(minStrokeWidth, +strokeWidth * (scale));

        const _start = React.useMemo(() => {
            return vectorAdd(offset, vectorMul(vectorAdd(start, zero), scale));
        }, [offset, zero, scale, start]);

        const _size = vectorMul(size, scale);
        return (
            <rect
                {...otherProps}
                strokeWidth={_strokeWidth}
                x={_start.x}
                y={_start.y}
                width={_size.x}
                height={_size.y}
            />
        )
    }
export interface SquareCenterProps extends React.SVGAttributes<SVGRectElement> {
    center: Vector;
    size: number;
    minStrokeWidth?: number
    minSize?: number
}

export const squareCenterSVG = (zero: Vector, scale: number, offset: Vector): React.FC<SquareCenterProps> =>
    (props) => {
        const {
            center,
            size,
            strokeWidth,
            minSize,
            minStrokeWidth = 0,
            ...otherProps
        } = props;

        const _strokeWidth = Math.max(minStrokeWidth, +strokeWidth * (scale));


        const _size = scale === 0 ? 0 : Math.max(minSize, size * scale);

        const _start = React.useMemo(() => {
            return vectorAdd(vectorAdd(offset, vectorMul(vectorAdd(center, zero), scale)), -_size/2);
        }, [offset, zero, scale, center, _size]);
        return (
            <rect
                {...otherProps}
                strokeWidth={_strokeWidth}
                x={_start.x}
                y={_start.y}
                width={_size}
                height={_size}
            />
        )
    }
export interface RectCenterProps extends React.SVGAttributes<SVGRectElement> {
    center: Vector;
    size: Vector;
    minStrokeWidth?: number
    minSize?: Vector;
}

export const rectCenterSVG = (zero: Vector, scale: number, offset: Vector): React.FC<RectCenterProps> =>
    (props) => {
        const {
            center,
            size,
            strokeWidth,
            minSize,
            minStrokeWidth = 0,
            ...otherProps
        } = props;

        const _strokeWidth = Math.max(minStrokeWidth, +strokeWidth * (scale));


        const _size = scale === 0
            ? createVector(0,0)
            : createVector(
                Math.max(minSize?.x || 0, size.x * scale),
                Math.max(minSize?.y || 0, size.y * scale)
            );

        const _start = React.useMemo(() => {
            return vectorAdd(vectorAdd(offset, vectorMul(vectorAdd(center, zero), scale)), vectorMul(_size, -1/2));
        }, [offset, zero, scale, center, _size]);
        return (
            <rect
                {...otherProps}
                strokeWidth={_strokeWidth}
                x={_start.x}
                y={_start.y}
                width={_size.x}
                height={_size.y}
            />
        )
    }

export interface LineProps extends React.SVGAttributes<SVGLineElement> {
    start: Vector;
    finish: Vector;
    minStrokeWidth?: number
}

export const lineSVG = (zero: Vector, scale: number, offset: Vector): React.FC<LineProps> =>
    (props) => {
        const {
            start,
            finish,
            strokeWidth,
            minStrokeWidth = 0,
            ...otherProps
        } = props;
        const _strokeWidth = Math.max(minStrokeWidth, +strokeWidth * (scale));

        const _start = React.useMemo(() => {
            return vectorAdd(offset, vectorMul(vectorAdd(start, zero), scale));
        }, [offset, zero, scale, start]);
        const _finish = React.useMemo(() => {
            return vectorAdd(offset, vectorMul(vectorAdd(finish, zero), scale));
        }, [offset, zero, scale, finish]);


        return (
            <line
                x1={_start.x}
                y1={_start.y}
                x2={_finish.x}
                y2={_finish.y}
                strokeWidth={_strokeWidth}
                {...otherProps}
            />
        )
    }
export type BezierPoints = [Vector, Vector, Vector, Vector];

export interface BezierProps {
    points: BezierPoints;
    color: string;
    curveWidth: number;
    helperWidth: number;
}

export const bezierSVG = (zero: Vector, scale: number, offset: Vector): React.FC<BezierProps> =>
    (props) => {
        const {
            points,
            color,
        } = props;

        const _points = React.useMemo(() => {
            return points.map(point => {
                return vectorAdd(offset, vectorMul(vectorAdd(point, zero), scale));
            });
        }, [zero, scale, offset, points]);

        const mainStrokeWidth = Math.max(1 * scale, 0.7);
        const secondaryStrokeWidth = Math.max(0.7 * scale, 0.3);

        return (
            <>
                <path
                    d={`M${_points[0].x} ${_points[0].y} L${_points[1].x} ${_points[1].y} `}

                    stroke="white"
                    strokeWidth={secondaryStrokeWidth}
                    pointerEvents="none"
                    fill="transparent"/>
                <path
                    d={`M${_points[2].x} ${_points[2].y} L${_points[3].x} ${_points[3].y} `}

                    stroke="white"
                    strokeWidth={secondaryStrokeWidth}
                    pointerEvents="none"
                    fill="transparent"/>
                <path
                    d={`M${_points[0].x} ${_points[0].y} C ${_points[1].x} ${_points[1].y}, ${_points[2].x} ${_points[2].y}, ${_points[3].x} ${_points[3].y}`}
                    stroke={color}
                    pointerEvents="none"
                    strokeWidth={mainStrokeWidth}
                    fill="transparent"/>
            </>
        );
    }