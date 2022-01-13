
#include <stdlib.h>
#include <math.h>
#include <stdio.h>
#include "pixelStack.h"

PixelsStack::PixelsStack() {
}

void PixelsStack::init(int _width, int _height, int _depth, int _pushSide, int _edgeMode) {


    width = _width;
    height = _height;
    depth = _depth;
    oneFrameLength = width * height * 4;
    dataLength = oneFrameLength * depth;
    data = new unsigned char[oneFrameLength * _width]; // максимальный depth это ширина

    pushSide = _pushSide ? _pushSide : 0;
    edgeMode = _edgeMode ? _edgeMode : 3;

         //        this.GetFrameN = new Map<i32, (z: i32, length: i32) => i32>();
         //        this.GetFrameN.set(EdgeMode.NO, function (z: i32, length: i32): i32 {
         //            return Math.round(z) as i32;
         //        });
         //        this.GetFrameN.set(EdgeMode.TOP, function (z: i32, length: i32): i32 {
         //            let frameN = Math.round(z);
         //            if (frameN >= length) frameN = length - 1;
         //            return frameN as i32;
         //        });
         //        this.GetFrameN.set(EdgeMode.BOT, function (z: i32, length: i32): i32 {
         //            let frameN = Math.round(z);
         //            if (frameN < 0) frameN = 0;
         //            return frameN as i32;
         //        });
         //        this.GetFrameN.set(EdgeMode.ALL, function (z: i32, length: i32): i32 {
         //            let frameN = Math.round(z);
         //            if (frameN >= length) frameN = length - 1;
         //            if (frameN < 0) frameN = 0;
         //            return frameN as i32;
         //        });
}

void PixelsStack::setPushSide(int _pushSide) {
    pushSide = _pushSide;
};

void PixelsStack::setEdgeMode(int _mode) {
    edgeMode = _mode;
};

void PixelsStack::setDepth(int newDepth) {

    int oldDepth = depth;
    depth = newDepth < 1 ? 1 : newDepth;

    if (depth == oldDepth) {
        return;
    } else if (depth < oldDepth) {
        dataLength = oneFrameLength * depth;
//            this.data = this.data.subarray(0, this.depth * this.oneFrameLength)
    } else {
    // тут нужен реалок
        dataLength = oneFrameLength * depth;
//            const oldData = data;
//            const newLength = this.depth * this.oneFrameLength;
//            this.data = new Uint8ClampedArray(newLength);
//            this.data.set(oldData, newLength - oldData.length);
    }
};

unsigned char *PixelsStack::getPixel(int x, int y, double zNormalized) {
    // const getClampedCoordinate = this.GetFrameN.get(this.edgeMode);

    // const xx: i32 = x;//getClampedCoordinate(x, this.width);
    // const yy: i32 = y;//getClampedCoordinate(y, this.height);
    int frame = (int)ceilf(zNormalized * ((depth - 1)));//getClampedCoordinate(Math.ceil(zNormalized * ((this.depth - 1) as f32)) as i32, this.depth);


//399 - 399 - 2


    // способ с queueOffset

    int offsetFrame = ( 2 * (depth - 1) - frame - (queueOffset - 1) ) % depth;
//        while (offsetFrame <= 0)
//        {
//            offsetFrame += depth;
//        }
//        int offsetFrame = ( 2 * (depth - 1) - frame - (queueOffset - 1) ) % depth; // правильно ли это
    int n = oneFrameLength * offsetFrame + (x + y * width) * 4;

    // способ 2
//        int n = oneFrameLength * frame + (x + y * width) * 4;


//        if (x==(width- 1) && y == (height- 1)) {
//            printf("33333sdf %d %d %d/%d\n", queueOffset, frame, offsetFrame, n);
//        }
//        if ((n+3) > dataLength) {
//            printf("alerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr\n");
//        }

        if ((n + 3) >= dataLength) {
            printf("2 out of bound");
        }
    return &data[n];
};

void PixelsStack::push(unsigned char *pixels) {
    // const item = {pixels, width, height};
//        printf("frame push\n");
    switch (pushSide) {
        case 0: {//right

            // способ 2
//                std::rotate<unsigned char>(data[0], data[oneFrameLength], data[dataLength - 1]);
//                int position = dataLength - oneFrameLength;
//                for (int i = oneFrameLength; i < dataLength; i++) {
//                    data[i - oneFrameLength] = data[i];
//                }
//                for (int i = position; i < position + oneFrameLength; i++) {
//                    data[i] = pixels[i - position];
//                }

            // способ с queueOffset
            int position = dataLength - (queueOffset + 1) * oneFrameLength;

            for (int i = position; i < position + oneFrameLength; i++) {
                data[i] = pixels[i - position];
            }
            queueOffset = (queueOffset + 1) % depth;






//        printf("frame pushed\n");

            // this.data.set(this.data.subarray(this.oneFrameLength), 0); //  можно избавитьсся если добавить офсет текущего кадра
//                this.data.set(pixels, this.data.length - (this.queueOffset + 1) * this.oneFrameLength);

            // this.array.shift();
            // this.array.push(item);
            break;
        }
        case 1: { //left
            // this.array.pop();
            // this.array.unshift(item);
            break;
        }
        case 2: {//FromCenter
            // this.array.pop();
            // this.array.shift();
            // this.array = [
            //     ...this.array.slice(0, this.array.length / 2),
            //     item,
            //     item,
            //     ...this.array.slice(this.array.length / 2, this.array.length)
            // ];
            break;
        }
        case 3: {//ToCenter
            // this.array.push(item);
            // this.array.unshift(item);
            // this.array = [
            //     ...this.array.slice(0, this.array.length / 2 - 1),
            //     ...this.array.slice(this.array.length / 2 + 1, this.array.length)
            // ];
            break;
        }
        default: {
            // this.array.shift();
            // this.array.push(item);
            break;
        }
    }

}
