// Set up our memory
// By growing our Wasm Memory by 1 page (64KB)
// memory.grow(1);


export enum Direction {
    FRONT,
    BACK,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

enum PushSide {
    Right,
    Left,
    FromCenter,
    ToCenter,
}

enum EdgeMode {
    NO,
    TOP,
    BOT,
    ALL,
}

type GetFrameNumberMapType = Map<i32, (z: i32, length: i32) => i32>

export class PixelsStack {

    width: i32;
    height: i32;
    depth: i32;
    oneFrameLength: i32;

    data: Uint8ClampedArray;
    pushSide: PushSide;
    edgeMode: EdgeMode;

    GetFrameN: GetFrameNumberMapType;

    queueOffset: i32 = 0;

    constructor(width: i32, height: i32, depth: i32, pushSide: i32, edgeMode: i32) {

        this.width = width;
        this.height = height;
        this.depth = Math.floor(depth) as i32;
        this.oneFrameLength = width * height * 4;
        this.data = new Uint8ClampedArray(this.oneFrameLength * this.depth);

        this.pushSide = pushSide || PushSide.Right;
        this.edgeMode = edgeMode || EdgeMode.ALL;

        this.GetFrameN = new Map<i32, (z: i32, length: i32) => i32>();
        this.GetFrameN.set(EdgeMode.NO, function (z: i32, length: i32): i32 {
            return Math.round(z) as i32;
        });
        this.GetFrameN.set(EdgeMode.TOP, function (z: i32, length: i32): i32 {
            let frameN = Math.round(z);
            if (frameN >= length) frameN = length - 1;
            return frameN as i32;
        });
        this.GetFrameN.set(EdgeMode.BOT, function (z: i32, length: i32): i32 {
            let frameN = Math.round(z);
            if (frameN < 0) frameN = 0;
            return frameN as i32;
        });
        this.GetFrameN.set(EdgeMode.ALL, function (z: i32, length: i32): i32 {
            let frameN = Math.round(z);
            if (frameN >= length) frameN = length - 1;
            if (frameN < 0) frameN = 0;
            return frameN as i32;
        });
    }

    setPushSide(pushSide: PushSide): void {
        this.pushSide = pushSide
    };

    setEdgeMode(mode: EdgeMode): void {
        this.edgeMode = mode
    };

    setDepth(depth: i32): void {

        const oldDepth = this.depth;
        this.depth = Math.min(Math.ceil(depth), 1) as i32;

        if (this.depth === oldDepth) {
            return;
        } else if (this.depth < oldDepth) {
            this.data = this.data.subarray(0, this.depth * this.oneFrameLength)
        } else {
            const oldData = this.data;
            const newLength = this.depth * this.oneFrameLength;
            this.data = new Uint8ClampedArray(newLength);
            this.data.set(oldData, newLength - oldData.length);
        }
    };

    getPixel(x: i32, y: i32, zNormalized: f32): Uint8ClampedArray {
        // const getClampedCoordinate = this.GetFrameN.get(this.edgeMode);

        // const xx: i32 = x;//getClampedCoordinate(x, this.width);
        // const yy: i32 = y;//getClampedCoordinate(y, this.height);
        const frame: i32 = Math.ceil(zNormalized * ((this.depth - 1) as f32)) as i32;//getClampedCoordinate(Math.ceil(zNormalized * ((this.depth - 1) as f32)) as i32, this.depth);

        const offsetFrame = (this.depth - frame - (this.queueOffset + 1)) % (this.depth); // правильно ли это


        const n = this.oneFrameLength * offsetFrame + (x + y * this.width) * 4;
        return this.data.subarray(n, n + 4);
    };

