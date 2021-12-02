// VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO VIDEO
import {xyParaboloid, xySis2} from "../../../changeFunctions/functions/_helpers";
import {
    FxyArrayCoordinateParams,
    FxyArrayParams,
    FxyArrayType,
    FxyParams,
    FxyType
} from "../../../changeFunctions/functions/fxy";
import {set, StackType} from "./pixels";
import {EdgeMode} from "../services";

export const xyArrayVideoFunctionByType: {
    [type: string]: ({x, y, width, height, params}) => number
} = {
    [FxyArrayType.X]: ({x, y, width, height, params}) => {

        const {valuesArray, from, to, drawWidth, drawHeight} = params as FxyArrayCoordinateParams;


        const i = Math.floor(x / width * drawWidth);


        const coordinateValue = valuesArray[i] / drawHeight;


        const amplitude = Math.abs(to - from);
        const min = Math.min(from, to);
        // const inverse = to < from;


        return min + amplitude * coordinateValue;
    },
    [FxyArrayType.Y]: ({x, y, width, height, params}) => {
        const {valuesArray, from, to, drawWidth, drawHeight} = params as FxyArrayCoordinateParams;


        const i = Math.floor(y / height * drawWidth);


        const coordinateValue = valuesArray[i] / drawHeight;


        const amplitude = Math.abs(to - from);
        const min = Math.min(from, to);
        const inverse = to < from;

        const znorm = min + amplitude * coordinateValue;

        return znorm;
    },
};
export const xyVideoFunctionByType = {
    [FxyType.Parab]: ({x, y, width, height, params}) => {

        const {x: xk, y: yk, end, zd} = params;

        const f = xyParaboloid(1 / 2, 1 / 2, xk, yk);


        const xnorm = x / width;
        const ynorm = y / height;
        const znorm = f(xnorm, ynorm) * end + zd;

        // (range[1] - startValue) * end;

        return znorm;// * width;
    },
    [FxyType.Sis2]: ({x, y, width, height, params}) => {


        const f = xySis2(params);


        const xnorm = x / width;
        const ynorm = y / height;
        const znorm = f(xnorm, ynorm) * params.end;

        // (range[1] - startValue) * end;

        return znorm;// * width;
    },
    [FxyType.Array]: ({x, y, width, height, params: functionParams}) => {
        const {type, typeParams} = functionParams as FxyArrayParams;
        const params = typeParams[type];

        return xyArrayVideoFunctionByType[type]?.({x, y, width, height, params});
    }
};

export enum Direction {
    FRONT,
    BACK,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

function getDirectionCoordinates(
    direction: number,
    mirror: number,
    width: number,
    height: number,
    x: number,
    y: number,
    zNormalized: number
) {
    let directionCoordinates = [0, 0, 0];

    switch (direction) {
        case Direction.BACK:
            directionCoordinates[0] = x;
            directionCoordinates[1] = y;
            directionCoordinates[2] = zNormalized;
            break;
        case Direction.FRONT:
            directionCoordinates[0] = x;
            directionCoordinates[1] = y;
            directionCoordinates[2] = 1 - zNormalized;
            break;
        case Direction.LEFT:
            directionCoordinates[0] = Math.round(zNormalized * (width - 1));
            directionCoordinates[1] = y;
            directionCoordinates[2] = x / (width - 1);
            break;
        case Direction.RIGHT:
            directionCoordinates[0] = Math.round((1 - zNormalized) * (width - 1));
            directionCoordinates[1] = y;
            directionCoordinates[2] = 1 - x / (width - 1);
            break;
        case Direction.TOP:
            directionCoordinates[0] = x;
            directionCoordinates[1] = Math.round(zNormalized * (height - 1));
            directionCoordinates[2] = y / (height - 1);
            break;
        case Direction.BOTTOM:
            directionCoordinates[0] = x;
            directionCoordinates[1] = Math.round((1 - zNormalized) * (height - 1));
            directionCoordinates[2] = 1 - y / (height - 1);
            break;
        default:
            directionCoordinates[0] = x;
            directionCoordinates[1] = y;
            directionCoordinates[2] = zNormalized;
            break;
    }

    if (mirror) {
        directionCoordinates[0] = width - 1 - directionCoordinates[0]
    }

    return directionCoordinates;
}


export class PixelsStack {

