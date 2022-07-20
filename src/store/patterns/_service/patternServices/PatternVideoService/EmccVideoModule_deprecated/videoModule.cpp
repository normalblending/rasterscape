#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <math.h>
#include <stdio.h>
#include <functional>
#include <algorithm>
#include "pixelStack.h"


extern "C" {
  // Declare this so it's exported as non-mangled symbol "_mycount"
  void setDepth(int depth);
  void initStack(int width, int height, int depth, int pushSide, int edgeMode);
  unsigned char *defaultCutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
      int mirror,
      double cutOffset
  );
  unsigned char *paraboloidCutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
    int mirror,
    double cutOffset,
      double kx,
      double ky,
      double kz,
      double dz
  );
  unsigned char *sis2CutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
    int mirror,
    double cutOffset,
      double cosA,
      double h,
      double xN,
      double yN,
      double xD,
      double yD,
      double XA,
      double xdd,
      double ydd
  );
  unsigned char *arrayXCutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
    int mirror,
    double cutOffset,
      int *valuesArray,
      double from,
      double to,
      int drawWidth,
      int drawHeight
  );
  unsigned char *arrayYCutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
    int mirror,
    double cutOffset,
      int *valuesArray,

      double from,
      double to,
      int drawWidth,
      int drawHeight
  );
  unsigned char *channelCutFunction(
      unsigned char *imageDataArray,
      int width,
      int height,
      int direction,
    int mirror,
    double cutOffset,
      unsigned char *depth1DataArray,
      int depth1width,
      int depth1height,
      double depth1zed,
      double depth1zd,
      int depth1component,
      unsigned char *depth2DataArray,
      int depth2width,
      int depth2height,
      double depth2zed,
      double depth2zd,
      int depth2component,
      unsigned char *depth3DataArray,
      int depth3width,
      int depth3height,
      double depth3zed,
      double depth3zd,
      int depth3component,
      unsigned char *depth4DataArray,
      int depth4width,
      int depth4height,
      double depth4zed,
      double depth4zd,
      int depth4component
  );
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


PixelsStack pixelStack;
unsigned char *resultImage;


EMSCRIPTEN_KEEPALIVE void setDepth(int depth) {
    pixelStack.setDepth(depth);
};

EMSCRIPTEN_KEEPALIVE void initStack(int width, int height, int depth, int pushSide, int edgeMode) {

    pixelStack.init(width, height, depth, pushSide, edgeMode);
//    printf("init stack\n");
    resultImage = new unsigned char[width * height * 4];
};


double xyParaboloid(double centerX, double centerY, double kx, double ky, double x, double y) {
    return (powf(x - centerX, 2) * kx + powf(y - centerY, 2) * ky);
}

double xySis2(double cosA, double h, double xN, double yN, double xD, double yD, double XA, double xdd, double ydd, double x, double y) {
    int W = 300;
    int H = 300;

    int xx = x * W;
    int yy = y * H;

    int xxmW2pxdd = xx - W / 2 + xdd;
    int yymH2pydd = yy - H / 2 + ydd;

    int r = (XA * sqrt(powf(xxmW2pxdd, 2) + powf(yymH2pydd, 2))
        + h
        + cosA * cos(
            sqrt(
                powf(xxmW2pxdd + xx * (xN / xD - 1), 2)
                + powf(yymH2pydd + yy * (yN / yD - 1), 2)
            )
        )) / W;

    return r;
}


double xyArrayX(int *valuesArray, double from, double to, int drawWidth, int drawHeight, int width, double x, double y) {

    int i = (int)floor(x * ((double)drawWidth));



    double coordinateValue = ((double)valuesArray[i]) / ((double)drawHeight);


    double amplitude = abs(to - from);
    double min = fmin(from, to);
    // const inverse = to < from;


    return min + amplitude * coordinateValue;
}

double xyArrayY(int *valuesArray, double from, double to, int drawWidth, int drawHeight, int height, double x, double y) {

    int i = (int)floor(y * ((double)drawWidth));


    double coordinateValue = ((double)valuesArray[i]) / ((double)drawHeight);

    double amplitude = abs(to - from);
    double min = fmin(from, to);
    // const inverse = to < from;


    return min + amplitude * coordinateValue;
}

