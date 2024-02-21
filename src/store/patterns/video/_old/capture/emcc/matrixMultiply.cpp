#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <math.h>
#include <stdio.h>

extern "C" {
  // Declare this so it's exported as non-mangled symbol "_mycount"
  void setDepth(int depth);
  void initStack(int width, int height, int depth, int pushSide, int edgeMode);
  unsigned char *paraboloidCutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
      int mirror,
      float kx,
      float ky,
      float kz,
      float dz
  );
  float *matrixMultiply(float *arg1, float *arg2, float *result, int length);
  int add(int a, int b);
}

//enum Direction {
//    FRONT = 0,
//    BACK, //1
//    TOP,//2
//    BOTTOM,//3
//    LEFT,//4
//    RIGHT//5
//};
//
//enum PushSide {
//    Right = 0,
//    Left,
//    FromCenter,
//    ToCenter
//};
//
//enum EdgeMode {
//    NO = 0,
//    TOP,
//    BOT,
//    ALL
//};

class PixelsStack {
public:
    int width;
    int height;
    int depth;
    int oneFrameLength;
    int dataLength;

    unsigned char *data;
    int pushSide;
    int edgeMode;

//    GetFrameN: GetFrameNumberMapType;

    int queueOffset = 0;

    PixelsStack() {
    }

    void init(int _width, int _height, int _depth, int _pushSide, int _edgeMode) {

        width = _width;
        height = _height;
        depth = floor(_depth);
        oneFrameLength = width * height * 4;
        dataLength = oneFrameLength * depth;
        data = new unsigned char[dataLength];

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

    void setPushSide(int _pushSide) {
        pushSide = _pushSide;
    };

    void setEdgeMode(int _mode) {
        edgeMode = _mode;
    };

    void setDepth(int depth) {

        int oldDepth = depth;
        depth = (int) fmin(ceil(depth), 1.0);

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

    unsigned char *getPixel(int x, int y, float zNormalized) {
        // const getClampedCoordinate = this.GetFrameN.get(this.edgeMode);

        // const xx: i32 = x;//getClampedCoordinate(x, this.width);
        // const yy: i32 = y;//getClampedCoordinate(y, this.height);
        int frame = (int)ceilf(zNormalized * ((depth - 1)));//getClampedCoordinate(Math.ceil(zNormalized * ((this.depth - 1) as f32)) as i32, this.depth);

//399 - 399 - 2
        int offsetFrame = (( 2* (depth - 1) - frame - (queueOffset - 1)) % (depth )); // правильно ли это

        int n = oneFrameLength * offsetFrame + (x + y * width) * 4;
//        int n = oneFrameLength * frame + (x + y * width) * 4;


        if (x==(width- 1) && y == (height- 1)) {
            printf("33333sdf %d %d %d/%d\n", queueOffset, frame, offsetFrame, n);
        }
        if ((n+3) > dataLength) {
            printf("alerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr\n");
        }
        return &data[n];
    };

    void push(unsigned char *pixels) {
        // const item = {pixels, width, height};
        printf("frame push\n");
        switch (pushSide) {
            case 0: {//right
                int position = dataLength - (queueOffset + 1) * oneFrameLength;

                for (int i = position; i < position + oneFrameLength; i++) {
//        printf("%d %d\n", i, data[i]);
                    data[i] = pixels[i - position];
                }
        printf("frame pushed\n");

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

        queueOffset = (queueOffset + 1) % depth;
    }
};

PixelsStack pixelStack;
unsigned char *resultImage;


EMSCRIPTEN_KEEPALIVE void setDepth(int depth) {
    pixelStack.setDepth(depth);
};
EMSCRIPTEN_KEEPALIVE void initStack(int width, int height, int depth, int pushSide, int edgeMode) {

    pixelStack.init(width, height, depth, pushSide, edgeMode);
    printf("init stack\n");
    resultImage = new unsigned char[width * height * 4];
};


float xyParaboloid(float centerX, float centerY, float kx, float ky, float x, float y) {
    return (powf(x - centerX, 2) * kx + powf(y - centerY, 2) * ky);
}

struct DirectionCoordinates {
    int x;
    int y;
    float zNormalized;
};

DirectionCoordinates getDirectionCoordinates(
    int direction,
    int mirror,
    int width,
    int height,
    int x,
    int y,
    float zNormalized
) {
    DirectionCoordinates directionCoordinates = {
        .x = 0,
        .y = 0,
        .zNormalized = 0.0,
    };


    switch (direction) {
        case 1:{//BACK
            directionCoordinates.x = x;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = zNormalized;
            break;
        }case 0:{//FRONT
            directionCoordinates.x = x;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = 1 - zNormalized;
            break;
        }case 4:{//LEFT
            directionCoordinates.x = (int) ceil(zNormalized * ((float)(width - 1)));
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = ((float) x) / (((float) width) - 1);
            break;
        }case 5:{//RIGHT
            directionCoordinates.x = (int) ceil((1 - zNormalized) * (width - 1));
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = 1 - ((float) x) / (((float) width) - 1);
            break;
        }case 2:{//TOP
            directionCoordinates.x = x;
            directionCoordinates.y = (int) ceil(zNormalized * ((float) (height - 1)));
            directionCoordinates.zNormalized = ((float) y) / (((float) height) - 1);
            break;
        }case 3:{//BOTTOM
            directionCoordinates.x = x;
            directionCoordinates.y = (int) ceil((1 - zNormalized) * (height - 1));
            directionCoordinates.zNormalized = 1 - ((float) y) / (((float) height) - 1);
            break;
        }default:{
            directionCoordinates.x = x;
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = zNormalized;
            break;
        }
    }

    if (mirror) {
        directionCoordinates.x = width - 1 - directionCoordinates.x;
    }

    return directionCoordinates;
}


EMSCRIPTEN_KEEPALIVE unsigned char *paraboloidCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    float kx,
    float ky,
    float kz,
    float dz
) {

    pixelStack.push(imageDataArray);

    DirectionCoordinates directionCoordinates = {
        .x = 0,
        .y = 0,
        .zNormalized = 0.0,
    };
    float xNormalized;
    float yNormalized;
    float zNormalized;
    unsigned char *pixelValue;
    int pixelNumber;

    for (int x = 0; x < width; x++) {
        for (int y = 0; y < height; y++) {
            xNormalized = ((float)x) / ((float)width);
            yNormalized = ((float)y) / ((float)height);
            zNormalized = xyParaboloid(0.5, 0.5, kx, ky, xNormalized, yNormalized) * kz + dz;
            //
            directionCoordinates = getDirectionCoordinates(direction, mirror, width, height, x, y, zNormalized);

            //
            if (x==(width- 1) && y == (height- 1)) {

                                     printf("33sdf %d %d %f %f\n", x, y, directionCoordinates.zNormalized, zNormalized);
                                    }

            pixelValue = pixelStack.getPixel(directionCoordinates.x, directionCoordinates.y, directionCoordinates.zNormalized);
            // pixelValue = new Uint8ClampedArray(4);
            //
            if (x==(width- 1) && y == (height- 1)) {
            printf("33.5sdf\n");
            }

            pixelNumber = (x + y * width) * 4;

            for (int i = 0; i < 4; i++) {
//                    if (x==(width -1) && y == (height-1)) {

                resultImage[pixelNumber + i] = pixelValue[i];
            }
            if (x==(width-1) && y == (height-1)) {
                        printf("33.10sdf\n");
                        }
//            resultImage.set(pixelValue, pixelNumber);


        }
    }

    printf("4sdf\n");

    return resultImage;
}
