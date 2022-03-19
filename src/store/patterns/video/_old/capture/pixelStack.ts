import {EdgeMode} from "../../services_DEPREC";

export enum StackType {
    Right = ">",
    Left = "<",
    FromCenter = "<>",
    ToCenter = "><",
}
export const StackTypeASMap = {
    [StackType.Right]: 0,
    [StackType.Left]: 1,
    [StackType.FromCenter]: 2,
    [StackType.ToCenter]: 3,
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

    // setSize = (size) => {
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




export const set = (pixels: Uint8ClampedArray, width, x, y, value: Uint8ClampedArray) => {
    const n = (x + y * width) * 4;
    pixels.set(value, n);
    return pixels;
};
