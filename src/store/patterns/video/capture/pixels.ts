export enum StackType {
    Right = "<",
    Left = ">",
    FromCenter = "<>",
    ToCenter = "><",
}

export interface PixelsItem {
    pixels
    width
    height
}

export class PixelsStack {

    array: PixelsItem[];
    type;
    size;

    constructor(size, type?) {
        this.size = size = Math.ceil(size);
        this.array = new Array(size);
        this.type = type || StackType.Right;
    }

    setType = (type: StackType) => this.type = type;

    getPixel = (x: number, y: number, z: number) => {
        const zz = this.array[Math.round(z * (this.array.length - 1))];
        if (!zz)
            return [0, 0, 0, 255];
        return get(zz.pixels, zz.width, 4, x, y);
    };

    getArray = () => {
        return this.array;
    };

    setSize = (size) => {
        if (!Math.ceil(size)) return;

        this.size = size = Math.ceil(size);
        this.array = new Array(...(
            this.array.length > size
                ? this.array.slice(0, size)
                : [
                    ...new Array(size - this.array.length).fill(undefined),
                    ...this.array
                ] //todo можно заполнять старыми значениями
        ));
        // this.array = new Array(...(
        //     this.array.slice(0, size).concat(Array(size).fill(undefined)).slice(0, size)
        // ));
    };

    push(pixels, width, height) {
        const item = {pixels, width, height};
        switch (this.type) {
            case StackType.Right:
                this.array.shift();
                this.array.push(item);
                break;
            case StackType.Left:
                this.array.pop();
                this.array.unshift(item);
                break;
            case StackType.FromCenter:
                this.array.pop();
                this.array.shift();
                this.array = [
                    ...this.array.slice(0, this.array.length / 2),
                    item,
                    item,
                    ...this.array.slice(this.array.length / 2, this.array.length)
                ];
                break;
            case StackType.ToCenter:
                this.array.push(item);
                this.array.unshift(item);
                this.array = [
                    ...this.array.slice(0, this.array.length / 2 - 1),
                    ...this.array.slice(this.array.length / 2 + 1, this.array.length)
                ];
                break;
            default:
                this.array.shift();
                this.array.push(item);
                break;
        }
    }
}


export const get = (pixels, width, d, x, y) => {
    const n = (x + y * width) * d;
    return pixels?.[n] !== undefined ? [
        pixels[n],
        pixels[n + 1],
        pixels[n + 2],
        pixels[n + 3]
    ] : [0, 0, 0, 255];
};


export const set = (pixels, width, d, x, y, value) => {
    const n = (x + y * width) * d;
    pixels[n] = value[0];
    pixels[n + 1] = value[1];
    pixels[n + 2] = value[2];
    pixels[n + 3] = value[3];
    return pixels;
};