    width: number;
    height: number;
    depth: number;
    oneFrameLength: number;

    data: Uint8ClampedArray;
    type: StackType;
    edgeMode: EdgeMode;

    constructor(width: number, height: number, depth: number, type?, edgeMode?) {

        this.width = width;
        this.height = height;
        this.depth = Math.floor(depth);
        this.oneFrameLength = width * height * 4;
        this.data = new Uint8ClampedArray(this.oneFrameLength * this.depth);

        this.type = type || StackType.Right;
        this.edgeMode = edgeMode || EdgeMode.ALL;
    }

    setType = (type: StackType) => this.type = type;

    setEdgeMode = (mode: EdgeMode) => this.edgeMode = mode;

    GetFrameN = {
        [EdgeMode.NO]: (z, length) => {
            return Math.round(z);
        },
        [EdgeMode.TOP]: (z, length) => {
            let frameN = Math.round(z);
            if (frameN >= length) frameN = length - 1;
            return frameN;
        },
        [EdgeMode.BOT]: (z, length) => {
            let frameN = Math.round(z);
            if (frameN < 0) frameN = 0;
            return frameN;
        },
        [EdgeMode.ALL]: (z, length) => {
            let frameN = Math.round(z);
            if (frameN >= length) frameN = length - 1;
            if (frameN < 0) frameN = 0;
            return frameN;
        },
    };

    getPixel = (x: number, y: number, zNormalized: number): Uint8ClampedArray => {
        const getClampedCoordinate = this.GetFrameN[this.edgeMode];

        const xx = getClampedCoordinate(x, this.width);
        const yy = getClampedCoordinate(y, this.height);
        const frame = getClampedCoordinate(zNormalized * (this.depth - 1), this.depth);



        const n = this.oneFrameLength * frame + (xx + yy * this.width) * 4;
        return this.data.slice(n, n + 4);
    };

    // setDepth = (size) => {
    //     if (!Math.ceil(size)) return;
    //
    //     this.size = size = Math.ceil(size);
    //     this.array = new Array(...(
    //         this.array.length > size
    //             ? this.array.slice(0, size)
    //             : [
    //                 ...new Array(size - this.array.length).fill(undefined),
    //                 ...this.array
    //             ] //todo можно заполнять старыми значениями
    //     ));
    //     // this.array = new Array(...(
    //     //     this.array.slice(0, size).concat(Array(size).fill(undefined)).slice(0, size)
    //     // ));
    // };

    push(pixels: Uint8ClampedArray) {
        // const item = {pixels, width, height};
        switch (this.type) {
            case StackType.Right:
                this.data.set(this.data.subarray(this.oneFrameLength), 0);
                this.data.set(pixels, this.data.length - this.oneFrameLength);

                // this.array.shift();
                // this.array.push(item);
                break;
            case StackType.Left:
                // this.array.pop();
                // this.array.unshift(item);
                break;
            case StackType.FromCenter:
                // this.array.pop();
                // this.array.shift();
                // this.array = [
                //     ...this.array.slice(0, this.array.length / 2),
                //     item,
                //     item,
                //     ...this.array.slice(this.array.length / 2, this.array.length)
                // ];
                break;
            case StackType.ToCenter:
                // this.array.push(item);
                // this.array.unshift(item);
                // this.array = [
                //     ...this.array.slice(0, this.array.length / 2 - 1),
                //     ...this.array.slice(this.array.length / 2 + 1, this.array.length)
                // ];
                break;
            default:
                // this.array.shift();
                // this.array.push(item);
                break;
        }
    }
}


export const fxyVideoChangeFunction =
    (x, y, width, height, params: FxyParams) => {

        return xyVideoFunctionByType[params.type]({
            x, y, width, height,
            params: params.typeParams[params.type]
        });
    };