    push(pixels: Uint8ClampedArray): void {
        // const item = {pixels, width, height};
        switch (this.pushSide) {
            case PushSide.Right:
                // this.data.set(this.data.subarray(this.oneFrameLength), 0); //  можно избавитьсся если добавить офсет текущего кадра
                this.data.set(pixels, this.data.length - (this.queueOffset + 1) * this.oneFrameLength);

                // this.array.shift();
                // this.array.push(item);
                break;
            case PushSide.Left:
                // this.array.pop();
                // this.array.unshift(item);
                break;
            case PushSide.FromCenter:
                // this.array.pop();
                // this.array.shift();
                // this.array = [
                //     ...this.array.slice(0, this.array.length / 2),
                //     item,
                //     item,
                //     ...this.array.slice(this.array.length / 2, this.array.length)
                // ];
                break;
            case PushSide.ToCenter:
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

        this.queueOffset = (this.queueOffset + 1) % this.depth;
    }
}

let pixelStack: PixelsStack;
let resultImage: Uint8ClampedArray;

export function init(width: i32, height: i32, depth: i32, pushSide: i32, edgeMode: i32): void {
    pixelStack = new PixelsStack(width, height, depth, pushSide, edgeMode);
    resultImage = new Uint8ClampedArray(width * height * 4);
}

export function setDepth(depth: i32): void {
    pixelStack.setDepth(depth);
}


function xyParaboloid(centerX: f32, centerY: f32, kx: f32, ky: f32, x: f32, y: f32): f32 {
    return (Math.pow(x - centerX, 2) * kx + Math.pow(y - centerY, 2) * ky) as f32;
}

class DirectionCoordinates {
    x: i32;
    y: i32;
    zNormalized: f32;
}

function getDirectionCoordinates(
    direction: Direction,
    mirror: i32,
    width: i32,
    height: i32,
    x: i32,
    y: i32,
    zNormalized: f32,
): DirectionCoordinates {
    const directionCoordinates: DirectionCoordinates = {
        x: 0,
        y: 0,
        zNormalized: 0.0 as f32,
    };

    switch (direction) {
        case Direction.BACK:
            directionCoordinates.x = x;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = zNormalized;
            break;
        case Direction.FRONT:
            directionCoordinates.x = x;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = 1 - zNormalized;
            break;
        case Direction.LEFT:
            directionCoordinates.x = Math.ceil(zNormalized * ((width - 1) as f32)) as i32;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = (x as f32) / ((width as f32) - 1);
            break;
        case Direction.RIGHT:
            directionCoordinates.x = Math.ceil((1 - zNormalized) * (width - 1)) as i32;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = 1 - (x as f32) / ((width as f32) - 1);
            break;
        case Direction.TOP:
            directionCoordinates.x = x;
            directionCoordinates.y = Math.ceil(zNormalized * ((height - 1) as f32)) as i32;
            directionCoordinates.zNormalized = (y as f32) / ((height as f32) - 1);
            break;
        case Direction.BOTTOM:
            directionCoordinates.x = x;
            directionCoordinates.y = Math.ceil((1 - zNormalized) * (height - 1)) as i32;
            directionCoordinates.zNormalized = 1 - (y as f32) / ((height as f32) - 1);
            break;
        default:
            directionCoordinates.x = x;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = zNormalized;
            break;
    }

    if (mirror) {
        directionCoordinates.x = width - 1 - directionCoordinates.x
    }

    return directionCoordinates;
}

function setPixel(pixels: Uint8ClampedArray, width: i32, x: i32, y: i32, value: Uint8ClampedArray): void {
    const n = (x + y * width) * 4;
    pixels.set(value, n);
}

export function paraboloidCutFunction(
    imageDataArray: Uint8ClampedArray,
    width: i32,
    height: i32,
    direction: i32,
    mirror: i32,
    kx: f32,
    ky: f32,
    kz: f32,
    dz: f32,
): Uint8ClampedArray {

    pixelStack.push(imageDataArray);

    let directionCoordinates: DirectionCoordinates = {
        x: 0,
        y: 0,
        zNormalized: 0.0 as f32,
    };
    let xNormalized: f32;
    let yNormalized: f32;
    let zNormalized: f32;
    let pixelValue: Uint8ClampedArray;
    let pixelNumber: i32;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            xNormalized = (x as f32) / (width as f32);
            yNormalized = (y as f32) / (height as f32);
            zNormalized = xyParaboloid(1 / 2, 1 / 2, kx, ky, xNormalized, yNormalized) * kz + dz;
            //
            directionCoordinates = getDirectionCoordinates(direction, mirror, width, height, x, y, zNormalized);

            //

            pixelValue = pixelStack.getPixel(directionCoordinates.x, directionCoordinates.y, directionCoordinates.zNormalized);
            // pixelValue = new Uint8ClampedArray(4);
            //

            pixelNumber = (x + y * width) * 4;
            resultImage.set(pixelValue, pixelNumber);
        }
    }

    return resultImage;
}

export const numberParamsByFunctionType = new Map<string, Map<string, i32>>();
numberParamsByFunctionType.set('sis', new Map<string, i32>());
numberParamsByFunctionType.set('sas', new Map<string, i32>());

export function getNumberParam(type: string, name: string): i32 {
    return numberParamsByFunctionType.get(type).get(name);
}

export function setNumberParam(type: string, name: string, value: i32): i32 {
    numberParamsByFunctionType.get(type).set(name, value);
    return numberParamsByFunctionType.get(type).get(name);
}


export const arrayParamsByFunctionType = new Map<string, Map<string, Int32Array>>();
arrayParamsByFunctionType.set('sis', new Map<string, Int32Array>());
arrayParamsByFunctionType.set('sas', new Map<string, Int32Array>());

export function getArrayParam(type: string, name: string): Int32Array {
    return arrayParamsByFunctionType.get(type).get(name);
}

export function setArrayParam(type: string, name: string, value: Int32Array): Int32Array {
    arrayParamsByFunctionType.get(type).set(name, value);
    return arrayParamsByFunctionType.get(type).get(name);
}

export const Int32Array_ID = idof<Int32Array>();
export const Uint8ClampedArray_ID = idof<Uint8ClampedArray>();