double channels(
    unsigned char *depth1DataArray,
    int depth1width,
    int depth1height,
    double depth1zed,
    double depth1zd,
    int depth1component,
    unsigned char *depth2DataArray,
    int depth2width,
    int depth2height,
    double depth2zed,
    double depth2zd,
    int depth2component,
    unsigned char *depth3DataArray,
    int depth3width,
    int depth3height,
    double depth3zed,
    double depth3zd,
    int depth3component,
    unsigned char *depth4DataArray,
    int depth4width,
    int depth4height,
    double depth4zed,
    double depth4zd,
    int depth4component,
    int width,
    int height,
    double x,
    double y
) {

    double res = 0.0;

    if (depth1width) {
        int length = depth1width * depth1height * 4;

        int xnorm = (int)ceil(x * depth1width);
        int ynorm = (int)ceil(y * depth1height);

        int i = (int)fmax(fmin((xnorm + ynorm * depth1width) * 4 + depth1component, length), 0);

        res += ((double)depth1DataArray[i] / 255 * depth1zed) + depth1zd;
    }

    if (depth2width) {
        int length = depth2width * depth2height * 4;

        int xnorm = (int)ceil(x * depth2width);
        int ynorm = (int)ceil(y * depth2height);


        int i = (int)fmax(fmin((xnorm + ynorm * depth2width) * 4 + depth2component, length), 0);

        res += ((double)depth2DataArray[i] / 255 * depth2zed) + depth2zd;
    }

    if (depth3width) {
        int length = depth3width * depth3height * 4;

        int xnorm = (int)ceil(x * depth3width);
        int ynorm = (int)ceil(y * depth3height);


        int i = (int)fmax(fmin((xnorm + ynorm * depth3width) * 4 + depth3component, length), 0);

        res += ((double)depth3DataArray[i] / 255 * depth3zed) + depth3zd;
    }

    if (depth4width) {
        int length = depth4width * depth4height * 4;

        int xnorm = (int)ceil(x * depth4width);
        int ynorm = (int)ceil(y * depth4height);


        int i = (int)fmax(fmin((xnorm + ynorm * depth4width) * 4 + depth4component, length), 0);

        res += ((double)depth4DataArray[i] / 255 * depth4zed) + depth4zd;
    }

    return res;
}

struct DirectionCoordinates {
    int x;
    int y;
    double zNormalized;
};

DirectionCoordinates getDirectionCoordinates(
    int direction,
    int mirror,
    int width,
    int height,
    int x,
    int y,
    double z
) {
    DirectionCoordinates directionCoordinates = {
        .x = 0,
        .y = 0,
        .zNormalized = 0.0,
    };

    double zNormalized = fmax(fmin(z, 1), 0);


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
            directionCoordinates.x = (int) ceil(zNormalized * ((double)(width - 1)));
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = ((double) x) / (((double) width) - 1);
            break;
        }case 5:{//RIGHT
            directionCoordinates.x = (int) ceil((1 - zNormalized) * (width - 1));
            directionCoordinates.y = y;
            directionCoordinates.zNormalized = 1 - ((double) x) / (((double) width) - 1);
            break;
        }case 2:{//TOP
            directionCoordinates.x = x;
            directionCoordinates.y = (int) ceil(zNormalized * ((double) (height - 1)));
            directionCoordinates.zNormalized = ((double) y) / (((double) height) - 1);
            break;
        }case 3:{//BOTTOM
            directionCoordinates.x = x;
            directionCoordinates.y = (int) ceil((1 - zNormalized) * (height - 1));
            directionCoordinates.zNormalized = 1 - ((double) y) / (((double) height) - 1);
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

unsigned char *commonCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset,
    std::function<double (double, double)> zFunction
) {

    if (imageDataArray) {
        pixelStack.push(imageDataArray);
    }

    DirectionCoordinates directionCoordinates = {
        .x = 0,
        .y = 0,
        .zNormalized = 0.0,
    };
    double xNormalized;

    double yNormalized;
    double zNormalized;
    unsigned char *pixelValue;
    int pixelNumber;

    for (int x = 0; x < width; x++) {
        for (int y = 0; y < height; y++) {


            xNormalized = ((double)x) / ((double)width);
            yNormalized = ((double)y) / ((double)height);
            zNormalized = -cutOffset + zFunction(xNormalized, yNormalized) * (1.0 + cutOffset);




            //
            directionCoordinates = getDirectionCoordinates(direction, mirror, width, height, x, y, zNormalized);
//            if (x%10 ==0 && y%10 ==0) {
//
//             printf("-------- %d %d %d %d %f\n", x, y, directionCoordinates.x, directionCoordinates.y, directionCoordinates.zNormalized);
//            }
            //
//            if (x==(width- 1) && y == (height- 1)) {
//
//                                     printf("33sdf %d %d %f %f\n", x, y, directionCoordinates.zNormalized, zNormalized);
//                                    }

            pixelValue = pixelStack.getPixel(directionCoordinates.x, directionCoordinates.y, directionCoordinates.zNormalized);


//            if (x==(width- 1) && y == (height- 1)) {
//                printf("33.5sdf\n");
//            }




            pixelNumber = (x + y * width) * 4;

//            if ((pixelNumber + 3) >= (width * height * 4)) {
//                printf("1 out of bound");
//            }

            for (int i = 0; i < 4; i++) {
//                    if (x==(width -1) && y == (height-1)) {

                resultImage[pixelNumber + i] = pixelValue[i];
//                resultImage[pixelNumber + i] = 0;
            }
//            if (x==(width-1) && y == (height-1)) {
//                printf("33.10sdf\n");
//            }


        }
    }

//    printf("4sdf\n");

    return resultImage;
}

EMSCRIPTEN_KEEPALIVE unsigned char *defaultCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset
) {

    std::function<double (double, double)> zFunction = [](double x, double y) -> double {
        return 0;
    };


    return commonCutFunction(
        imageDataArray,
        width,
        height,
        direction,
        mirror,
        cutOffset,
        zFunction
    );
}

EMSCRIPTEN_KEEPALIVE unsigned char *paraboloidCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset,

    double kx,
    double ky,
    double kz,
    double dz
) {

    std::function<double (double, double)> zFunction = [kx, ky, kz, dz](double x, double y) -> double {
        return xyParaboloid(0.5, 0.5, kx, ky, x, y) * kz + dz;
    };

    return commonCutFunction(
        imageDataArray,
        width,
        height,
        direction,
        mirror,
        cutOffset,
        zFunction
    );
}

EMSCRIPTEN_KEEPALIVE unsigned char *sis2CutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset,
    double cosA,
    double h,
    double xN,
    double yN,
    double xD,
    double yD,
    double XA,
    double xdd,
    double ydd
) {

    std::function<double (double, double)> zFunction = [cosA, h, xN, yN, xD, yD, XA, xdd, ydd](double x, double y) -> double {
        return xySis2(cosA, h, xN, yN, xD, yD, XA, xdd, ydd, x, y);
    };

    return commonCutFunction(
        imageDataArray,
        width,
        height,
        direction,
        mirror,
        cutOffset,
        zFunction
    );
}

EMSCRIPTEN_KEEPALIVE unsigned char *arrayXCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset,
    int *valuesArray,
    double from,
    double to,
    int drawWidth,
    int drawHeight
) {

    std::function<double (double, double)> zFunction = [valuesArray, from, to, drawWidth, drawHeight, width](double x, double y) -> double {
        return xyArrayX(valuesArray, from, to, drawWidth, drawHeight, width, x, y);
    };

    return commonCutFunction(
        imageDataArray,
        width,
        height,
        direction,
        mirror,
        cutOffset,
        zFunction
    );
}

EMSCRIPTEN_KEEPALIVE unsigned char *arrayYCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset,
    int *valuesArray,
    double from,
    double to,
    int drawWidth,
    int drawHeight
) {

    std::function<double (double, double)> zFunction = [valuesArray, from, to, drawWidth, drawHeight, height](double x, double y) -> double {
        return xyArrayY(valuesArray, from, to, drawWidth, drawHeight, height, x, y);
    };

    return commonCutFunction(
        imageDataArray,
        width,
        height,
        direction,
        mirror,
        cutOffset,
        zFunction
    );
}


EMSCRIPTEN_KEEPALIVE unsigned char *channelCutFunction(
    unsigned char *imageDataArray,
    int width,
    int height,
    int direction,
    int mirror,
    double cutOffset,
    unsigned char *depth1DataArray,
    int depth1width,
    int depth1height,
    double depth1zed,
    double depth1zd,
    int depth1component,
    unsigned char *depth2DataArray,
    int depth2width,
    int depth2height,
    double depth2zed,
    double depth2zd,
    int depth2component,
    unsigned char *depth3DataArray,
    int depth3width,
    int depth3height,
    double depth3zed,
    double depth3zd,
    int depth3component,
    unsigned char *depth4DataArray,
    int depth4width,
    int depth4height,
    double depth4zed,
    double depth4zd,
    int depth4component
) {

//    printf("------- %d %d \n", depth1DataArray[400], depth1width);

    std::function<double (double, double)> zFunction = [
        depth1DataArray,
        depth1width,
        depth1height,
        depth1zed,
        depth1zd,
        depth1component,
        depth2DataArray,
        depth2width,
        depth2height,
        depth2zed,
        depth2zd,
        depth2component,
        depth3DataArray,
        depth3width,
        depth3height,
        depth3zed,
        depth3zd,
        depth3component,
        depth4DataArray,
        depth4width,
        depth4height,
        depth4zed,
        depth4zd,
        depth4component,
        width,
        height
    ](double x, double y) -> double {
        return channels(
            depth1DataArray,
            depth1width,
            depth1height,
            depth1zed,
            depth1zd,
            depth1component,
            depth2DataArray,
            depth2width,
            depth2height,
            depth2zed,
            depth2zd,
            depth2component,
            depth3DataArray,
            depth3width,
            depth3height,
            depth3zed,
            depth3zd,
            depth3component,
            depth4DataArray,
            depth4width,
            depth4height,
            depth4zed,
            depth4zd,
            depth4component,
            width, height,
            x, y
        );
    };

    return commonCutFunction(
        imageDataArray,
        width,
        height,
        direction,
        mirror,
        cutOffset,
        zFunction
    );
}
